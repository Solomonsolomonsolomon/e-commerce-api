const {Router}=require('express')
const router=Router();

const {getCartItems,addToCart,emptyCart,removeItemsFromCart}=require('./../controller/cart.controller')

router.get('/cart/:userId',getCartItems);
router.post('/cart/:userId/new/:productId',addToCart);
router.get('/cart/delete/:userId',emptyCart);
router.get('/cart/:userId/remove/:id',removeItemsFromCart);


module.exports=router