properties([pipelineTriggers([githubPush()])])

node{

    def sqli = false

    stage ('Checkout'){
        git branch: 'master', 
            credentialsId: 'GitScout',
            url: 'https://github.com/we45/Cut-The-Funds-NodeJS.git'
    }  
    
    stage('NpmAudit'){
        sh '''                                
        npm audit --json > audit-report.json | true
        '''
        archiveArtifacts allowEmptyArchive: true, artifacts: 'audit-report.json', onlyIfSuccessful: true  
    }
    try{
        stage('NodeJSScan'){
            sh '''
            nodejsscan -d $PWD -o report.json
            SQLi=$(cat report.json| jq '.sec_issues."SQL Injection (SQLi)"')

            if [ -n "$SQLi" ]; then
                exit 1;
            fi
            
            '''
            archiveArtifacts allowEmptyArchive: true, artifacts: 'report.json', onlyIfSuccessful: true
        }
    } catch(e) {
        sqli = true
        echo e.toString()  
    }

    if(sqli) {
        currentBuild.result = "FAILURE"
    } else {
        currentBuild.result = "SUCCESS"
    }

}

