//7-add the middleware: 
/**
 *   req ------middleware------controller
 *               |
                 stops the re1 when data is unvalid                   */           

//Auth : check if request came from the github
//logger: log every evemt hits your buss >dubug
//Error Handler: globel error unit the error shape 


const errorHandler =(err,req,res,next)=>{
    console.log(err)
    // determine status code
                      //if status code use it          if not use 500     
    const statusCode= err.statusCode ? err.statusCode : 500;
    //missing data>>400, db crash >>500
}


//json res >>>postman 
res.status(statusCode).json({
    success:false,
    error:err,
    message:err.message,
    stack:process.env.ENV ==="production"?null:err.stack

});