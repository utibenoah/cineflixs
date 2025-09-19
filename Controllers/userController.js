const UsersModel=require('../Models/usersModels')

const asyncErrorHandler=require('../Utils/asyncErrorHandler')
const jwt=require('jsonwebtoken')

const AppError=require('../Utils/errorHandler')


let signInToken=(email)=>{
    return jwt.sign({email:email},process.env.SECRET_STR,{expiresIn:process.env.LOGIN_EXPIRES})

}

exports.getUsers=asyncErrorHandler(async(req,res,next)=>{
    let user= await UsersModel.find()

    //error: no user
    if(!user){
        let message='Users not found'
        let error=new AppError(message,'Unauthorized',404,req.originalUrl,req.body,req.method)
        return next(error)
    }

    res.status(200).json({
        length:user.length,
        data:{
            user
        }
    })
})

exports.updatePassword=asyncErrorHandler(async (req,res,next)=>{
    
    // get the current user data from database
    
    let userEmail=req.user.email
    let user=await UsersModel.findOne({email:userEmail}).select('+password')


    //check the user current  password  provide is correct
    let userCurrentPassword=req.body.currentpassword
    let userPasswordFromDd=user.password
    let checkPassword=await user.comparePassword(userCurrentPassword,userPasswordFromDd)

    
    if(!checkPassword){
        let message='The current password you provided is wrong'
        let error=new AppError(message,'Unauthorized',401,req.originalUrl,req.body,req.method)
        return next(error)
    }

    // // if the user current password is correct, update the user password
    user.password=req.body.password
    user.confirm_password=req.body.confirm_password
    await user.save({validateBeforeSave:true})// save to db

    // login and check jwt token
     let loginToken=signInToken(user.email)

     res.status(200).json({
        status:"sucesss",
        message:"Login sucessfully",
        token:loginToken,
        
    })
    
})


exports.updateMe=asyncErrorHandler(async(req,res,next)=>{
    if(req.body.password || req.body.confirm_password){
        let message='You can not update your password using this endpoint'
        let error=new AppError(message,'Unauthorized',400,req.originalUrl,req.body,req.method)
        return next(error)
    }

    //filter body request keys
    const allowFields = ['name','email'];
    let newObj={}
    Object.keys(req.body).forEach((el) =>{
            
            if(allowFields.includes(el)){
                newObj[el]=req.body[el]
            }
        });
    
        let currentUserEmail=req.user.email
        const updatedUser = await UsersModel.findOneAndUpdate({email:currentUserEmail},newObj,{new: true, runValidators: true})
    
    res.status(200).json({
        message:"user's details updated successfully",
        updatedUser
    })
})

exports.deleteMe=asyncErrorHandler(async(req,res)=>{
    let currentUserEmail=req.user.email;
     await UsersModel.findOneAndUpdate({email:currentUserEmail},{active:false})

     res.status(204).json({
        message: `User is deleted successfully`,
        data:null
     })

})