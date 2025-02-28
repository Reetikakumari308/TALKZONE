import React from 'react';
import { useEffect} from 'react';
import { Container, Box, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import Login from '../Authentication/Login';
import SignUp from '../Authentication/SignUp';
import { useNavigate } from 'react-router-dom';
const HomePage = () => {
  const navigate = useNavigate();
  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem("userInfo"))
    if(user)  navigate('/chats');
  },[navigate])
  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        padding={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Work sans" color="black">
          TalkZone
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
      <Tabs variant='soft-rounded' colorScheme='green'>
  <TabList>
    <Tab width="50%">Login</Tab>
    <Tab width="50%">SignUp</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
    
     <Login/>
    </TabPanel>
    <TabPanel>
     <SignUp/>
    </TabPanel>
  </TabPanels>
</Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
