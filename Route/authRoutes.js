let express=require('express')
let router=express.Router()


let authController=require('../Controllers/authController')




// @desc    Get all users
// @route   GET /api/users
// @access  Public (can protect later)
router.route('/')
            .get(authController.getUser)



// @desc    Register new user
// @route   POST /api/users/register
// @access  Public

router.route('/signup')
            .post(authController.signUp)
        



// @desc    Login  user
// @route   POST /api/users/login
// @access  Public

router.route('/login')
            .post(authController.login)
        





module.exports=router