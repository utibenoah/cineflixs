// IMPORT PACKAGE
let express=require('express')
let morgan=require('morgan')



let moviesRouter= require('./Route/moviesRoutes')
let app = express()


//middleware 


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




app.use('/api/v1/movies',moviesRouter)


module.exports=app