// IMPORT PACKAGE
let express=require('express')
let morgan=require('morgan')


let globalErrorHandler=require('./Middlewares/errorMiddleware')

let AppError=require('./Utils/errorHandler')
let rateLimit=require('express-rate-limit')
let helmet=require('helmet')
let sanitize=require('express-mongo-sanitize')
let xss=require('xss-clean')
let hpp=require('hpp')
let moviesRouter= require('./Route/moviesRoutes')
let authRouter=require('./Route/authRoutes')
let userRouter=require('./Route/userRoutes')


let app = express()

 


// MIDDLEWARE
app.use(helmet())

//Rate limit
let limiter=rateLimit({
    max:1000,
    windowMs:60*60*1000,
    message:'We have received too many request from this IP. Please try again after one hour'
})

app.use('/api',limiter)
app.use(express.json({limit:'10kb'}))
app.use(sanitize())
app.use(xss())
app.use(hpp({whitelist:['duration',
    'rating',
    'releaseDate',
    'genres',
    'price',
    'actors'
        ]}))

if (process.env.NODE_ENV==='development') {
    app.use(morgan('dev'))
}

app.use((req,res,next)=>{
    req.requestedAt= new Date().toISOString()
    next()
})



//Route
app.use('/api/v1/movies',moviesRouter),
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/user',userRouter)
app.all('*catchall',(req,res,next)=>{
    
    let error=new AppError('url not found','Not found',404,req.originalUrl,req.body,req.method)
    
    
    next(error)
    
})

app.use(globalErrorHandler)

module.exports=app
