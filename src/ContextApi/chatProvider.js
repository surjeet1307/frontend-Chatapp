import {createContext, useContext, useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';

let chatcontext=createContext();

let ContextProvider=({children})=>{ 
    let [user,setUser]=useState()
    let [selectedChat,setSelectedChat]=useState()
    let [chats,setChats]=useState()
    let [notification,setNotification]=useState([])
    
    
    let navigate=useNavigate()

    useEffect(()=>{
      let userInfo=JSON.parse(localStorage.getItem("userInfo"))
      setUser(userInfo)
      console.log(userInfo);
      if(!userInfo){
          
          navigate('/')
       }
    },[navigate])


    return <chatcontext.Provider 
     value={{user,setUser,selectedChat,setSelectedChat,chats,setChats,notification,setNotification}}
      >{children}</chatcontext.Provider>
}

export let ChatState=()=>{
    return useContext(chatcontext)
}


export default ContextProvider;