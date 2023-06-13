require('dotenv').config()
const express=require('express');
const app=express();
const cors=require('cors')
const cookieParser=require('cookie-parser');
const jwt=require('jsonwebtoken')
const port=process.env.PORT||5678;
const {verifyJWT}=require('./middleware/verifyjwt')
const registerRoute=require('./route/register.route')
const loginRoute=require('./route/login.route')
const refreshRoute=require('./route/refreshToken.route');
const logoutRoute=require('./route/logout.route');
const {User}=require('./model/db')
const path=require('path')
const session=require('express-session');


//session
app.use(session({
    resave:false,
    saveUninitialized:false,
    secret:'cookie_session_secret',
    cookie:{
      
        secure:false,
        sameSite:"lax",
        maxAge:1000*60*60*24*2
    }
}))

//CORS
let corsOptions={
    origin:"*",
    preFlightContinue:"true",
    credentials:true
}
app.use(cors(corsOptions))
//using cookie parser 
app.use(cookieParser());
//built in function to handle urlencoding
app.use(express.urlencoded({extended:false}));
app.use(express.json());
//routes start here
app.use('/register',registerRoute)
app.use('/login',loginRoute)
app.use('/refresh',refreshRoute)
app.use('/logout',logoutRoute)
app.get('/',verifyJWT,(req,res)=>{res.json({user:req.user,hi:'hello'})})
//listener function
app.listen(port,(err)=>{
    if(err)throw err;
    console.log(`listening on port ${port}`)
})

 