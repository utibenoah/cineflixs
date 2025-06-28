const MovieModel=require('../Models/moviesModels')

const ApiFeatures=require('../Utils/Apifeatures')

const AppError=require('../Utils/errorHandler')

const asyncErrorHandler=require('../Utils/asyncErrorHandler')



// ROUTE HANDLER FUNCTION

exports.getHighestRatedMovies = asyncErrorHandler(async (req, res) => {

    const movies = await MovieModel.find().sort("-ratings").limit(5);

    res.status(200).json({
      status: "success",
      quantity: movies.length,
      data: { movies },
    });
  })




exports.getAllMovies=asyncErrorHandler(async (req,res)=>{

let features=new ApiFeatures(MovieModel.find(),req.parsedQuery).filter().sort().limitFields().paginate()
let movies=await features.query

    // return all movies
    res.status(200).json({
        status:'success',
        count:movies.length,
        data:{
            movies
        }
    })

    
})

exports.getMovie=asyncErrorHandler(async(req,res,next)=>{
        const movie= await MovieModel.find({_id:req.params.id})
        //check for no movies with the name
        if (!movie.length>0) {
           let error=new AppError(`movie with id ${req.params.id} not found`,'Bad Request',400,req.originalUrl,req.body,req.method)
           
           return next(error)
        }
        
        // return movie with name
        res.status(200).json({
            status:'success',
            data:{
                movie:movie
            }
        })

})



exports.addMovie=asyncErrorHandler(async(req,res,next)=>{
    
        const movie= await MovieModel.create(req.body)

        

        res.status(201).json({
            status:'success',
            data:{
                movie:movie
            }
        })
    
})

exports.updateMovieKey=asyncErrorHandler(async(req,res)=>{
    
       const updateMovieKey =await MovieModel.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})

       if (!updateMovieKey.length>0) {
           let error=new AppError(`movie with id ${req.params.id} not found`,'Bad Request',400,req.originalUrl,req.body,req.method)
           
           return next(error)
        }

       res.status(200).json({
            status:'sucess',
            data:{
                movie:updateMovieKey
            }
       })
   
})

exports.updateMoviesKeys=asyncErrorHandler((req,res)=>{
   
})

exports.deletMovie=asyncErrorHandler(async(req, res) => {
       await MovieModel.findByIdAndDelete(req.params.id)
       res.status(204).json({
            status:'sucess',
            message:'movie successful deleted'
       })
    
})

//get movies statistics
exports.getMoviesStats=asyncErrorHandler(async(req,res)=>{
        const stats=await MovieModel.aggregate([
            {$match:{ratings:{$gte:4.5}}},
            {$group:{
                _id:'$releaseYear',
                avgRating:{$avg:'$ratings'},
                avgPrice:{$avg:'$price'},
                avgMin:{$min:'$price'},
                avgMax:{$max:'$price'},
                priceTotal:{$sum:'$price'},
                movieCount:{$sum:1}

                }
                
            }
        ])

        res.status(200).json({
            status:'sucess',
            counts:stats.length,
            data:{
                stats
            }
       })
        
}

)