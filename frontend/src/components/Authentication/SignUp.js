import React from 'react'
import { useToast } from '@chakra-ui/react'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react'
const SignUp = () => {
  const [show, setShow] = useState(false)
  const [name, setName] = useState()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [confirmPassword, setConfirmPassword] = useState()
  const [loading,setLoading]=useState(false)
  const [pic, setPic] = useState()
  const toast = useToast();
  const navigate = useNavigate();
  const postDetails = (pics) => {
  
    // if (pics === undefined) {
    //   toast({
    //     title: 'Please Select an Image',
    //     status: 'warning',
    //     duration: 5000,
    //     isClosable: true,
    //     position: "bottom",
    //   });
    //   return;
    // }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chatapp")
      data.append("cloud_name", "dsgxx2ppv")
      fetch("https://api.cloudinary.com/v1_1/dsgxx2ppv/image/upload", {
        method: "post",
        body: data
      }).then(res => res.json())
        .then(data => {
          setPic(data.url.toString());
          setLoading(false);
          toast({
            title: 'Profile Picture uploaded',
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          
        })
        .catch((err) => {
          toast({
            title: 'Error Occured!',
            description: err.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: "bottom",

          })
          setLoading(false)

        })


    }
  
  }

const submitHandler = async() => {
setLoading(true)
if(!name || !email || !password || !confirmPassword){
  toast({
    title: 'Please fill all the fields',
    status: 'warning',
    duration: 5000,
    isClosable: true,
    position: "bottom",
})
  setLoading(false)
  return
}
if(password !== confirmPassword){
  toast({
    title: 'Passwords do not match',
    status: 'warning',
    duration: 5000,
    isClosable: true,
    position: "bottom",
    })
    setLoading(false)
    return
    }
    // if(!pic){
    //   toast({
    //     title: 'Please Select an Image',
    //     status: 'warning',
    //     duration: 5000,
    //     isClosable: true,
    //     position: "bottom",
    //     })
    //     setLoading(false)
    //     return
    //     }
        try{
          const config={
            headers: {
              'Content-Type': 'application/json',
              }
              }
              const {data} = await axios.post('http://localhost:5000/api/user', {name, email, password,pic},
                config)
              toast({
                title: 'User Created Successfully',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: "bottom",
                })
                   localStorage.setItem("userinfo",JSON.stringify(data));
                   setLoading(false)
                   navigate('/chats');
          }
      catch(error){
       toast({
        title: 'Error Occured!',
        description: 'Failed to Create Account',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "bottom",
        })
        setLoading(false)
        
        }

}

const handleClick = () => {
  setShow(!show)
}
return (
  <VStack spacing='5px'>
    <FormControl id="first-name" isRequired>
      <FormLabel  >Name</FormLabel>
      <Input placeholder='Enter Your Name'
        onChange={(e) => { setName(e.target.value) }} />
    </FormControl>

    <FormControl id="email" isRequired>
      <FormLabel  >Email</FormLabel>
      <Input placeholder='Enter Your emailid'
        onChange={(e) => { setEmail(e.target.value) }} />
    </FormControl>

    <FormControl id="password" isRequired>
      <FormLabel  >password</FormLabel>
      <InputGroup>
        <Input type={show ? "text" : "password"} placeholder='Enter Password'
          onChange={(e) => { setPassword(e.target.value) }} />
        <InputRightElement>
          <Button h="1.75rem" size="sm" p={1.5} onClick={handleClick}>
            {show ? 'Hide' : 'Show'}
          </Button>
        </InputRightElement>
      </InputGroup>
    </FormControl>
    <FormControl id="Confirmpassword" isRequired>
      <FormLabel  >Confirm password</FormLabel>
      <InputGroup size="md">
        <Input type={show ? "text" : "password"} placeholder='Confirm password'
          onChange={(e) => { setConfirmPassword(e.target.value) }} />
        <InputRightElement>
          <Button h="1.75rem" size="sm" p={1.5} onClick={handleClick}>
            {show ? 'Hide' : 'Show'}
          </Button>
        </InputRightElement>
      </InputGroup>
    </FormControl>
    <FormControl id="pic">
      <FormLabel>
        Upload Your Picture
      </FormLabel>
      <Input type="file" p={1.5} accept='image/*' onChange={(e) => postDetails(e.target.files[0])} />
    </FormControl>
    <Button
      colorScheme="blue"
      width="100%"
      style={{ marginTop: 15 }}
      onClick={submitHandler}
      isLoading={loading}
      >
      SignUp
    </Button>
  </VStack>
)
}

export default SignUp