// import React, { useEffect,useState } from 'react'
// import axios from 'axios'
import { Box } from '@chakra-ui/react';
import {Chatstate} from '../context/Chatprovider'
import Sidedrawer from '../miscellaneous/Sidedrawer';
import Mychats from '../Mychats';
import Chatbox from '../Chatbox';
import { useState } from 'react';
const ChatPage = () => {
const {user}=Chatstate()
const [fetchAgain,setFetchAgain]=useState(false);

  return (
 
  <div style={{width:"100%"}}>
  {user && <Sidedrawer/>} 
 <Box display="flex" justifyContent='space-between' w='100%' h='91.5vh' p='10px'>
  {user && <Mychats  fetchAgain={fetchAgain}  />}
  {user && <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
 </Box>
  </div>
  )
}

export default ChatPage