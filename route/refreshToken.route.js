



const {Router}=require('express');
let router=Router()
let {refreshToken}=require('./../controller/refreshToken.controller');

router.post('/',refreshToken)
module.exports=router;
