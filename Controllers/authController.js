const UsersModel=require('../Models/usersModels')

const asyncErrorHandler=require('../Utils/asyncErrorHandler')


exports.signUp=asyncErrorHandler(async (req,res,next)=>{
    let newUser= await UsersModel.create(req.body)

    res.status(201).json({
        status:"sucesss",
        message:"new user created",
        data:newUser
    })

})


exports.getUser=(req,res)=>{

}


exports.login=(req,res)=>{

}