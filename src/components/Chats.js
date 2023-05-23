import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ChatState } from '../ContextApi/chatProvider'
import { Box, Button } from '@chakra-ui/react'
import SideDrawer from './Miscellaneous/SideDrawer'
import Mychats from './Mychats'
import Chatbox from './Chatbox'
import GroupChatModel from './Miscellaneous/GroupChatModel'
import { AddIcon } from '@chakra-ui/icons'
function Chats() {
  let {user}=ChatState()
    let [fetchAgain,setFetchagain]=useState(false)
      
  return (
    <div style={{width:'100%'}}>
      {user && <SideDrawer/>}
       <Box display={'flex'} justifyContent={'space-between'} width={'100%'} height={'95vh'} padding={'10px'}>
        {user && <Mychats fetchAgain={fetchAgain}  />}
        
        {user && <Chatbox fetchAgain={fetchAgain}  setFetchagain={setFetchagain}/>}
       </Box>

    </div>
  )
}

export default Chats