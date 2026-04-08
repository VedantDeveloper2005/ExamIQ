pipeline {
agent any

environment {
    ACR_NAME = "examiqacr123"
    IMAGE_NAME = "examiqacr123.azurecr.io/examiq:v10"
    SONAR_HOST_URL = "http://20.244.30.137:9000"
}

stages {

    stage('Checkout') {
        steps {
            checkout scm
        }
    }

    stage('SonarQube Analysis') {
        steps {
            withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                sh '''
                docker run --rm \
                  -v $(pwd):/usr/src \
                  sonarsource/sonar-scanner-cli \
                  -Dsonar.projectKey=examiq \
                  -Dsonar.sources=. \
                  -Dsonar.host.url=$SONAR_HOST_URL \
                  -Dsonar.login=$SONAR_TOKEN
                '''
            }
        }
    }

    stage('OWASP Dependency Check') {
        steps {
            sh '''
            mkdir -p odc-data

            docker run --rm \
              -v $(pwd):/src \
              -v $(pwd)/odc-data:/usr/share/dependency-check/data \
              owasp/dependency-check \
              --scan /src \
              --format HTML \
              --out /src/odc-report \
              --noupdate || true
            '''
        }
    }

    stage('Build Docker Image') {
        steps {
            sh '''
            docker build -t examiqacr123.azurecr.io/examiq:v10 .
            '''
        }
    }

    stage('Trivy Scan') {
        steps {
            sh '''
            docker run --rm \
              -v /var/run/docker.sock:/var/run/docker.sock \
              aquasec/trivy:0.50.0 image --severity HIGH,CRITICAL $IMAGE_NAME
            '''
        }
    }

    stage('Push to ACR') {
        steps {
            withCredentials([usernamePassword(
                credentialsId: 'acr-creds',
                usernameVariable: 'ACR_USER',
                passwordVariable: 'ACR_PASS'
            )]) {
                sh """
                echo $ACR_PASS | docker login examiqacr123.azurecr.io -u $ACR_USER --password-stdin
                docker push examiqacr123.azurecr.io/examiq:v10
                """
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

post {
    always {
        archiveArtifacts artifacts: 'odc-report/**/*', fingerprint: true
    }
}
}
