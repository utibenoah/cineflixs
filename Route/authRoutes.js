let express=require('express')
let router=express.Router()


let authController=require('../Controllers/authController')







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
 
            
// @desc    Forget password
// @route   POST /api/users/forgetpassword
// @access  Public

router.route('/forgot-password')
            .post(authController.forgotPassword)



// @desc    Rest password
// @route   POST /api/users/reset-password
// @access  Public

router.route('/resetpassword/:token')
            .patch(authController.resetPassword)





module.exports=router