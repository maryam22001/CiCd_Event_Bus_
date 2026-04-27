//3-application logic:
/**configure express, the routes the middlewares like the brain   */

const express =require("express");

const app =express(); // i need an inctance from the app 
/**the middle ware :when the req arrive > it make sure how to hamdles it  */
//I will use postman for api test >> parse json body 
/**routes :when anew event happen >the route tells what to do with the middle wares */


const createRun=require("./routes/runRoute.js")
app.use(express.json())

app.use('/api/runs', createRun);//6

module.exports = app;