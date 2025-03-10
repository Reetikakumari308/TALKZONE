const asyncHandler = require('express-async-handler');
const Message = require('../models/messageModel');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log('Invalid data passed into request');
    return res.sendStatus(400);
  }

  console.log('Received valid data');

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);
    

    message = await message.populate('sender', 'name pic')


    message = await message.populate('chat')


    message = await User.populate(message, {
      path: 'chat.users',
      select: 'name pic email',
    });
    
    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message._id,
    });

    res.json(message);
  } catch (err) {
    console.error('Error in sendMessage:', err);
    res.status(400).json({ error: err.message });
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'name pic email')
      .populate('chat');
    res.json(messages);
  } catch (err) {
    console.error('Error in allMessages:', err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = { sendMessage, allMessages };
