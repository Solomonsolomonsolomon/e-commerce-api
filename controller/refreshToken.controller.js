


const jwt=require('jsonwebtoken')
const {User}=require('./../model/db')

module.exports.refreshToken=(req,res,next)=>{
    let refresh=req.headers['refresh'];
User.findOne({refreshToken:refresh}).then(user=>{
    if(!user)return res.status(403)

    jwt.verify(refresh,process.env.REFRESH_TOKEN_SECRET,(err,valid)=>{
        if(err)return res.status(403);
        if(valid){
            let accessToken=jwt.sign({email:user.email},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'5s'})
            res.json(accessToken)
        }
       })
})
 
  
   
  }
  