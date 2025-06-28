class AppError extends Error{
    constructor(message,errorType,statusCode,reqUrl,reqBody,reqMethod){
        super(message)
        this.errorType=errorType
        this.statusCode=statusCode
        this.status=statusCode >=400 && statusCode <=599 ? 'fail':'error'
        this.reqUrl=reqUrl
        this.reqBody= reqBody || {}
        this.reqMethod=reqMethod

        this.isOperational=true
        Error.captureStackTrace(this,this.constructor)
    }
}

module.exports=AppError