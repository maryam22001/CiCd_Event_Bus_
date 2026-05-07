/**handle the incoming webhook  */
/**
 Checks if it's a workflow_run event
Checks if the action is completed
Parses the workflow data
Fetches the jobs (stages) from GitHub's API
Checks if we already processed this run (avoid duplicates)
Saves to database
Updates stats automatically */

const PiplineRun = require("../models/Pipeline.js");
const { successResponse, errorResponse } = require("../utils/apiResponse.js");
const { updateStageStats } = require("../services/statsService.js");
const{parseWorkflowRun,parseJobs}=require('../utils/githubParser.js')
const axios = require('axios') 

// api/webhook/github
exports.handleWebhook = async (req, res) => {
  try {
    const event =req.headers['x-github-event']
    const payload =req.body
    console.log(`github event :${event}`)
    if (event !== 'workflow_run') {
        return successResponse(res, null, 'Event ignored (not workflow_run)');
    }
    if (payload.action !== 'completed') {
    return successResponse(res, null, 'Event ignored (not completed)');
}
    console.log(`processing work flow run:${payload.workflow_run.id}`)

//1-parse the basic run data
const runData=parseWorkflowRun(payload)
//2-fetch the jobs for the workflow run 
const jobsUrl = payload.workflow_run.jobs_url;
console.log(`jobsUrl:${jobsUrl}`)

const jobsResponse =await axios.get(jobsUrl,{
    headers:{
        'Accept':'application/vnd.github.v3+json'
          // 'Authorization': `token ${process.env.GITHUB_TOKEN}`

    }
}
)
//3-parse the jobs into stages
runData.stages=parseJobs(jobsResponse.data.jobs)
//4-check for dublicates
const existingRun =await PiplineRun.findOne({runId:runData.runId})
if(existingRun){
    console.log(`Dublicaaaaaaaaaate ${runData.runId}`)
}

//5-save
const run =await PiplineRun.create(runData)
//6-update stats
await updateStageStats(run)
console.log(`${run.runId} successfully proccessed`)
return successResponse(res, { run_id: run.run_id }, 'Webhook processed successfully');

  } catch (error){
    console.error('Error processing webhook:', error.message);
return
    return successResponse(res, null, 'Webhook received (processing failed)');

  }
}