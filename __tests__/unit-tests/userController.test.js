
const Controllers=require('../../Controllers/userController')
const UsersModel=require('../../Models/usersModels')
const jwt=require('jsonwebtoken')

jest.mock('../../Utils/asyncErrorHandler', () => {
  return fn => fn;  
})


describe('Get all user',()=>{
    
    let req={}
    let res={
        status:jest.fn(function(){return this}),
        json:jest.fn()

    }
    let next=jest.fn()

    it('Should return 404: with users not found',async()=>{
        UsersModel.find=jest.fn(()=>{
            return Promise.resolve([])
        })

        await Controllers.getUsers(req,res,next)

        expect(next).toHaveBeenCalled()
        expect(res.status).not.toHaveBeenCalled()
        const error = next.mock.calls[0][0];
        
        expect(error).toBeDefined();
        expect(error.statusCode).toBe(404);
    })

    it('Should return 200: with users found',async()=>{
        UsersModel.find=jest.fn(()=>{
            return Promise.resolve([{name:'tester'}])
        })
        await Controllers.getUsers(req,res,next)

        expect(next).not.toHaveBeenCalled()
        expect(res.status).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
    })

})

describe.only('Update Password',()=>{
     let req,res,next,user

    beforeEach(()=>{
        req={body:{currentpassword:'2345'},
        user:{email:'testing@test.com'}}

        res={
        status:jest.fn(function(){return this}),
        json:jest.fn()

    }
        next=jest.fn()

        user={name:'tester',
            email:'test@gmail.com',
            password:'12345',
        }
    })


    it('Should return 401: current password you provided is wrong', async()=>{

        UsersModel.findOne=jest.fn(()=>{
            return {select:jest.fn(()=>{return Promise.resolve(user)})}
        })
        user.comparePassword=jest.fn(()=>Promise.resolve(false))
      
        await Controllers.updatePassword(req,res,next)

        expect(next).toHaveBeenCalledTimes(1)
        const error = next.mock.calls[0][0];
        
        expect(error).toBeDefined();
        expect(error.statusCode).toBe(401);
    })

    it('Should return 200:login sucessfully',async()=>{
        req.body.password='2345',
        req.body.confirm_password='2345'
        user.comparePassword=jest.fn(()=>Promise.resolve(true))
        user.save=jest.fn()
        jwt.sign=jest.fn(()=>'tikddduffgyfhfffhdhffhffhfh')

        await Controllers.updatePassword(req,res,next)

        expect(next).not.toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledTimes(1)
        const response = res.json.mock.calls[0][0];
        expect(response.message).toBe('Login sucessfully');
    })
})

describe('UpdateMe',()=>{
    let req,res,next

    beforeEach(()=>{
        req={body:{},
        user:'testing@test.com'}

        res={
        status:jest.fn(function(){return this}),
        json:jest.fn()

    }
        next=jest.fn()
    })

    it('Should return 400:You can not update your password using this endpoint',async()=>{
        req.body.password='1234'

        await Controllers.updateMe(req,res,next)


        expect(next).toHaveBeenCalled()
        expect(next).toHaveBeenCalledTimes(1);
        const err = next.mock.calls[0][0];
        expect(err.message).toBe('You can not update your password using this endpoint');
        const error = next.mock.calls[0][0];
        
        expect(error).toBeDefined();
        expect(error.statusCode).toBe(400);
        

    })

    it('users details updated successfully',async()=>{
        UsersModel.findOneAndUpdate=jest.fn(()=>{
            return Promise.resolve([{name:'tester1',
                password:'23456'
            }])
        })



        await Controllers.updateMe(req,res,next)


        expect(next).not.toHaveBeenCalled()
        expect(res.status).toHaveBeenCalled()
    })
})


