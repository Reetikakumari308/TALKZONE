import React from 'react'
import { Chatstate } from './context/Chatprovider';
import { Box } from '@chakra-ui/react';
import  SingleChat  from './SingleChat';

const Chatbox = ({fetchAgain,setFetchAgain}) => {
  const{selectedChat}=Chatstate();

  return (
 <Box 
 display={{base:selectedChat?"flex":"none", md:"flex"}}
 alignItems="center"
 flexDir="column"
 padding={3}
 bg="white"
 w={{base:"100%", md:"68%"}}
 borderRadius="lg"
 borderWidth="1px"
 >
 <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />

 </Box>
  )
}

export default Chatbox