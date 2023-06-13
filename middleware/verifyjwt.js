


const jwt=require('jsonwebtoken');
const {User}=require('./../model/db')
module.exports.verifyJWT=(req,res,next)=>{
     const auth=req.headers['authorization'];
     if(auth){

        const token=auth.split(' ')[1];
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
            if(err){return res.status(401).json({msg:"invalid or expired token"})}
            req.user=decoded.email;
            
            next();
        })


     }else{
        res.status(403).json({msg:"token was not provided"})
     }
  
     
}
