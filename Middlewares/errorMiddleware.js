const AppError = require("../Utils/errorHandler")

let devErrors=(res,error)=>{
    res.status(error.statusCode).json({
        status:error.status,
        message:error.message,
        stack:error.stack,
        error
        })
}


let prodErrors=(res,error)=>{
    if(error.isOperational){

        res.status(error.statusCode).json({
        status:error.status,
        message:error.message,
        })
    }else{
        res.status(500).json({
        status:'error',
        message:'Something went wrong! please try again later.',
        
        })
    }
    
}

let castErrorHandler=(error,req)=>{
    let message=`Invalid value ${error.value} for field ${error.path}`
    error=new AppError(message,'mongosDb(castError)',400,req.originalUrl,req.body,req.method)

    //send to log file

    return error
}

let duplicatKeyErrorHandler=(error,req)=>{
    let message=`Movie with the name ${error.keyValue.name} already exist`
    error=new AppError(message,'mongooosDbDriver(duplicate key)',400,req.originalUrl,req.body,req.method)

    //send to logfile

    return error
}

let globalErrorHandler=(error,req,res,next)=>{
    
    error.statusCode=error.statusCode || 500
    error.status=error.status||'internal server error'

    if(process.env.NODE_ENV==='development'){
        devErrors(res,error)
    }

    if(process.env.NODE_ENV==='production'){
        let err = JSON.parse(JSON.stringify(error))//deep clone
        
        
        if(error.name==='CastError'){
           error= castErrorHandler(error,req)
           
        }
        if(error.code===Number(11000)){
           error= duplicatKeyErrorHandler(error,req)
           
        }
        prodErrors(res,error)  
    }
    
    
}

module.exports=globalErrorHandler