/**
 * t reaches out to GitHub's history, sucks in all the past pipeline data for a specific project (like VS Code), cleans it up, and stores it in your MongoDB.
 */
/**
 * 1-get a list of the most recent pipline runs from github (compeleted runs)
 * 2-take`jobs_url`and fetches the individual steps inside a specific run --> get the stages (build,test,Deploy)
 *           
 *3-    Preventoverlap(delet old datafor that repo)   <---------seedDatabase-------->loops throuh ever run github gave                  
 *                                                                  |
 *                                                                  |
 *                                                    call `parseWorkflowRun` and `parse Jobs` *         
 *4-every time a run is saved ------->calls updateStageStats(savedRun)--------> analytical cahrts are build automatically  as the data is imported 
 * */
 require('dotenv').config();
 const axios = require('axios');
 const mongoose=require('mongoose')
 const PiplineRun=require('../models/Pipeline.js')
 const {parseWorkflowRun,parseJobs}=require('../src/utils/githubParser.js')
 const {updateStageStats}=require('../src/services/statsService.js')

 //configration :
 const RepoOwner = process.env.REPO_OWNER;
 const RepoName = process.env.REPO_NAME;
 const RunsToFetch = process.env.RUNS_TO_FETCH;
 const GitHubToken = process.env.GITHUB_TOKEN;

const connectDB = async () => {
  try {
await mongoose.connect(process.env.data_base_url)
console.log('MongoDB connected')
  }catch(error){
    console.log(error.message)
    process.exit(1)

  }
}
//1- fetch workflows runs from github

const fetchWorkflowRuns = async () => {
    try{
const headers ={
     'Accept': 'application/vnd.github.v3+json'}
     if (GITHUB_TOKEN) {
      headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }
    console.log(`fetch workflows runs from github ${REPO_NAME}/${REPO_OWNER}`)
    const response = await axios.get(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/actions/runs`,
            {headers,
            params:{per_page:RunsToFetch,
            status:'compeleted'
        }
    }
    )
    
    console.log(`feteched ${response.data.workflow_runs.length} runs from github`)
   return response.data.workflow_runs;

}catch(error){
    if(error.reponse?.status===403){
        console.log(' Rate limit exceeded! Add GITHUB_TOKEN to .env for higher limits.')
    }else{
        console.log(error.message)
        process.exit(1)

    }
}

}
  

//seed Database

const seedDatabase = async (runs) => {
    await connectDB();
    console.log('clean existinig runs for this repo ...........')

    const deleted =await PiplineRun.deleteMany({repo:`${RepoOwner}/${RepoName}`})
    console.log(`deleted ${deleted.deletedCount} existingruns`)

//fetch runs from github
const githubRuns = await fetchWorkflowRuns();


}




