import React, { useEffect, useState } from 'react';
import { Chatstate } from './context/Chatprovider';
import { Box, FormControl, IconButton, Input, Spinner, Text, useEventListenerMap, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import Profilemodel from './miscellaneous/Profilemodel';
import { getSender, getSenderFull } from '../config/chatlogic';
import UpdateGroupChatmodel from './miscellaneous/UpdateGroupChatmodel';
import "./styles.css";
import axios from 'axios';
import io from 'socket.io-client'
import { ScrollableChat } from './ScrollableChat';
const ENDPOINT="http://localhost:5000";
var socket, selectedChatCompare;
export const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [typingTimer, setTypingTimer] = useState(null);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
   const [socketConnected,setSocketConnected]=useState(false);
  const { user, selectedChat, setSelectedChat,notification,setNotification } = Chatstate();
  const [typing,setTyping]=useState(false)
  const [isTyping,setIsTyping]=useState(false)
  const toast = useToast();

   
  useEffect(() => {
    fetchMessages();
    selectedChatCompare=selectedChat
  }, [selectedChat]);

  useEffect(()=>{  
socket=io(ENDPOINT)
socket.emit("setup",user)
socket.on('connected',()=>setSocketConnected(true))
socket.on("typing",(data)=>setIsTyping(true))
socket.on('stop typing',()=>setIsTyping(false))

  },[])

  useEffect(()=>{
    socket.on("message recieved",(newMessageRecieved)=>{
      if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id ){
     
        if(!notification.includes(newMessageRecieved)){
          setNotification([newMessageRecieved,...notification] )
        
        }
      }else{
        setMessages([...messages,newMessageRecieved])
      }
    })
  })



  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`http://localhost:5000/api/message/${selectedChat._id}`, config);
      setMessages(data); 
      setLoading(false);
      socket.emit('join chat', selectedChat._id);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to load the messages',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  };


  const sendMessage = async (event) => {

    if (event.key === 'Enter' && newMessage) {
      socket.emit("stop typing",selectedChat._id);
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage('');
        const { data } = await axios.post(
          'http://localhost:5000/api/message',
          { content: newMessage, chatId: selectedChat._id },
          config
        );
        socket.emit("new message",data)
        setMessages([...messages, data]); 
      } catch (err) {
        toast({
          title: 'Error Occurred',
          description: 'Failed to send the message',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'bottom-left',
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if(!socketConnected){

    return;
    }
    if(!typing){
      setTyping(true)
      socket.emit("typing",selectedChat._id);
    }
    if (typingTimer) {
      clearTimeout(typingTimer);
    }
  

    const newTimer = setTimeout(() => {
      setTyping(false);
      socket.emit("stop typing", selectedChat._id);
    }, 3000);
  
  
    setTypingTimer(newTimer);
      
  
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: '28px', md: '30px' }}
            pb={3}
            display="flex"
            alignItems="center"
            justifyContent={{ base: 'space-between' }}
            width="100%"
            px={2}
          >
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat('')}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <Profilemodel user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatmodel fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />
              </>
            )}
          </Text>

          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                width={20}
                height={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <Box className="messages" flex="1" overflowY="scroll" marginBottom="10px">
                <ScrollableChat messages={messages} />
              </Box>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
            {isTyping?<div>
              loading...
            </div>:<></>}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Type a message"
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="work sans">
            Click on a User to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
