const express= require("express")
const app=express();
const cors = require('cors');
const dotenv= require("dotenv")
const {chats}= require("./data/data");
const connectDB = require("./config/db");
const chatRoutes =require("./routes/chatRoutes")
const messageRoutes=require("./routes/messageRoutes")
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./errorMiddleware");
dotenv.config()
connectDB()
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
}));
console.log("this is me")
app.use('/api/user',userRoutes)
app.use("/api/chat",chatRoutes)
app.use("/api/message",messageRoutes)
app.use(notFound)
app.use(errorHandler)


const PORT=process.env.PORT || 5000
const server=app.listen(5000,console.log("Server Started on port 5000"));
const io=require('socket.io')(server,{
    pingTimeout:60000,
    cors:{
        origin:"http://localhost:3000"
        }

})

io.on("connection",(socket)=>{
    console.log("Connected to socket.io")
     socket.on('setup',(userData)=>{
        socket.join(userData._id);
      
        socket.emit("connected")
     })
  

     socket.on("join chat",(room)=>{
        socket.join(room)
        console.log("user join room")
        })
socket.on('typing',(room)=>socket.in(room).emit("typing"))
socket.on('stop typing',(room)=>socket.in(room).emit("stop typing"))
        socket.on('new message',(newMessageRecieved)=>{
var chat=newMessageRecieved.chat;
if(!chat.users) return console.log('chat.users not defined')

    chat.users.forEach(user=>{
        if(user._id===newMessageRecieved.sender._id) return;

        socket.in(user._id).emit("message recieved",newMessageRecieved)
    })

        })
   

        })


