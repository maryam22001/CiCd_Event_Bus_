//3-application logic:
/**configure express, the routes the middlewares like the brain   */

const express =require("express");

const app =express(); // i need an inctance from the app 
/**the middle ware :when the req arrive > it make sure how to hamdles it  */
//I will use postman for api test >> parse json body 
/**routes :when anew event happen >the route tells what to do with the middle wares */
const errorHandler = require('./middlewares/errorMiddleware.js');


const runRoute = require("./routes/runRoute.js")
const statsRoute = require("./routes/statsRoutes.js")
const webHookRoute=require('./routes/webhookRoutes.js')

/**const {createRun,geyAllRuns,getRunById}=require("./routes/runRoute.js")
didn't exported out individual functions; 
it exporteded out a Router .
Because Node.js couldn't find those individual functions on the outside of the box, 
it grabbed nothing (undefined).
 When Express tried to use "nothing", it crashed.
*/
app.use(express.json())

app.use('/api/runs', runRoute);//6
// CRITICAL: The Error Handler MUST be the last middleware added to app.js

app.use('/api/stats', statsRoute);  
app.use('/api/webhook', webHookRoute)

app.use(errorHandler);
module.exports = app;