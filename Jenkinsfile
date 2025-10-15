pipeline {
    agent any

    stages {
        stage('checkout') {
            steps {
                sh 'pwd'
                sh 'ls -al'
                sh 'mvn clean'
            }
        }
    }
}
