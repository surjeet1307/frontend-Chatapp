import React, { useState } from 'react'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack,useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { ChatState } from '../../ContextApi/chatProvider';


function Login() {
  let navigate=useNavigate();
    let [email,setEmail]=useState("")
    let [password,setPass]=useState("")
    let [show,setShow]=useState(false)
    let [loading,setLoading]=useState(false)
    let handler=()=>setShow(!show)

    let toast=useToast()
    let submitHandler=async()=>{
       setLoading(true);
       if (!email || !password) {
        toast({
          title: "Please Fill all the Feilds",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
        return;
      }
      
      try {
        let config={
          headers:{
            "Content-type":"application/json"
          }
        }
        let {data}=await axios.post("http://localhost:5000/api/user/login",
        {
          email,
          password
        },
        config)
        toast({
          title: "Login Successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        localStorage.setItem("userInfo", JSON.stringify(data));
        setLoading(false);
        
        navigate('chat')
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
      }

    }

  return (
    <VStack spacing='5px'>
    

    <FormControl id='Email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input
            placeholder='Enter Your Email'
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
        />
    </FormControl>

    <FormControl id='Password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>

        <Input
           type={show?'text':'password'}
            placeholder='Enter Your Password'
            value={password}
            onChange={(e)=>setPass(e.target.value)}
        />
        <InputRightElement width="4.5rem">
            <Button height="1.75rem" size="sm" onClick={handler}>
             {show?"hide":"show"}
            </Button>
        </InputRightElement>
        </InputGroup>
    </FormControl>

   

    

    <Button
        colorScheme="orange"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        variant="solid"
        colorScheme="blue"
        width="100%"
        onClick={() => {
          setEmail("guest@example.com");
          setPass("123456");
        }}
      >
        Get Guest User Credentials
      </Button>

    </VStack>
  )
}

export default Login