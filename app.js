// IMPORT PACKAGE
let express=require('express')
let morgan=require('morgan')


let globalErrorHandler=require('./Middlewares/errorMiddleware')

let AppError=require('./Utils/errorHandler')

let moviesRouter= require('./Route/moviesRoutes')
let authRouter=require('./Route/authRoutes')
let app = express()

 


// MIDDLEWARE
app.use(express.json())




if (process.env.NODE_ENV==='development') {
    app.use(morgan('dev'))
}
app.use(express.static('./Public'))
app.use((req,res,next)=>{
    req.requestedAt= new Date().toISOString()
    next()
})



//Route
app.use('/api/v1/movies',moviesRouter),
app.use('/api/v1/users',authRouter)

app.all('*catchall',(req,res,next)=>{
    //let err= new AppError('url not found','Not found',404,req.originalUrl,req.body)

    let error=new AppError('url not found','Not found',404,req.originalUrl,req.body,req.method)
    
    
    next(error)
    
})

app.use(globalErrorHandler)

module.exports=app
