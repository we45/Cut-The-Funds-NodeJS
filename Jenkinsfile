node{
    stage('NpmAudit'){
        sh 'npm audit --json >> audit-report.json | true'
        archiveArtifacts allowEmptyArchive: true, artifacts: '**/audit-report.json', onlyIfSuccessful: true
    }
    stage('NodeJSScan'){
        sh '''
        nodejsscan -d $PWD -o report
        '''
        archiveArtifacts allowEmptyArchive: true, artifacts: '**/report.json', onlyIfSuccessful: true
    }
}