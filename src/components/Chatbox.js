import React from 'react'
import { ChatState } from '../ContextApi/chatProvider'
import { Box } from '@chakra-ui/react'
import SingleChat from './SingleChat'

function Chatbox({fetchAgain, setFetchagain}) {
  let {selectedChat}=ChatState()


  return (
    <Box
    display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDirection="column"
      padding={3}
      bg="white"
      width={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px">
          <SingleChat fetchAgain={fetchAgain} setFetchagain={setFetchagain} />
    </Box>
  )
}

export default Chatbox