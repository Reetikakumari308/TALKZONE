import React, { useEffect, useState } from 'react'
import { Chatstate } from './context/Chatprovider'
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react'
import axios from 'axios'
import { AddIcon } from '@chakra-ui/icons'
import ChatLoading from './miscellaneous/ChatLoading'
import { getSender } from '../config/chatlogic'
import GroupChatModal from './miscellaneous/GroupChatModal'
const Mychats = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState()
  const { selectedChat, setSelectedChat, user, chats, setChats } = Chatstate()
  const toast = useToast()

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      const { data } = await axios.get(`http://localhost:5000/api/chat`, config);
      setChats(data);

    } catch (err) {
      toast({
        title: 'Error',
        description: "Failed to fetch chats",
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "bottom-left"

      })
    }
  }

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
    fetchChats()
  }, [fetchAgain])

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="#F8F9FA"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"

    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
        <Button

          fontSize={{ base: "17px", md: "10px", lg: "17px" }}
          rightIcon={<AddIcon />}
        >
          New Group Chat
        </Button>
        </GroupChatModal>
      </Box>
     
      <Box
        display="flex"
        flexDir="column"
        padding={3}
        bg="#F8F9FA"
        width="100%"
        height="100%"
        borderRadius="lg"
        overflow="hidden"
      >
        {
          chats ? (
            <Stack

              overflowY='scroll'>
              {
                chats.map((chat) => (
                  <Box
                    onClick={() => setSelectedChat(chat)}
                    cursor="pointer"
                    bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                    color={selectedChat === chat ? "white" : "black"}
                    px={3}
                    py={2}
                    borderRadius="lg"
                    key={chat._id}
                  >
                    <Text>
                      {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                    </Text>
                  </Box>
                ))
              }

            </Stack>

          ) : (
            <ChatLoading />
          )
        }
      </Box>
    </Box>
  )
}

export default Mychats

