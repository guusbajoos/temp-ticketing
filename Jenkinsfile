pipeline {
    agent any
    stages {
        stage("Deploy to cloudFront") {
            steps {
		sh 'npm install'
		sh 'npm run deploy:stag'
            }
        }
    }
}
