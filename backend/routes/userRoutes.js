const express=require("express");
const { registerUser, authUser, allUsers } = require("../controllers/userController");
const { protect } = require("../authmiddleware");
const router=express.Router();

router.post('/',registerUser);
router.post('/login',authUser);
router.get('/',protect,allUsers)
module.exports=router 