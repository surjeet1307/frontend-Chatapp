import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import {useNavigate} from "react-router-dom"
function Signup() {
  let history=useNavigate()
    let [show,setShow]=useState(false)
  let [name,setName]=useState("");
  let [email,setEmail]=useState("");
  let [password,setPass]=useState("");
  let [confirmPass,setConfirmPass]=useState("")
  let [pic,setPic]=useState("")
  let [loading,setLoading]=useState(false)
 const toast=useToast()
  let handler=()=> setShow(!show)

  let postDetails=(pics)=>{
    setLoading(true)
    if (pics === undefined) {
        toast({
          title: "Please Select an Image!",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return
  }
  console.log(pics);
   if(pics.type==='image/jpeg' || pics.type==='image/png'){
    let data=new FormData();
    data.append("file",pics)
    data.append("upload_preset","Letchat")
    data.append("cloud_name","dpf0xh5rz")
    fetch("https://api.cloudinary.com/v1_1/dpf0xh5rz/image/upload",{
      method:'post',
      body:data,
    }).then((res)=>res.json()).then((data)=>{
      setPic(data.url.toString())
      console.log(data.url.toString());
      setLoading(false)
    }).catch((err) => {
      console.log(err);
      setLoading(false);
    });
   }
}

  let submitHandler=async()=>{
    setLoading(true) 
    if(!name || !email || !password || !confirmPass){
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if(password!=confirmPass){
      toast({
        title: "Password do not match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }

    try {
      let config={
        headers:{
            "Content-type":"application/json"
        }
      }
      let {data} =await axios.post('http://localhost:5000/api/user',{
        name,
        email,
        password,
        pic
      },config)
      console.log(data);
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      // history('/chats')

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
    <FormControl id='Name' isRequired>
        <FormLabel>Name</FormLabel>
        <Input
            placeholder='Enter Your Name'
            onChange={(e)=>setName(e.target.value)}
        />
    </FormControl>

    <FormControl id='Email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input
            placeholder='Enter Your Email'
            onChange={(e)=>setEmail(e.target.value)}
        />
    </FormControl>

    <FormControl id='Password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>

        <Input
           type={show?'text':'password'}
            placeholder='Enter Your Password'
            onChange={(e)=>setPass(e.target.value)}
        />
        <InputRightElement width="4.5rem">
            <Button height="1.75rem" size="sm" onClick={handler}>
             {show?"hide":"show"}
            </Button>
        </InputRightElement>
        </InputGroup>
    </FormControl>

    <FormControl id='conPassword' isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>

        <Input
           type={show?'text':'password'}
            placeholder='Confirm Your Password'
            onChange={(e)=>setConfirmPass(e.target.value)}
        />
        <InputRightElement width="4.5rem">
            <Button height="1.75rem" size="sm" onClick={handler}>
             {show?"hide":"show"}
            </Button>
        </InputRightElement>
        </InputGroup>
    </FormControl>

    <FormControl id='Pic'>
        <FormLabel>Upload Your Pic</FormLabel>
        <Input
        type='file'
        p={1.5}
        accept='image/*'
        onChange={(e)=>postDetails(e.target.files[0])}
        >

        </Input>
    </FormControl>

    <Button
        colorScheme="orange"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>

    </VStack>
  )
}

export default Signup