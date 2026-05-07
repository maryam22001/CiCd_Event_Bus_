/**to turn github format to pipline schema format */
/**webhook payload: is what an application sent to another when the event happen */
/**A payload is almost always a JSON object. 
 *It contains:

The Event Type: What happened? ( workflow_run, push, pull_request).

The Action: Was it created, completed, or deleted?

The Data: Detailed information about the event (the Repo name, the commit message, the person who pushed the code).
          Input (Raw Payload)                ----------------->                         Output (formated)
A 500-line JSON with 50+ properties.            Parsing            A clean 10-line object that fits into PipelineRun schema.
**/

/**
 * ==============================================================================
 * Webhook Payload Ingestion Flow
 * ==============================================================================
 *
 * how raw data from an external event (like GitHub) is transformed and saved into our local database?
 *
 * ┌────────────────┐           (A)            ┌─────────────────────────┐
 * │ EXTERNAL EVENT │   ------------------->   │      WEBHOOK POST       │
 * │ (e.g. GitHub,  │    Sends HTTP Request    │ /api/webhooks/github    │
 * │ GitLab, etc.)  │     + Raw JSON PAYLOAD   └───────────┬─────────────┘
 * └────────────────┘                                      │
 * (B) Hands raw
 * payload to
 * Parser
 * │
 * ┌────────────────┐           (C)            ┌───────────▼─────────────┐
 * │  DB SCHEMA     │   <-------------------   │   PARSER FUNCTION       │
 * │ (PipelineRun)  │     Returns formatted    │                         │
 * │ { "jobs": [] } │      data { jobs: [] }   │ .parseWorkflowRun(json) │
 * └───────▲────────┘                          │ .parseJobs(array)       │
 * │                                   └─────────────────────────┘
 * │
 * (D) Saved
 * to DB
 *
 * ==============================================================================
 * EXPLANATION:
 * (A) The Event (e.g., CI build finishes). GitHub sends the RAW PAYLOAD
 * (giant JSON) to our URL.
 * (B) Our Route catches the POST and passes the body (the Payload) to our
 * parser utilities.
 * (C) The Parser DIGESTS the raw payload, filtering out garbage data and
 * mapping GitHub's key names to match OUR Schema's key names.
 * (D) The clean, parsed object is saved to MongoDB.
 * ==============================================================================
 */
exports.parseWorkflowRun=(githubEvent)=>{
const workflowRun = githubEvent.workflow_run;

//calculate duration ?
const startTime=new Date(workflowRun.created_at);
const endTime = new Date(workflowRun.updated_at);
const duration = endTime - startTime;

 const statusMap = {
    'success': 'success',
    'failure': 'failed',
    'cancelled': 'cancelled',
    'skipped': 'cancelled',
    'timed_out': 'failed'
  };
  return{
    runId:String(workflowRun.id),
    repo:workflowRun.repository.full_name,
    branch:workflowRun.head_branch,
    commit_sha: workflowRun.head_sha,
    status: statusMap[workflowRun.conclusion] || 'failed',
    triggered_by: workflowRun.event,
    started_at: workflowRun.created_at,
    duration_ms: duration,
    stages: []  // We'll populate this from jobs API 
  }
}

/**parse Github workflow jobs into the stages format  */
exports.parseJobs=(jobs)=>{
    return jobs.map(job=>{
        const startTime=job.started_at ? new Date(job.created_at):null;
        const endTime = job.completed_at ? new Date(job.completed_at):null;
        
        const duration = startTime && endTime ? endTime - startTime :0;
        const statusMap = {
            'success': 'success',
            'failure': 'failed',
            'cancelled': 'cancelled',
            'skipped': 'skipped'
            
          }
          return {
            name : job.name,
            status: statusMap[job.conclusion] || 'failed',
            duration_ms: duration,
          }
          

    })

}