const mongoose=require('mongoose')

//SCHEMA
let movieSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is a required field'],
        unique:true,
        maxlength:[100,"movie name must not have more than 100 characters"],
        minlength:[4,"movie name must have aleast 4 characters"],
        trim:true
    },
    description:{
        type:Array,
        required:[true, 'Description is a required field'],
        trim:true
    },
    duration:{
        type:Number,
        required:[true, 'Duration is required field']
    },
    ratings:{
        type:Number,
        validate:{
            validator:(value)=>{
            return value >=1 && value <= 10
        },
        message:"rating ({VALUE}) should be above and below 10"
        }
    },

    totalRating:{
        type:Number
    },

    releaseYear:{
        type:Number,
        require:[true, 'Release year is required field']
    },

    releaseDate:{
        type:Date
    },

    createdAt:{
        type:Date,
        default:Date.now(),
        select:false
    },

    genres:{
        type:[String],
        required:[true, 'Genres is a required field']
    },
    directors:{
        type:[String],
        required:[true, 'Directors is a required field']
    },

    coverImage:{
        type:String,
        required:[true, 'Cover image is a required field']
    },
    actors:{
        type:[String],
        required:[true, 'Actors is a required field']
    },

    price:{
        type:Number,
        required:[true, 'Price is a required field']
    }
    
})
// MODEL
let MovieModel=mongoose.model('movies',movieSchema)

module.exports=MovieModel
