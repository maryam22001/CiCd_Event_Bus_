//api point > stats
const {successResponse,errorResponse}=require('../utils/apiResponse.js')
const {getStatsForRepo,getFlakyStages}=require('../services/statsService.js')
const PipelineRun=require('../models/Pipeline.js')

//api/stats/:repo
exports.getRepoStats = async (req, res) => {
    try{
        const {repo}=req.params;
        console.log(`fetching stats for repo :${repo}`)
        const stats =await getStatsForRepo(repo)
if(stats.length ===0){
    return successResponse(res,[],`stats not found`)
}
return successResponse(res,stats,`stats found`)
    }catch(error){
        console.log(error.message)
        errorResponse(res,error.message,500)
    
    }
}

//api/api/stats/:repo/summary

exports.getRepoSummary=async(req,res)=>{
    try{
const {repo}=req.params;
console.log(`generating summarry for repo :${repo}`)
//aggeegate across all the runs 
const summary = await PipelineRun.aggregate([
      { $match: { repo } },
      {
        $group: {
          _id: null,
          total_runs: { $sum: 1 },
          successful_runs: {
            $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] }
          },
          failed_runs: {
            $sum: { $cond: [{ $eq: ['$status', 'failure'] }, 1, 0] }
          },
          cancelled_runs: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          },
          avg_duration_ms: { $avg: '$totalDurationMs' },
          total_duration_ms: { $max: '$totalDurationMs' }
        }
      },
      {
        $project: {
          _id: 0,
          repo: repo,
          total_runs: 1,
          successful_runs: 1,
          failed_runs: 1,
          cancelled_runs: 1,
          success_rate: {
            $cond: [
  { $eq: ['$total_runs', 0] }, // 1. THE IF CONDITION: Is total_runs equal to 0?
  0,                           // 2. THE THEN STATEMENT (<<< 0 is the fallback value. It acts as a safety measure to prevent a "Division by Zero" error)
  { $round: [{ $multiply: [{ $divide: ['$successful_runs', '$total_runs'] }, 100] }, 2] } // 3. THE ELSE STATEMENT
]

          },
          avg_duration_ms: { $round: ['$avg_duration_ms', 0] },
          total_duration_ms: 1
        }
      }
    ]);

    if (summary.length === 0) {
      return successResponse(res, {
        repo: repo,
        total_runs: 0,
        message: 'No runs found for this repository'
      });
    }

    return successResponse(res, summary[0], 'Summary generated successfully');
    }catch(error){
        console.log(error.message)
        return errorResponse(res,error.message,500)
    }
}
//api/stats/flaky 

exports.getFlakyStages = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    console.log(`Fetching top ${limit} flaky stages`);

    const flakyStages = await getFlakyStages(limit);

    return successResponse(res, flakyStages, 'Flaky stages retrieved successfully');
  } catch (error) {
    console.error('Error fetching flaky stages:', error.message);
    return errorResponse(res, 'Server error while fetching flaky stages', 500);
  }
};