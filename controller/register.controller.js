


const {User}=require('./../model/db');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
module.exports.register=async (req,res,next)=>{
    const {email,password,password2,role}=req.body;
   
    let userAlreadyExists=await User.findOne({email}).then(e=>{
        return e;
    })

    if(!email||!password||!password2){
        res.status(401).json({msg:"please fill in all fields"})

    }else{
        
        if(userAlreadyExists){
            console.log(userAlreadyExists)
            res.status(401).json({msg:"user already exists"});
        }else if(password!==password2){
            res.status(401).json({msg:"passwords do not match"})
        }else{
            let hash=await bcrypt.hash(password,10)
            new User({
                email,
                password:hash,
                role
            }).save().then(async e=>{
                let accessToken=jwt.sign({email:e.email},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'5s'})
                let refreshToken=jwt.sign({email:e.email},process.env.REFRESH_TOKEN_SECRET,{expiresIn:'2d'})
                e.refreshToken=refreshToken;
                await e.save()
                res.status(201).json({accessToken,refreshToken});
            }).catch(err=>{
                res.status(400).json({msg:"err in registering"})
            })
           
        }

    }
  
}