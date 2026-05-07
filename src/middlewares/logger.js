/**his will log every request so you can see what is happening in your server in real-time. */
//8 realtime logging
const requestLogger = (req,res,next)=>{
    const timestamp = new Date().toISOString();
    //next >>so the request wont hang forever 
}

module.exports=requestLogger;