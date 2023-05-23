import React, { useEffect, useState } from "react";
import { ChatState } from "../ContextApi/chatProvider";
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "./config/ChatLogics";
import Profilemodel from "./Miscellaneous/Profilemodel";
import UpdateGroup from "./Miscellaneous/UpdateGroup";
import axios from "axios";
import './style.css'
import Scrollablechat from "./Scrollablechat";
import io from 'socket.io-client'

const END_POINT='http://localhost:5000'
let socket,selectedChatcompare;
function SingleChat({ fetchAgain, setFetchagain }) {
  let toast=useToast()
  let [message,setMessage]=useState([])
  let [loading,setLoading]=useState(false);
  let [newMess,setnewMess]=useState()
  let { user, selectedChat, setSelectedChat ,notification,setNotification} = ChatState();
  let [socketConnected,setSocketConnected]=useState(false)


  let fetchChat=async()=>{
    if(!selectedChat){
      return
    }

    try {
      let congif={
        headers:{
          Authorization:`Bearer ${user.token}`
        }
      }
      setLoading(true)
      let {data}=await axios.get(`http://localhost:5000/api/message/${selectedChat._id}`,congif)
      setMessage(data)
      // console.log(message);
      setLoading(false)
      socket.emit('join chat',selectedChat._id)
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }
  
  let sendMessage=async(event)=>{
    if(event.key==='Enter' && newMess){
      
      try {
        let config={
          headers:{
            'Content-type':'application/json',
            Authorization:`Bearer ${user.token}`
          }
        }
       
        setnewMess("")
        let {data}=await axios.post('http://localhost:5000/api/message',{
          content:newMess,
          chatId:selectedChat._id
        },config)
        console.log(data);
        socket.emit('new message',data)
        setMessage([...message,data])
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  }



  useEffect(()=>{
    socket=io(END_POINT)
    socket.emit('setup',user)
    socket.on('connected',()=>{setSocketConnected(true)})
   
  })
 
  useEffect(()=>{
    fetchChat()
    selectedChatcompare=selectedChat
  },[selectedChat])
 
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatcompare || // if chat is not selected or doesn't match current chat
        selectedChatcompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchagain(!fetchAgain);
        }
      } else {
        setMessage([...message, newMessageRecieved]);
      }
    });
  });

  let typingHandler=(e)=>{
    setnewMess(e.target.value)

    
  }

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
             <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupchat?(<>
                {getSender(user,selectedChat.users)}
                <Profilemodel user={getSenderFull(user,selectedChat.users)}/>
            </>):(<>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroup  fetchAgain={fetchAgain}  setFetchagain={setFetchagain} fetchChat={fetchChat}/>
            </>)}
          </Text>
          <Box
          display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            padding={3}
            bg="#E8E8E8"
            width="100%"
            height="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading?(
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ):(
              <div className="message">
                <Scrollablechat message={message}/>
              </div>
            )}
            <FormControl onKeyDown={sendMessage}
            isRequired
            mt={3}>
            
              <Input
                variant={'filled'}
                bg={'#E0E0E0'}
                placeholder="Enter a Message ...."
                value={newMess}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
}

export default SingleChat;
