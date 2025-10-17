pipeline {
    agent {
        kubernetes {
            yaml '''
            apiVersion: v1
            kind: Pod
            metadata:
              name: jenkins-agent
            spec:
              containers:
              - name: docker
                image: docker:28.5.1-cli-alpine3.22
                command:
                - cat
                tty: true
                volumeMounts:
                - mountPath: "/var/run/docker.sock"
                  name: docker-socket
              volumes:
              - name: docker-socket
                hostPath:
                  path: "/var/run/docker.sock"
            '''
        }
    }

    environment {
        APP_IMAGE_NAME = 'iiijong/university-vue'
        API_IMAGE_NAME = 'iiijong/department-service'
        DOCKER_CREDENTIALS_ID = 'dockerhub-access'
        DISCORD_WEBHOOK_CREDENTIALS_ID = 'discord-webhook'
    }

    stages {

        stage('Detect Changes') {
            steps {
                script {
                    def changedFiles = sh(script: 'git diff --name-only HEAD~1', returnStdout: true).trim().split("\\n")
                    echo "Changed files:\n${changedFiles.join('\n')}"

                    env.SHOULD_BUILD_APP = changedFiles.any { it.startsWith("university-vue/") } ? "true" : "false"
                    env.SHOULD_BUILD_API = changedFiles.any { it.startsWith("department-api/") } ? "true" : "false"

                    echo "SHOULD_BUILD_APP : ${env.SHOULD_BUILD_APP}"
                    echo "SHOULD_BUILD_API : ${env.SHOULD_BUILD_API}"
                }
            }
        }

        stage('Docker Login') {
            steps {
                container('docker') {
                    withCredentials([usernamePassword(
                        credentialsId: "${DOCKER_CREDENTIALS_ID}",
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )]) {
                        sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
                    }
                }
            }
        }

        stage('APP Image Build & Push') {
            when {
                expression { env.SHOULD_BUILD_APP == "true" }
            }
            steps {
                container('docker') {
                    dir('university-vue') {
                        script {
                            def buildNumber = "${env.BUILD_NUMBER}"
                            withEnv(["DOCKER_IMAGE_VERSION=${buildNumber}"]) {
                                sh 'docker -v'
                                sh 'echo $APP_IMAGE_NAME:$DOCKER_IMAGE_VERSION'
                                sh 'docker build --no-cache -t $APP_IMAGE_NAME:$DOCKER_IMAGE_VERSION ./'
                                sh 'docker image inspect $APP_IMAGE_NAME:$DOCKER_IMAGE_VERSION'
                                sh 'docker push $APP_IMAGE_NAME:$DOCKER_IMAGE_VERSION'
                            }
                        }
                    }
                }
            }
        }

        stage('API Image Build & Push') {
            when {
                expression { env.SHOULD_BUILD_API == "true" }
            }
            steps {
                container('docker') {
                    dir('department-api') {
                        script {
                            def buildNumber = "${env.BUILD_NUMBER}"
                            withEnv(["DOCKER_IMAGE_VERSION=${buildNumber}"]) {
                                sh 'docker -v'
                                sh 'echo $API_IMAGE_NAME:$DOCKER_IMAGE_VERSION'
                                sh 'docker build --no-cache -t $API_IMAGE_NAME:$DOCKER_IMAGE_VERSION ./'
                                sh 'docker image inspect $API_IMAGE_NAME:$DOCKER_IMAGE_VERSION'
                                sh 'docker push $API_IMAGE_NAME:$DOCKER_IMAGE_VERSION'
                            }
                        }
                    }
                }
            }
        }
        stage('Trigger k8s-manifests Job') {
            steps {
                script {
                    def buildNumber = "${env.BUILD_NUMBER}"

                    withEnv(["DOCKER_IMAGE_VERSION=${buildNumber}"]) {
                        build job: 'university-k8s-manifests',
                            parameters: [
                                string(name: 'DOCKER_IMAGE_VERSION', value: "${DOCKER_IMAGE_VERSION}"),
                                string(name: 'DID_BUILD_APP', value: "${env.SHOULD_BUILD_APP}"),
                                string(name: 'DID_BUILD_API', value: "${env.SHOULD_BUILD_API}")
                            ],
                            wait: true
                    }
                }
            }
        }
    }

    post {
        always {
            withCredentials([string(
                credentialsId: "${DISCORD_WEBHOOK_CREDENTIALS_ID}",
                variable: 'DISCORD_WEBHOOK_URL'
            )]) {
                discordSend description: """
                제목 : ${currentBuild.displayName} 빌드
                결과 : ${currentBuild.result}
                실행 시간 : ${currentBuild.duration / 1000}s
                """,
                result: currentBuild.currentResult,
                title: "${env.JOB_NAME} : ${currentBuild.displayName}", 
                webhookURL: "${DISCORD_WEBHOOK_URL}"
            }
        }
    }
}
