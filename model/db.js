



const mongoose=require('mongoose');
const {Schema,model}=mongoose;
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log('database connected successfully')
})
.catch(e=>{
    console.error(`error in connecting..err:${e}`)
})

let userSchema=new Schema({
        email:{
            type:String,
            unique:true
        },
        password:{
            type:String,
            unique:true
        },
        refreshToken:{
            type:String
        },
        role:{
            type:String,
            default:'user'
        }

})
let User=model('User',userSchema);
module.exports={
    User
}