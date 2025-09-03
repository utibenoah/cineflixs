const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const crypto=require('crypto')

//SCHEMA
let usersSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please enter your name']
    },

    email:{
        type:String,
        required:[true,'Please enter your name'],
        unique:true,
        lowercase:true,
        validator:[validator.isEmail, 'Please enter a valid email']
    },

    photo: String,
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    password:{
        type:String,
        required:[true,'Please enter a password'],
        minlength:8,
        select:false
    },
    
    confirm_password:{
        type:String,
        required:[true,'Please enter confirm password'],

        validator:{
            validator:function(val){ return val === this.password},

            message:'Password and confirm password does not matched'
        }
    },

    passwordChangeAt:Date,
    passwordResetToken:String,
    passwordResetTokenExpire:Date

})


usersSchema.pre('save', async function(next){
    if(!this.isModified('password')) {return next()}

    //encrypt password before saving

    this.password= await bcrypt.hash(this.password,12)
    this.confirm_password=undefined;
    next()
})

            //METHODS

//compare password
usersSchema.methods.comparePassword=async (inputPassword,userPasswordInDB)=>{
   return await bcrypt.compare(inputPassword,userPasswordInDB)
}

//check for password change
usersSchema.methods.isPasswordChange=function(jwtTimeStamp){
    if(this.passwordChangeAt){
        let passwordChangeTimeStamp=parseInt(this.passwordChangeAt.getTime()/1000,10)
        return jwtTimeStamp<passwordChangeTimeStamp
    }

    return false
}

usersSchema.methods.createPasswordResetToken=function(){
    const resetToken=crypto.randomBytes(32).toString('hex')//generate token
    this.passwordResetToken=crypto.createHash('sha256').update(resetToken).digest('hex')//send to db

    this.passwordResetTokenExpire=Date.now() + 10*60*1000


    return resetToken

}

            // MODEL
let usersModel=mongoose.model('users',usersSchema)

module.exports=usersModel
