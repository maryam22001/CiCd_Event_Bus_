//2- data base connection function with the server

const mongoose =require("mongoose");

const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.data_base_url)
        console.log("mongo connected")
    }catch{
        console.error("error")

    }

}
module.exports=connectDB;