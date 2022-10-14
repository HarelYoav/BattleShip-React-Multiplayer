pipeline {
     agent any
     stages {
        stage("Build") {
            steps {
                sh script: '''
                    cd client
                ''' 
                sh "sudo npm install"
                sh "sudo npm run build"
            }
        }
        stage("Deploy") {
            steps {
                sh "sudo rm -rf /var/www/jenkins-react-app"
                sh "sudo cp -r ${WORKSPACE}/client/build/ /var/www/jenkins-react-app/"
            }
        }
    }
}