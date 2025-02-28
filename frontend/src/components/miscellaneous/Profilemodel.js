import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Image,
  ModalCloseButton,
  IconButton,
  useDisclosure,
  Button,
  Text,
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
const Profilemodel = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      {children ? (
        <span onClick={onOpen} >{children}</span>
      ) : (<IconButton d={{ base: "flex" }} icon={<ViewIcon/>} onClick={onOpen}/> )
      }
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader
          fontSize="40px"
          fontFamily="Work sans"
          d="flex"
          justifyContent="center"
          >{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center" justifyContent="space-between">
           <Image borderRadius="full"
           boxSize="150px"
           src={user.pic}
           alt={user.name} />
           <Text fontSize={{base:"28px", md:"30px"}}
           fontFamily="work sans">
            Email:{user.email}
           </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>

    </>)
}
export default Profilemodel