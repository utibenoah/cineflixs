const UsersModel=require('../Models/usersModels')

const asyncErrorHandler=require('../Utils/asyncErrorHandler')

const jwt=require('jsonwebtoken')
const utils=require('util')
const AppError=require('../Utils/errorHandler')




let signInToken=(email)=>{
    return jwt.sign({email:email},process.env.SECRET_STR,{expiresIn:process.env.LOGIN_EXPIRES})

}


//SIGNUP ROUTE HANDLER
exports.signUp=asyncErrorHandler(async (req,res,next)=>{
    let newUser= await UsersModel.create(req.body)

    let token=signInToken(newUser.email)

    res.status(201).json({
        status:"sucesss",
        message:"user created",
        token
        
    })

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



let token=signInToken(user.email)


    res.status(200).json({
        status:'success',
        message:'User login successfully',
        token
    })
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
       message='You are not logged in'
        error=new AppError(message,'Unauthorized',401,req.originalUrl,req.body,req.method)
        return next(error) 
    }
    // validate token
    let decodeToken=await utils.promisify(jwt.verify)(token,process.env.SECRET_STR)

    

    //check if user exit
    let user=await UsersModel.findOne({email:decodeToken.email})
     if(!user){
        message='User does not exit'
        error=new AppError(message,'Unauthorized',401,req.originalUrl,req.body,req.method)
        return next(error)
     }

     // check if the user check password
     
     let isPasswordChange= user.isPasswordChange(decodeToken.iat)
    
     if(isPasswordChange){
        message='Password was change. Login again'
        error=new AppError(message,'Unauthorized',401,req.originalUrl,req.body,req.method)
        return next(error)
     }

     //allow user to access
     req.user=user

    next()

})