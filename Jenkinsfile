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
                    sh 'ls -al'
                    sh 'ls -al ./target'
                }
            }
        }

        stage('Docker Image Build & Push') {
            steps {
                sh 'docker -v'
            }
        }
    }
}
