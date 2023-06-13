

const bcrypt=require('bcrypt')
const {User}=require('./../model/db');
const jwt=require('jsonwebtoken')
module.exports.login=async(req,res,next)=>{
           const {email,password}=req.body;
           User.findOne({email}).then(async user=>{
                if(user){
    let passwordsMatch= await bcrypt.compare(password,user.password);
                        if(passwordsMatch){
             const accessToken=jwt.sign({"email":user.email},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'5s'});
             const refreshToken=jwt.sign({"email":user.email},process.env.REFRESH_TOKEN_SECRET,{expiresIn:'2d'});  
             user.refreshToken=refreshToken;
             user.save()
            res.status(200).json({accessToken,refreshToken,user:req.user});

                        }else{
                            res.status(401).json({msg:"invalid login credentials"})
                        }


                }else{
                    res.status(401).json({msg:"invalid login credentials"})
                }
           })
           
}