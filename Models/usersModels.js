const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')

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
    }
})


usersSchema.pre('save', async function(next){
    if(!this.isModified('password')) {return next()}

    //encrypt password before saving

    this.password= await bcrypt.hash(this.password,12)
    this.confirm_password=undefined;
    next()
})

//METHODS
usersSchema.methods.comparePassword=async (inputPassword,userPasswordInDB)=>{
   return await bcrypt.compare(inputPassword,userPasswordInDB)
}

// MODEL
let usersModel=mongoose.model('users',usersSchema)

module.exports=usersModel
