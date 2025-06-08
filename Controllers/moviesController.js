const MovieModel=require('../Models/moviesModels')

const ApiFeatures=require('../Utils/Apifeatures')




// ROUTE HANDLER FUNCTION

exports.getHighestRatedMovies = async (req, res) => {
  try {
    const movies = await MovieModel.find().sort("-ratings").limit(5);

    res.status(200).json({
      status: "success",
      quantity: movies.length,
      data: { movies },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};








exports.getAllMovies=async (req,res)=>{
   try {

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

   } catch (err) { //error check
    res.status(400).json({
        status:'fail',
        message:err.message
    })

   }
    
}

exports.getMovie=async(req,res)=>{
    try {
        const movie= await MovieModel.find({name:req.params.id})

        //check for no movies with the name
        if (!movie.length>0) {
            return res.status(404).json({
                status:'success',
                message:'Movie not found with the name '+req.params.id 
            })
        }
        
        // return movie with name
        res.status(200).json({
            status:'success',
            data:{
                movie:movie
            }
        })
    } catch (err) {
        
        res.status(400).json({
            status:'fail',
            message:err.message
        })
    }

}

exports.addMovie=async(req,res)=>{
    try {
        const movie= await MovieModel.create(req.body)

        res.status(201).json({
            status:'success',
            data:{
                movie:movie
            }
        })
    } catch (err) {
        res.status(400).json({
            status:'fail',
            message:err.message
        })
    }
}

exports.updateMovieKey=async(req,res)=>{
    try{
       const updateMovieKey =await MovieModel.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})

       res.status(200).json({
            status:'sucess',
            data:{
                movie:updateMovieKey
            }
       })
    }
    catch (err){
        res.status(404).json({
            status:'fail',
            message:err.message
        })
    }
}

exports.updateMoviesKeys=(req,res)=>{
   
}

exports.deletMovie=async(req, res) => {
    try{
        await MovieModel.findByIdAndDelete(req.params.id)
       res.status(204).json({
            status:'sucess',
            message:'movie successful deleted'
       })
    }
    catch (err){
        res.status(404).json({
            status:'fail',
            message:err.message
        })
    }
}


//get movies statistics
exports.getMoviesStats=async(req,res)=>{
    try {
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
        
    } catch (err) {
       res.status(404).json({
            status:'fail',
            message:err.message
        }) 
    }
}

