


const {User}=require('./../model/db')

module.exports.logoutHandler=async (req,res,next)=>{
   
    let refreshToken=req.headers['refresh']; 
     User.findOne({refreshToken}).then( async user=>{

            if(!user)return res.status(403).json({msg:'invalid refresh token'});

         
            user.refreshToken='';
            console.log(user)
            await user.save()
               return res.status(204).json({msg:'successful logout'})

        
      
        })
}