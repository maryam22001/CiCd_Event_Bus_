//the body of the program 
require('dotenv').config();
const app =require("./src/app.js")
const port=process.env.PORT||8000
const connectDB = require("./src/config/connectDB.js")


connectDB();
app.listen(port,()=>{
    console.log("ylaaahwaaaaaaaaaaaaaaaaaaaay")
})