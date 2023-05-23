import { Box, Button, Flex, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../ContextApi/chatProvider'
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem'
import UserBadget from '../UserAvatar/UserBadget'


function GroupChatModel({children}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    let [groupChatName,setGroupChatName]=useState()
    let [SelectedUsers,setSelectedUsers]=useState([])
    let [search,setSearch]=useState("")
    let [searchResult,setSearchResult]=useState([])
    let [loading,setLoading]=useState(false)
    let toast=useToast()
    let {user,chats,setChats}=ChatState()

    let handleSearch=async(query)=>{
      setSearch(query)
      if(!query){
        return
      }

      try {
        setLoading(true)
        let config={
            headers:{
              
                Authorization:`Bearer ${user.token}`
            }
        }

        let {data}=await axios.get(`http://localhost:5000/api/user?search=${search}`,config)
        // console.log(data);
        setSearchResult(data)
        setLoading(false)

      } catch (error) {
        toast({
            title: "Error Occured!",
            description: "Failed to Load the Search Results",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
      }
    }

    let handleSubmit=async()=>{
        if (!groupChatName || !SelectedUsers) {
            toast({
              title: "Please fill all the feilds",
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "top",
            });
            return;
          }

          try {
            let config={
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }

            let {data} =await axios.post(`http://localhost:5000/api/chats/group`,{
                name: groupChatName,
                users: JSON.stringify(SelectedUsers.map((u) => (u._id))),
            }
            ,config)
            // console.log("hello");
            setChats([data,...chats])
            // console.log(data);
            onClose()
            toast({
                title: "New Group Chat Created!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
          } catch (error) {
            toast({
                title: "Failed to Create the Chat!",
                description: error.response.data,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
          }
      
    }

    let handleDelte=(us)=>{
        setSelectedUsers(SelectedUsers.filter((sel) => sel._id !== us._id));

    }

    let handleGroup=(us)=>{
       if(SelectedUsers.includes(us)){
        toast({
            title: "User already added",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
       }
       else
       setSelectedUsers([...SelectedUsers,us])

    }
     
  return (
    <>
        <span onClick={onOpen}>{children}</span>

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
          fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center">Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" alignItems="center">
            <FormControl>
                <Input
                    placeholder='Enter Group Name'
                    mb={'2'}
                    onChange={(e)=>{setGroupChatName(e.target.value)}}
                    
                />
            </FormControl>
            <FormControl>
                <Input
                    placeholder='Add users'
                    mb={'2'}
                    onChange={(e)=>{handleSearch(e.target.value)}}
                  
                />
            </FormControl>
            <Box display={'flex'}>

             {SelectedUsers.map((users)=>
             <UserBadget
                key={users._id}
                user={users}
                handleFun={()=>handleDelte(users)}
             />)}
            </Box>

            {
                loading?<div>Loading</div>:
                searchResult?.slice(0,4).map((user)=>(
                    <UserListItem key={user._id} user={user} handleFun={()=>handleGroup(user)}/>
                ))
            }


          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
              Create Group
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModel