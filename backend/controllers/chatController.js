const asyncHandler=require("express-async-handler")
const Chat=require("../models/chatModel")
const User = require("../models/userModel")
const accesschat=asyncHandler(async(req,res)=>{
const {userId}=req.body
if(!userId){
    console.log("UserId param not sent with request")
    return res.sendStatus(400)
}
console.log(req.user._id,"nij");
var isChat=await Chat.find({
    isGroupChat:false,
    users: {
        $all: [req.user._id, userId]  
    }
}).populate("users","-password").populate("latestMessage")

isChat=await User.populate(isChat,{
    path:"latestMessage.sender",
    select:"name pic email",

});

if(isChat.length>0){
 
    res.send(isChat[0])
    
    }else{
        
       var chatData={
        
        chatName:"sender",
        isGroupChat:false,
        users:[req.user._id,userId]
       }
       try{
        const createdChat=await Chat.create(chatData)
        const FullChat=await Chat.findOne({_id: createdChat._id}).populate("users","-password")
        res.status(200).send(FullChat)
        }catch(error){
            res.status(400)
            throw new Error(error.message)
            }
        }
})

const fetchChats = asyncHandler(async (req, res) => {
  try {
    console.log(req.user._id, "nhbyhbyj");
    console.log("ppuhuh");

    const results = await Chat.find({ users: { $in: [req.user._id] } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    if (results) {
      const populatedResults = await User.populate(results, {
        path: "latestMessage.sender",
        select: "name pic email",
      });
      res.status(200).send(populatedResults);
    } else {
      res.status(404).send({ message: "No chats found" });
    }
  } catch (err) {
    console.log("not able to fetch", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
});

const createGroupChat=asyncHandler(async(req,res)=>{
    if(!req.body.users || !req.body.name){
        return res.status(400).send({"message":"please fill all the field"})
    }
    var users=JSON.parse(req.body.users)
    if(users.length<2){
        return res.status(400).send("minimum 2 users are required to create a group chat");
    }
    users.push(req.user)
    try{
        const groupChat=await Chat.create({
            chatName:req.body.name,
            isGroupChat:true, 
            users:users,
            groupAdmin:req.user
            });
            const FullGroupChat=await Chat.findOne({_id: groupChat._id}).populate("users","-password")
            .populate("groupAdmin","-password")
            res.status(200).json(FullGroupChat)
    }catch(err){
        return res.status(400).send(err.message)
    }
})

const renameGroup=asyncHandler(async(req,res)=>{
    const {chatId,chatName}=req.body;
    const updateChat=await Chat.findByIdAndUpdate(
        chatId,{
            chatName:chatName
        },{
            new:true
        }
    ).populate("users","-password")
    .populate("groupAdmin","-password");
    if(!updateChat){
        res.status(404);
        throw new Error("chat not found")
        }
        else{
            res.json(updateChat)
        }
    
})
const addToGroup=asyncHandler(async(req,res)=>{
    const {chatId, userId}=req.body;
    const added=await Chat.findByIdAndUpdate(
        chatId,
        {
            $push:{users:userId},

        },{
            new:true
        }
    ).populate("users","-password")
    .populate("groupAdmin","-password")

    if(!added){
        res.status(404);
        throw new Error("chat not found")
    }else{
        res.json(added)
    }
})

const removeFromGroup=asyncHandler(async(req,res)=>{
    const {chatId, userId}=req.body;
    const removed=await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull:{users:userId}
            },{
                new:true
                }
                ).populate("users","-password")
                .populate("groupAdmin","-password")
                if(!removed){
                    res.status(404);
                    throw new Error("chat not found")
                    }
                    else{
                        res.json(removed)
                        }
                        })

// -...    .-..  ---    -.-.   -.-
module.exports={accesschat ,fetchChats,createGroupChat,renameGroup,addToGroup,removeFromGroup } 