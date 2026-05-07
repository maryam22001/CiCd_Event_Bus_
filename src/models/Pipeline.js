/** 1-design the shcma
 * it will be like a blue print for the pipline 's charachteristics
 
 */
const mongoose = require("mongoose")
const updateStats = require("../services/statsService.js")
const PipelineRunSchema= new mongoose.Schema({
runId:{type:String ,required:true ,unique:true},
repo:{type:String ,required:true },
branch: { type: String, required: true },
  
  // Status & Timing
  status: { type: String, enum: ['success', 'failure', 'cancelled', 'in_progress'] },
  totalDurationMs: Number,
  createdAt: { type: Date, default: Date.now, index: true }, // Index for trend charts

  // NESTED JOBS: Stage >build ,test ,deploy>characteristichs 
  jobs: [{
    name: { type: String, required: true }, // e.g., "Unit Tests"
    status: { type: String, required: true }, // e.g., "failure"
    durationMs: Number
  }]


})
PipelineRunSchema.index({repo:1,branch:1,createdAt:-1}) // I want to be able to search bu the repo and branch 
module.exports = mongoose.model('PipelineRun', PipelineRunSchema);
//>PiplineRun: table 



//the hook that trrigers the service to update the stars
PipelineRunSchema.post('save',async function(doc,next){
  try{
    await updateStats(doc)
    next()

  }catch(error){
    console.log(error.message)
    next(error)
  }

  
})