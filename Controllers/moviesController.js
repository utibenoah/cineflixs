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

let features=new ApiFeatures(MovieModel.find(),req.query).filter()

let movies=await features.query
//SORTING
// if (req.query.sort) {
//     const sortBy=req.query.sort.split(',').join(' ')
//     console.log(sortBy)
//     query=MovieModel.find().sort(sortBy)
   
// }else{
//     query=MovieModel.find().sort('-__v')
// }


// //LIMITING FIELDS
// if (req.query.fields) {
//     const fields=req.query.fields.split(',').join(' ')
//     query=MovieModel.find().select(fields)
   
// }else{
//     query=MovieModel.find().select('-__v')
// }



// //PAGINATION

// const page=req.query.page*1 || 1
//     const limit=req.query.limit*1 || 10
//     //PAGE 1:1-10, PAGE 2:11-20, PAGE:3 21-30 ....
//     let skip=(page-1)*limit
//     query=query.skip(skip).limit(limit)

// if(req.query.page){
//     const countDoc= await MovieModel.countDocuments()
//     if(skip >=countDoc){
//         throw Error('No more movies')
//     }
// }




// const movies= await query//querying database
    

    //check for no movies
    if (!movies.length>0) {
        return res.status(404).json({
            status:'fail',
            message:'No movies found'
        })
    }

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


