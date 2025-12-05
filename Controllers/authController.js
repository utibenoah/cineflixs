const UsersModel=require('../Models/usersModels')
const crypto=require('crypto')

const asyncErrorHandler=require('../Utils/asyncErrorHandler')
const emailSendingHandler=require('../Utils/emailSendingHandler')

const jwt=require('jsonwebtoken')
const utils=require('util')
const AppError=require('../Utils/errorHandler')


let signInToken=(email)=>{
    return jwt.sign({email:email},process.env.SECRET_STR,{expiresIn:process.env.LOGIN_EXPIRES})

}

let createSendResponse=(user,statusCode,message,res)=>{
    let token=signInToken(user.email)
    user.password=undefined
    user.passwordChangeAt=undefined
    user.role=undefined


    //set cookies
        let options={
            maxAge:process.env.LOGIN_EXPIRES,
            httpOnly:true
        }

        if(process.env.NODE_ENV==='production'){
            options.secure=true
        }

    res.cookie('jwt',token,options)
    res.status(statusCode).json({
        status:"sucesss",
        message:message,
        token,
        data:{
            user
        }
        
    })

}



//SIGNUP ROUTE HANDLER
exports.signUp=asyncErrorHandler(async (req,res)=>{
    let newUser= await UsersModel.create(req.body)
       
    createSendResponse(newUser,201,'User created',res)

})



//LOGIN ROUTE HANDLER

exports.login=asyncErrorHandler(async (req,res,next)=>{
    const {email,password}=req.body
    let message,error

    // Both email and password are empty
    if(!email && !password){
        message='email and password are empty'
        error=new AppError(message,'Bad Request',400,req.originalUrl,req.body,req.method)
        return next(error)
    }
    // Password is given but email is empty
    if(!email && password){
        message='email is empty'
        error=new AppError(message,'Bad Request',400,req.originalUrl,req.body,req.method)
        return next(error)
    }
    // Email is given but password is empty
    if(email && !password){
        message='password is empty'
        error=new AppError(message,'Bad Request',400,req.originalUrl,req.body,req.method)
        return next(error)
    }


    //check if the user exit in the db
    let user=await UsersModel.findOne({email}).select('+password')

    //check if email exits or password is match

    if(!user || !(await user.comparePassword(password,user.password)) ){
        message='Invalid user credentials'
        error=new AppError(message,'Unauthorized',401,req.originalUrl,req.body,req.method)
        return next(error)
    }



createSendResponse(user,200,'User login successfully',res)

})



//PROTECTED ROUTE HANDLER
exports.protected=asyncErrorHandler(async(req,res,next)=>{
    // get authoriZation token and check if exit
    let testToken=req.headers.authorization
    let token;
    if(testToken && testToken.startsWith('Bearer')){
        token=testToken.split(' ')[1]
    }


    
    if(!token){
       let message='You are not logged in'
       let error=new AppError(message,'Unauthorized',401,req.originalUrl,req.body,req.method)
        return next(error) 
    }
    // validate token
    let decodeToken=await utils.promisify(jwt.verify)(token,process.env.SECRET_STR)


    //check if user exit
    let user=await UsersModel.findOne({email:decodeToken.email})
     if(!user){
       let  message='User does not exit'
        let error=new AppError(message,'Unauthorized',401,req.originalUrl,req.body,req.method)
        return next(error)
     }

     // check if the user check password
     
     let isPasswordChange= user.isPasswordChange(decodeToken.iat)
    
     if(isPasswordChange){
        let message='Password was change. Login again'
        let error=new AppError(message,'Unauthorized',401,req.originalUrl,req.body,req.method)
        return next(error)
     }

     //allow user to access
     req.user=user

    next()

})

exports.restricted=(role)=>{
    return (req,res,next)=>{
        let userRole=req.user.role

        //Error:if userRole is not equal to role
        if(userRole !== role){
            let message='You do not have permission to perform this operation'
            let error=new AppError(message,'Forbidden',403,req.originalUrl,req.body,req.method)
            return next(error)
        }

        next()
    }
}

exports.forgotPassword=asyncErrorHandler(async (req,res,next)=>{
    // check if user exit
    let userEmail=req.body.email
    let user=await UsersModel.findOne({email:userEmail})// query db with user email

    if (!user) {
        let message=`Email does not exit`
        let error=new AppError(message,'Forbidden',404,req.originalUrl,req.body,req.method)
        return next(error)
    }
    
    //Generate reset passord token
    let token=user.createPasswordResetToken()
    await user.save({validateBeforeSave:false})



    // send token to user
    let resetUrl=`${req.protocol}://${req.get('host')}/api/v1/users/resetpassword/${token}`
    let message=`We have received request to reset password \n  Kindly ignore if you need not make this reauest
     Clicke the link below to reset password \n
    ${resetUrl}`


    try {
            await emailSendingHandler({
                email:user.email,
                subject:'password change request received',
                message:message
            })
            
            res.status(200).json({
                status:'success',
                message:'Reset token send successfully. Kindly check your mail',
            })

    } catch{
        user.passwordResetToken=undefined
        user.passwordResetTokenExpire=undefined

        await user.save({validateBeforeSave:false})


        let message=`An error occurred while sending password reset token, please try again later`
        
        let error=new AppError(message,'Server error',500,req.originalUrl,req.body,req.method)
       
        return next(error)
    }

})


exports.resetPassword=asyncErrorHandler(async (req,res,next)=>{

    
    let reqResetToken=req.params.token
    let token=crypto.createHash('sha256').update(reqResetToken).digest('hex')
   

    let user=await UsersModel.findOne({passwordResetToken:token})

    //error checking
    if (!user) {
        let message=`Invalid password reset token`
        let error=new AppError(message,'Forbidden',400,req.originalUrl,req.body,req.method)
        return next(error)
    }

    let checkTokenExpirationTime=user.passwordResetTokenExpire> Date.now()//check expiration time
    
    if(!checkTokenExpirationTime){
        let message=`Password reset token has expire`
        let error=new AppError(message,'Forbidden',400,req.originalUrl,req.body,req.method)
        return next(error)
    }

// resetting user password
   user.password=req.body.password
   user.confirm_password=req.body.confirm_password
   user.passwordResetToken=undefined
   user.passwordResetTokenExpire=undefined
   user.passwordChangeAt=Date.now()

   await user.save()//save to database


    createSendResponse(user,200,'User login successfully',res)
    
})





