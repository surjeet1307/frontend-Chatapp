import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuIcon,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Toast,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../../ContextApi/chatProvider";
import Profilemodel from "./Profilemodel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../config/ChatLogics";
import NotificationBadge, { Effect } from 'react-notification-badge'
function SideDrawer() {
  let navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  let { user,setSelectedChat,chats,setChats,setUser,notification,setNotification } = ChatState();
  
  let [search, setSearch] = useState("");
  let [searchResult, setSearchResult] = useState([]);
  let [loading, setLoading] = useState(false);
  let [loadingChat, setLoadingChat] = useState(false);
 let toast=useToast()
  let handleSearch=async()=>{
    if(!search){
        toast({
            title: "Please Enter something in search",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top-left",
          });
          return;
    }

   try {
    setLoading(true)
    let config={
        headers:{
            Authorization:`Bearer ${user.token}`
        }
    }
       
    const {data}=await axios.get(`http://localhost:5000/api/user?search=${search}`,config)
     setLoading(false)
     setSearchResult(data)
    //  console.log(data);
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
   
  let accessChat=async(userId)=>{
      try {
        setLoadingChat(true)
        let config={
            headers:{
                'Content-type':'application/json',
                Authorization:`Bearer ${user.token}`
            }
        }
        
        let {data} = await axios.post('http://localhost:5000/api/chats',{userId},config)
        if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
        setSelectedChat(data)
        setLoadingChat(false)
          onClose()
    } catch (error) {
        toast({
            title: "Error fetching the chat",
            description: error.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
    }   

  }


  let logoutHandler = () => {
    localStorage.removeItem("userInfo");
    setChats()
   
    navigate("/");
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        backgroundColor="white"
        width="100%"
        padding="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow>
          <Button variant={"ghost"} onClick={onOpen}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <Text display={{ base: "none", md: "flex" }} padding={"4"}>
              Search
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="Work sans">
          Let's-Chat
        </Text>
        <div>
          <Menu>
            <MenuButton padding={"1"}>
            <NotificationBadge
             count={notification.length}
             effect={Effect.SCALE}
            />
              <BellIcon fontSize={"2xl"} margin={"1"} />
            </MenuButton>
            <MenuList pl={'2'}>
              {!notification.length && "No New Messages"}
              {notification.map((noti)=>(
                <MenuItem key={noti._id} onClick={()=> {setSelectedChat(noti.chat)
                 setNotification(notification.filter((n) => n !== noti));
                }}>
                {noti.chat.isGroupChat
                    ? `New Message in ${noti.chat.chatName}`
                    : `New Message from ${getSender(user, noti.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <Profilemodel user={user}>
                <MenuItem>Profile</MenuItem>
              </Profilemodel>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>Search Users</DrawerHeader>
          <DrawerBody>
            <Box display={'flex'} paddingBottom={'2'}>
            <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>

            </Box>
               {loading?(<ChatLoading/>):(
                searchResult?.map((user)=>(
                    <UserListItem
                        key={user._id}
                        user={user}
                        handleFun={()=>accessChat(user._id)}
                    />
                ))
               )}
               {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
