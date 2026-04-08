pipeline {
    agent any

    environment {
        ACR_NAME = "miniprodev"
        IMAGE_NAME = "miniprodev.azurecr.io/examiq:v${BUILD_NUMBER}"
    }

    stages {

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh '''
                    sonar-scanner \\
                        -Dsonar.projectKey=examiq \\
                        -Dsonar.sources=. \\
                        -Dsonar.host.url=http://40.81.241.126:9000 \\
                        -Dsonar.login=$SONAR_AUTH_TOKEN
                    '''
                }
            }
        }

        stage('OWASP Dependency Check') {
            steps {
                dependencyCheck additionalArguments: '--scan .', odcInstallation: 'DependencyCheck'
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                docker build -t $IMAGE_NAME .
                '''
            }
        }

        stage('Trivy Scan') {
            steps {
                sh '''
                trivy image --severity HIGH,CRITICAL $IMAGE_NAME
                '''
            }
        }

        stage('Push to ACR') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'acr-creds',
                    usernameVariable: 'ACR_USERNAME',
                    passwordVariable: 'ACR_PASSWORD'
                )]) {
                    sh '''
                    echo $ACR_PASSWORD | docker login $ACR_NAME.azurecr.io -u $ACR_USERNAME --password-stdin
                    docker push $IMAGE_NAME
                    '''
                }
            }
        }

       stage('Deploy to AKS') {
    steps {
        withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
            sh '''
            export KUBECONFIG=$KUBECONFIG

            kubectl get nodes
            kubectl apply -f k8s/ --validate=false
            kubectl set image deployment/examiq examiq=$IMAGE_NAME
            '''
        }
    }
}
    }
}
