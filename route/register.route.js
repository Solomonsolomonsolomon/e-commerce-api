

const router=require('express').Router();
const {register}=require('./../controller/register.controller');



router.post('/',register)

module.exports=router
