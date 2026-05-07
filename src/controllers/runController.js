//where we handels the logic and the functions 
//we nade the document 'pipline run'> 
//4-the crud functions logic(requests logic)
const PiplineRun =require("../models/Pipeline.js")
const { successResponse, errorResponse } = require("../utils/apiResponse.js");
const {updateStageStats}=require('../services/statsService.js')

exports.createRun= async(req,res)=>{
     try{
console.log("data",req.body)
const run = await PiplineRun.create(req.body)
//>>>Update stage stats
await updateStageStats(run)

successResponse(res, run, "doooooooooooooone", 201);
     }catch(error){

     /**    console.error("Leaf w arg3:", error);
        res.status(400).json({
            success:false,
    message:error.message*
    
        })
    **/
   //using util 
   errorResponse(res, error.message, 400);
     }
};
//Read All RUns
exports.geyAllRuns=async(req,res)=>{
    try {
        //use: filter for search operation 
        //use : pagination for display n items per time 
        //1-extract the filters from url query params 
        const {repo , branch , status ,page=1 ,limit=10}=req.query

        //2-build filter Obj :
        const filter={}
        if (repo) filter.repo=repo;
        if (branch) filter.branch=branch;
        if (status)filter.status=status;

        //3-pagination:
        const skip =(page-1)*limit;/** p1  (1-1)*10  0
                                       p2            1
                                       */
        const runs =await PiplineRun.find(filter)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({createdAt:-1})//newest first
        const total =await PiplineRun.countDocuments(filter)
         
        successResponse(res, { runs, total }, "Successfully retrieved runs", 200);
    } catch (error) {
        errorResponse(res, error.message, 500);
    }


}

exports.getRunById=async(req,res)=>{
    try{
        const{run_id}=req.params;
        console.log("run_id",run_id)
        const run=await PiplineRun.findOne({ runId: run_id });
        /*indById() specifically searches MongoDB's built-in _id field.
         Mongoose expects this _id to be a strictly formatted 24-character hex string (called an ObjectId). 
         When you passing "dvfjnb201", Mongoose tried to convert (or "cast") 
         it into an ObjectId and failed,
         resulting in a crash.*/
        if(!run){
 return errorResponse(res,"run not found",404)
        }
return successResponse(res,run,"run found",200)

}catch(error){
    console.log(error.message)
    errorResponse(res,error.message,500)

}
}

//Update All Runs

exports.updateRun = async (req, res) => {
  try {
    const { run_id } = req.params;
    
    console.log('Updating run:', run_id);
    console.log('Update data:', req.body);

    // Find and update the run
    const run = await PipelineRun.findOneAndUpdate(
      { run_id: run_id },      // Find by run_id
      { $set: req.body },      // Update with new data
      { 
        new: true,             // Return the updated document
        runValidators: true    // Run schema validation on update
      }
    );

    // If run not found
    if (!run) {
      return errorResponse(res, `Run with id '${run_id}' not found`, 404);
    }

    return successResponse(res, run, 'Run updated successfully');
    
  } catch (error) {
    console.error('Error updating run:', error.message);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return errorResponse(res, error.message, 400);
    }
    
    return errorResponse(res, 'Server error while updating run', 500);
  }
};

//Delete All RUns 
exports.deleteRun = async (req, res) => {
  try {
    const { run_id } = req.params;
    
    console.log('Deleting run:', run_id);

    // Find and delete the run
    const run = await PipelineRun.findOneAndDelete({ run_id: run_id });

    // If run not found
    if (!run) {
      return errorResponse(res, `Run with id '${run_id}' not found`, 404);
    }

    return successResponse(
      res, 
      { run_id: run_id, deleted: true }, 
      'Run deleted successfully'
    );
    
  } catch (error) {
    console.error('Error deleting run:', error.message);
    return errorResponse(res, 'Server error while deleting run', 500);
  }
};


