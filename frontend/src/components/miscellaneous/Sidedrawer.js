import { Button, MenuButton,MenuList, Tooltip, Box, Text, Menu, Avatar, AvatarBadge, MenuItem, MenuDivider, Toast, Spinner } from '@chakra-ui/react'
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import React, { useState } from 'react'
import { Chatstate } from '../context/Chatprovider'
import Profilemodel from './Profilemodel'
import { useNavigate } from 'react-router-dom';

import axios from "axios"
import { getSender } from '../../config/chatlogic'
import UserListItem from '../useravatar/UserListItem'
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  useToast,
} from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react'
import ChatLoading from './ChatLoading'
const   Sidedrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingChat, setLoadingChat] = useState(false)
  const { user,setSelectedChat,chats,setChats,notification,setNotification } = Chatstate()
  const toast=useToast()
  const navigate = useNavigate();
  const logoutHandler=()=>{
    localStorage.removeItem('userInfo')
    navigate('/');
  }
  const accessChat = async(userId) => {
    // Define this function if needed
    setLoadingChat(true)
    try{
    const config={
      headers:{
        "Content-type":"application/json",
        Authorization: `Bearer ${user.token}`,
    },
  }
  const {data}=await axios.post('http://localhost:5000/api/chat',{userId},config)
  if(!chats.find((c)=>c._id === data._id)){
    setChats([data, ...chats]);
  }
 setSelectedChat(data);
 setLoadingChat(false)
 onClose()
  }catch(error){
toast({
  title:"Error ",
  description:"Failed to fetch the chat",
  status:"error",
  duration:2000,
  isClosable:true,
  position:'top-left'
  
})
setLoadingChat(false)
  }
}
const handleSearch=async()=>{
  if(!search){
    toast({
title:"please write something in search",
status:"warning",
duration:3000,
isClosable:true,
position:"top-left"
    })
    return;
  }
  try{
    setLoading(true)
    const config={
      headers:{
        Authorization:`Bearer ${user.token}`
        },
    };
    const {data}=await axios.get(`http://localhost:5000/api/user?search=${search}`,config)
     setLoading(false)
    //  console.log(data)
     setSearchResults(data);
  }catch(err){
 toast({
  title:"error occured",
  description:"failed to load result",
  status:"error",
  duration:3000,
  isClosable:true,
  position:"top-left"
  })
  setLoading(false)
}
  }

  return (
    <>
    <Box
      p={4}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      bg="gray.100"
      borderRadius="md"
      shadow="md"
    >
      <Tooltip
        label="Search user to chat"
        hasArrow
        placement="bottom-end"
      >
        <Button variant="ghost" mr={4} onClick={onOpen}>
          <i className="fa-solid fa-magnifying-glass"></i>
          <Text d={{ base: "none", md: "flex" }} px="4">
            Search user
          </Text>
        </Button>
      </Tooltip>
      <Text fontSize="2xl" fontFamily="Work sans" fontWeight="bold">
        TalkZone
      </Text>
      <Box display="flex" alignItems="center">
        <Menu>
          <MenuButton p={1}>
          <Box position="relative" display="inline-block">
  {notification.length && <div
    style={{
      position: 'absolute',
      top: '-5px', // Adjust the vertical position as needed
      right: '-5px', // Adjust the horizontal position as needed
      width: '8px', // Dot diameter
      height: '8px', // Dot diameter
      borderRadius: '50%',
      backgroundColor: 'red',
    }}
  />}
            <BellIcon fontSize="2xl" m={1} >
            {notification.length && <AvatarBadge boxSize="1.25em" bg="red.500" />}
            
            </BellIcon>
            </Box>

          </MenuButton>
          <MenuList pl={2}>
          {!notification.length && "no new message"}
          {notification.map((notif)=>(
            <MenuItem key={notif._id} onClick={()=>{
              setSelectedChat(notif.chat)
              setNotification(notification.filter((n)=>n!==notif))
            }} >
            {notif.chat.isGroupChat
            ?`new message in ${notif.chat.chatName}`:`New Message from ${getSender(user,notif.chat.users)}`}
                
            </MenuItem>
          ))}

          </MenuList> 
        </Menu>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />} ml={4}>
            <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic}>
              {user.pic && <AvatarBadge boxSize="1.25em" bg="green.500" />}
            </Avatar>
          </MenuButton>
          <MenuList>
          <Profilemodel user={user} >
            <MenuItem>My Profile</MenuItem>
            </Profilemodel>
            <MenuDivider/>
            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Box>
<Drawer placement='left' onClose={onClose} isOpen={isOpen}>
  <DrawerOverlay/>
<DrawerContent>
  <DrawerHeader borderBottomWidth="1px">Search User</DrawerHeader>
  <DrawerBody>
  <Box display="flex" pb={2}>
<Input
  placeholder='search by name or email'
  mr={2}
  value={search}
  onChange={(e)=>setSearch(e.target.value)}
/>
<Button 
onClick={handleSearch}
>Go</Button>
  </Box>
  {loading?(<ChatLoading/>):(
    searchResults.map(user=>(
<UserListItem 
key={user._id}
user={user}
handleFunction={()=>accessChat(user._id)}
 />
    ))
  )}
  {loadingChat && <Spinner ml="auto" d="flex" />}
</DrawerBody>
</DrawerContent>

</Drawer>
    </>
  )
}

export default Sidedrawer
