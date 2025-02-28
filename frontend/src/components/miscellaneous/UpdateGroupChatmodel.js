import React, { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  IconButton,
  Box,
  useToast,
  useDisclosure,
  Button,
  Input,
  FormControl,
  Spinner,
} from '@chakra-ui/react'
import axios from "axios"
import { ViewIcon } from '@chakra-ui/icons'
import { Chatstate } from '../context/Chatprovider'
import UserBadgeItem from '../useravatar/UserBadgeItem'
import UserListItem from '../useravatar/UserListItem'

const UpdateGroupChatModel = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const [groupChatName, setGroupChatName] = useState('')
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [renameLoading, setRenameLoading] = useState(false)
  const { selectedChat, setSelectedChat, user } = Chatstate()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: "Only admin can remove a member",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.put(
        "http://localhost:5000/api/chat/groupremove",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );
   
      const { data } = response;
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      console.error('Error Response:', err.response);
      toast({
        title: "Failed to remove user",
        description: err.response?.data?.message || "Failed to remove user",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  
  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User already in group",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
      return
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admin can add user",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
      return
    }
    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      const { data } = await axios.put("http://localhost:5000/api/chat/groupadd", {
        chatId: selectedChat._id,
        userId: user1._id
      }, config)
      setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      setLoading(false)
    } catch (err) {
      toast({
        title: "Failed to add user",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
      setLoading(false)
    }
  }

  const handleRename = async () => {
    if (!groupChatName) return
    try {
      setRenameLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      const { data } = await axios.put(`http://localhost:5000/api/chat/rename`, {
        chatId: selectedChat._id,
        chatName: groupChatName
      }, config)
      console.log(data)
      setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      setRenameLoading(false)
    } catch (err) {
      toast({
        title: 'Failed to rename the group',
        description: 'Failed to rename the group chat',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "bottom",
      })
      setRenameLoading(false)
    }
    setGroupChatName("")
  }

  const handleSearch = async (query) => {
    setSearch(query)
    if (!query) return
    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      const { data } = await axios.get(`http://localhost:5000/api/user?search=${query}`, config)
      setSearchResult(data)
      setLoading(false)
    } catch (err) {
      toast({
        title: 'Failed to load search results',
        description: 'Failed to load search results',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "bottom",
      })
      setLoading(false)
    }
  }

  return (
    <>
      <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box width="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat?.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder='Chat Name'
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder='Add user to group'
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModel
 