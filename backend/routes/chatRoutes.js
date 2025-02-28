const express=require("express");
const { protect } = require('../authmiddleware');

const { accesschat, fetchChats, createGroupChat, renameGroup, removeFromGroup,addToGroup } = require("../controllers/chatController");
const router=express.Router();

router.route('/').post(protect,accesschat);
router.route("/").get(protect,fetchChats);
router.route("/group").post(protect,createGroupChat)
router.route("/rename").put(protect,renameGroup);
router.route("/groupremove").put(protect,removeFromGroup);
router.route("/groupadd").put(protect,addToGroup);


module.exports=router
