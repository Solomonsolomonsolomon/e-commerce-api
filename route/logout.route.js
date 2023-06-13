




const {Router}=require('express');
const router=Router();
const {logoutHandler}=require('./../controller/logout.controller')
console.log(logoutHandler)
router.get('/',logoutHandler)

module.exports=router;