let mongoose=require('mongoose')
let dotenv=require('dotenv')



dotenv.config({path:'./config.env'})

process.on("uncaughtException", (error)=>{
    console.log(error.name,error.message)
    console.log("uncaught Exception shuting down")
    
    process.exit(1)

})
// IMPORT APP
let app =require('./app')


// CONNECT DB
mongoose.connect(process.env.MONGODB_CONN_STR)
    .then(()=>console.log('Database connected successfully'))

    .catch(err=>console.log('Error occure while connecting to database '+err))


// CREATE A SERVER
const port =process.env.PORT || 3000 
let server=app.listen(port,()=>{
    console.log('server is running')
})


process.on("unhandledRejection", (error)=>{
    console.log(error.name,error.message)
    console.log("unhandlered rejection shuting down")
    server.close(()=>{
        process.exit(1)
    })
    
})



