//where we handels the logic and the functions 
//we nade the document 'pipline run'> 
//4-the crud functions logic
const PiplineRun =require("../models/Pipeline.js")

exports.createRun= async(req,res)=>{
     try{
console.log("data",req.body)
const run = await PiplineRun.create(req.body)
res.status(201).json({
    success:true,
    message:"doooooooooooooone",
    data:run
});
     }catch(error){

        console.log("Leaf w arg3")
        res.status(400).json({
            success:false,
    message:"no data found"
    
        })
     }



}