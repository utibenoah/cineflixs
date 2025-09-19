let express=require('express')
let router=express.Router()
const userController=require('../Controllers/userController')
const authController=require('../Controllers/authController')


router.route('/getusers')
            .get(authController.protected,userController.getUsers)

router.route('/updatepassword')
            .patch(authController.protected,userController.updatePassword)

            
router.route('/update-me')
            .patch(authController.protected,userController.updateMe)


router.route('/delete-me')
            .delete(authController.protected,userController.deleteMe)
            

module.exports=router