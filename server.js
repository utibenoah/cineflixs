let mongoose=require('mongoose')
let dotenv=require('dotenv')



dotenv.config({path:'./config.env'})
// IMPORT APP
let app =require('./app')

// CONNECT DB
mongoose.connect(process.env.MONGODB_CONN_STR)
    .then(()=>console.log('Database connected successfully'))
    .catch(err=>console.log('Error occure while connecting to database '+err))


// CREATE A SERVER
const port =process.env.PORT || 3000 
app.listen(port,()=>{
    console.log('server is running')
})