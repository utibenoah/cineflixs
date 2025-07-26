let express=require('express')
let router=express.Router()




let moviesController= require('../Controllers/moviesController')
let authController= require('../Controllers/authController')
let queryUrlParams=require('../Middlewares/queryUrlParamsMiddleware')




// ROUTE=HTTP METHOD+URL

router.route("/movie-stats")
            .get( moviesController.getMoviesStats)

            
router.route('/highest-rated-movies')
            .get(moviesController.getHighestRatedMovies)

router.route('/')
            .get(authController.protected,queryUrlParams,moviesController.getAllMovies)
            .post(moviesController.addMovie)


router.route('/:id')
            .get(moviesController.getMovie)
            .patch(moviesController.updateMovieKey)
            .put(moviesController.updateMoviesKeys)
            .delete(authController.protected,moviesController.deletMovie)


module.exports=router