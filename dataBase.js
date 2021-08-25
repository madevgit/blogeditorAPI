const mongoose= require('mongoose')
const URI= process.env.LOCAL_URI
module.exports= async(callback)=>{
    try{
        await mongoose.connect(URI,{useNewUrlParser:true,useUnifiedTopology:true})
        console.log('db connnection valide')
        await callback()
    }catch(e){
        console.log(e)
        throw e
    }
}