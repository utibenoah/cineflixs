let express=require('express')
let router=express.Router()




let moviesController= require('../Controllers/moviesController')
let queryUrlParams=require('../Middlewares/queryUrlParams')




// ROUTE=HTTP METHOD+URL

router.route("/movie-stats")
            .get(moviesController.getMoviesStats)

            
router.route('/highest-rated-movies')
            .get(moviesController.getHighestRatedMovies)

router.route('/')
            .get(queryUrlParams,moviesController.getAllMovies)
            .post(moviesController.addMovie)


router.route('/:id')
            .get(moviesController.getMovie)
            .patch(moviesController.updateMovieKey)
            .put(moviesController.updateMoviesKeys)
            .delete(moviesController.deletMovie)


module.exports=router