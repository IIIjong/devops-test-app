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
              - name: maven
                image: maven:3.9.9-eclipse-temurin-21-alpine
                command:
                - cat
                tty: true
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

    stages {
        stage('checkout') {
            steps {
                container('maven') {
                    sh 'pwd'
                    sh 'ls -al'
                    // sh 'mvn package'
                    // sh 'ls -al'
                    // sh 'ls -al ./target'
                }
            }
        }

        stage('Docker Image Build & Push') {
            steps {
                container('docker') {
                    sh 'docker -v'
                    sh 'docker images iiijong/department-service'
                }
            }
        }
    }
}
