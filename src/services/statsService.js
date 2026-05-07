//**the Bridge between the 3 models  
// logic behiend handling the pipleine runs

/**  PiplineRun                 ------> StageStat                      
  every run(saved in PiplineRun)-------> stat update 
               |
               |
runs automatically every time a document is saved  
     

  */
/**
 * updateStageStats(run):
Called after creating a new run
For each stage, it increments total_runs and failure_count
Uses $inc to atomically increment (prevents race conditions)
upsert: true creates the stats document if it doesn't exist
Recalculates flakiness_score and avg_duration_ms
getStatsForRepo(repo):

Returns all stage stats for a specific repo
Sorted by flakiness (worst stages first)
getFlakyStages(limit):

Returns the top N flaky stages across all repos
 */       

const StageStats = require('../models/StatgeStats.js')

exports.updateStageStats = async(run)=>{
   try{
    const pipelineStages = run.jobs && run.jobs.length > 0 ? run.jobs : (run.stages || []);
    console.log(`update stats called for ${pipelineStages.length} stages in ${run.repo}`)
   //loop through each stage in the run
    for (const stage of pipelineStages){
const isFailure=stage.status==='failure' ? 1 : 0 
//find the stats document for this repo+ stag , or create if doesnt exit
const stats =await StageStats.findOneAndUpdate({
  repo:run.repo,
  stage_name:stage.name
},{
    //inc counter
    $inc:{
        total_runs:1,
      failure_count:isFailure,
      total_duration_ms:stage.durationMs,
      
    },
    $set:{

        last_updated:Date.now()
    }
  },{
    upsert:true , //create a docuument of doesnt exist
    new:true
  })

//calculate the flaknies 
stats.flakiness_score= stats.total_runs > 0
        ? parseFloat((stats.failure_count / stats.total_runs).toFixed(4))
        : 0;
stats.avg_duration_ms=stats.total_runs > 0 
? Math.round(stats.total_duration_ms/stats.total_runs) :0
await stats.save()


 }
}
   catch(error){
    console.log(error.message)
  }

}
//get all the stats is the repo > the most flaky dirst

exports.getStatsForRepo =async(repo)=>{
    return await StageStats.find({repo}).sort({flakiness_score:-1})
 
}
//get tje flakiest stages across
exports.getFlakyStages = async (limit=10)=>{
    return await StageStats.find().sort({flakiness_score:-1}).limit(limit)

}

//>> call it in the create run controller >si the stats update happens auti=aumatiically 