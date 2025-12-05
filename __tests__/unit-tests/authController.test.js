const Controllers=require('../../Controllers/authController')
const UsersModel=require('../../Models/usersModels')
const jwt=require('jsonwebtoken')
const utils=require('util')
let emailSendingHandler=require('../../Utils/emailSendingHandler')

const crypto=require('crypto')


jest.mock('../../Utils/asyncErrorHandler', () => {
  return fn => fn;  
})

jest.mock('../../Utils/emailSendingHandler', () => jest.fn());

jest.mock('../../Models/usersModels')



describe('SignUp',()=>{
    let req,res,next
    beforeEach(()=>{
        req={body:{
            name:'tester',
            email:'tester@testing.com',
            password:'2345',
            confirm_password:'2345'
        }}
        res={
            status:jest.fn(function(){
                return this
            }),
            json:jest.fn()
        },

        next=jest.fn()
    })

    it('Should return 201:user created',async()=>{
        //arrange
        UsersModel.create=jest.fn(()=>{
            return Promise.resolve([{
            name:'tester',
            email:'tester@testing.com'
        }])
        })

        jwt.sign=jest.fn(()=>'tikddduffgyfhfffhdhffhffhfh')
        res.cookie=jest.fn()

        //act
        await Controllers.signUp(req,res,next)

        //assert
        expect(next).not.toHaveBeenCalledTimes(1)
        expect(res.status).toHaveBeenCalledWith(201)


    })
})

describe('Login',()=>{
    let req,res,next,user
    beforeEach(()=>{
        req={body:{
            email:'',
            password:''
        }}
        res={
            status:jest.fn(function(){
                return this
            }),
            json:jest.fn()
        },

        next=jest.fn()

        user={}
    })

    it('Should return 400(Bad Request):email and password is empty',async()=>{
        //arrange
        
        //act
        await Controllers.login(req,res,next)

        //assert
        expect(next).toHaveBeenCalledTimes(1)
        const error = next.mock.calls[0][0];
        
        expect(error).toBeDefined();
        expect(error.statusCode).toBe(400);
       
    })


     it('Should return 400(Bad Request):email is empty',async()=>{
        //arrange
        req.body.email=''
        req.body.password='2345'
        //act
        await Controllers.login(req,res,next)

        //assert
        expect(next).toHaveBeenCalledTimes(1)
        const error = next.mock.calls[0][0];
        
        expect(error).toBeDefined();
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe('email is empty');
       
    })

    it('Should return 400(Bad Request):password is empty',async()=>{
        //arrange
        req.body.email='test@testing.com'
        req.body.password=''
        //act
        await Controllers.login(req,res,next)

        //assert
        expect(next).toHaveBeenCalledTimes(1)
        const error = next.mock.calls[0][0];
        
        expect(error).toBeDefined();
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe('password is empty');
       
    })


    it('Should return 401:Invalid user credentials,user does not exit',async()=>{
        //arrange
        req.body.email='test@testing.com'
        req.body.password='2345'
        UsersModel.findOne=jest.fn(()=>{
            return {select:jest.fn(()=>{
                return Promise.resolve(user)
            })}
        })
        user.comparePassword=jest.fn(()=>{
            return Promise.resolve(false)})

        //act
        await Controllers.login(req,res,next)

        //assert
        expect(next).toHaveBeenCalledTimes(1)
        const error = next.mock.calls[0][0];
        
        expect(error).toBeDefined();
        expect(error.statusCode).toBe(401);
        expect(error.message).toBe('Invalid user credentials');
       
    })

    it('Should return 401:Invalid user credentials,user exist but password is incorrect',async()=>{
        //arrange
        req.body.email='test@testing.com'
        req.body.password='2345'

        user.name='tester'
        user.email='test@gm.com'
        user.password='2345'
        
        UsersModel.findOne=jest.fn(()=>{
            return {select:jest.fn(()=>{
                return Promise.resolve(user)
            })}
        })
        user.comparePassword=jest.fn(()=>{
            return Promise.resolve(false)})

        //act
        await Controllers.login(req,res,next)

        //assert
        expect(next).toHaveBeenCalledTimes(1)
        const error = next.mock.calls[0][0];
        
        expect(error).toBeDefined();
        expect(error.statusCode).toBe(401);
        expect(error.message).toBe('Invalid user credentials');
       
    })

    it('Should return 200:User login successfully',async()=>{
        //arrange
        req.body.email='test@testing.com'
        req.body.password='2345'

        user.name='tester'
        user.email='test@gm.com'
        user.password='2345'
        
        UsersModel.findOne=jest.fn(()=>{
            return {select:jest.fn(()=>{
                return Promise.resolve(user)
            })}
        })
        user.comparePassword=jest.fn(()=>{
            return Promise.resolve(true)})

             res.cookie=jest.fn()
        //act
        await Controllers.login(req,res,next)

        //assert
        expect(next).not.toHaveBeenCalledTimes(1)
        const responseJson =res.json.mock.calls[0][0];
        expect(responseJson.message).toBe('User login successfully')
       
    })
})

describe('Protected Route',()=>{
    let req,res,next,user
    beforeEach(()=>{
        req={headers:{authorization:'',
        }}

        res={
            status:jest.fn(function(){
                return this
            }),
            json:jest.fn()
        },
         Original_evn = process.env.NODE_ENV;
        next=jest.fn()

        user={
            name:'test',
            email:'test@test.com'
        }
    })

    it('Should return 401: You are not login',async()=>{
        //arrange
        

        //act
        await Controllers.protected(req,res,next)

        //assert
        expect(next).toHaveBeenCalledTimes(1)
        const error = next.mock.calls[0][0];
        
        expect(error).toBeDefined();
        expect(error.statusCode).toBe(401);


    })


    it('Should return 401: User does not exit',async()=>{
        //arrange
        req.headers.authorization='Bearer ffhfhfhfjddkdkdkdk'
        utils.promisify = jest.fn(() => {
            return jest.fn(() => Promise.resolve('hekeedjfjdjjfjd'));
            })

        UsersModel.findOne=jest.fn(()=>{
            return Promise.resolve(null)
        })

        //act
        await Controllers.protected(req,res,next)

        //assert
        expect(next).toHaveBeenCalledTimes(1)
        const error = next.mock.calls[0][0];
        
        expect(error).toBeDefined();
        expect(error.statusCode).toBe(401);


    })


    it('Should return 401: Password was change. Login again',async()=>{
        //arrange
        req.headers.authorization='Bearer ffhfhfhfjddkdkdkdk'
        utils.promisify = jest.fn(() => {
            return jest.fn(() => Promise.resolve('hekeedjfjdjjfjd'));
            })

        UsersModel.findOne=jest.fn(()=>{
            return Promise.resolve(user)
        })

        user.isPasswordChange=jest.fn(()=>{return true})
        
        //act
        await Controllers.protected(req,res,next)

        //assert
        expect(next).toHaveBeenCalledTimes(1)
        const error = next.mock.calls[0][0];
        expect(error).toBeDefined();
        expect(error.statusCode).toBe(401);


    })
})

describe('Restrict user',()=>{
    let req,res,next

    beforeEach(()=>{
        req={user:{role:''}}
        res={
            status:jest.fn(function(){
                return toHaveBeenCalledTimes
            }),
            json:jest.fn()
        }
        next=jest.fn()
    })
    it('Sholud return 403:with you do not have permission to perform this operation',()=>{

         Controllers.restricted('user')

        expect(next).not.toHaveBeenCalled()
    })
})


describe('Forgot password',()=>{
    let req,res,next,user
    beforeEach(()=>{
        req={body:{email:'test@test.com'}}
        res={
            status:jest.fn(function(){
                return this
            }),
            json:jest.fn()
        }
        next=jest.fn()


        user={name:'tester',email:'test@t.com'}
    })

    it('Should return 404 with: Email does not exit',async()=>{
        //arrange
        UsersModel.findOne=jest.fn(()=>{
            return Promise.resolve(null)
        })

        //act
        await Controllers.forgotPassword(req,res,next)

        //assert
        expect(next).toHaveBeenCalled()
        const error = next.mock.calls[0][0];
        
        expect(error).toBeDefined();
        expect(error.statusCode).toBe(404);

    })

    it('Should return 200 with: reset token send successfully. Kindly check your mail',async()=>{
        //arrange
        UsersModel.findOne=jest.fn(()=>{
            return Promise.resolve(user)
        })

        user.createPasswordResetToken=jest.fn(()=>{
            return Promise.resolve('hbcababchchBS')
        })
        user.save=jest.fn()

        
        req.get=jest.fn(()=>{return 'www.jest.com'})

        //act
        await Controllers.forgotPassword(req,res,next)

        //assert
        expect(next).not.toHaveBeenCalled()
        expect(res.status).toHaveBeenCalled()
        let response=res.json.mock.calls[0][0]

        expect(res.status).toHaveBeenCalledWith(200)
        expect(response.message).toBe('Reset token send successfully. Kindly check your mail')
        

    })



    it('Should return 500 with: an error occurred while sending password reset token, please try again later',async()=>{
        //arrange
        UsersModel.findOne=jest.fn(()=>{
            return Promise.resolve(user)
        })

        user.createPasswordResetToken=jest.fn(()=>{
            return Promise.resolve('hbcababchchBS')
        })
        user.save=jest.fn()

        
        req.get=jest.fn(()=>{return 'www.jest.com'})

        emailSendingHandler.mockImplementation(
                jest.fn(() => Promise.reject(new Error('An error occurred while sending password reset token, please try again later')))
                );

        //act
        await Controllers.forgotPassword(req,res,next)

        //assert
        expect(next).toHaveBeenCalled()
        const error = next.mock.calls[0][0];
        
        expect(error).toBeDefined();
        expect(error.statusCode).toBe(500);
        

    })


})


describe('Reset password',()=>{
    let req,res,next
    beforeEach(()=>{
        req={params:{token:'hbhbkkn34bhhfjfj'}}
        res={
            status:jest.fn(function(){return this}),
            json:jest.fn()
        }

        next=jest.fn()
    })

    afterEach(() => {
  jest.clearAllMocks();
});



    it('Should return 400 with: Invalid password reset token',async()=>{

        //arrange

        crypto.createHash=jest.fn(()=> {
            return {update:jest.fn(function(){return this}),
                   digest:jest.fn(()=>{return 'hdjd3445jjsksk'}) 
                }
        })
        UsersModel.findOne=jest.fn(()=>{
            return Promise.resolve(null)
        })

        //act
        await Controllers.resetPassword(req,res,next)
        

        //assert
        expect(res.status).not.toHaveBeenCalled()
        expect(next).not.toHaveBeenCalled()
    })



})