import React, { useEffect } from "react";
import { Button, Container, Box, Text ,Tabs,Tab,TabList,TabPanel,TabPanels} from "@chakra-ui/react";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import { useNavigate } from "react-router-dom";
function Homepage() {
  let navigate=useNavigate()
  useEffect(()=>{
    let userInfo=JSON.parse(localStorage.getItem('userInfo'))
    if(userInfo){
      navigate('/chat')
    }
  },[navigate])

  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Work sans">
          Let's Chat
        </Text>
      </Box>

      <Box
        backgroundColor="white"
        width="100%"
        padding={4}
        borderRadius="lg"
        borderWidth="1px"
      >
        <Tabs variant="soft-rounded" colorScheme="orange">
          <TabList mb="1rem">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <p>{<Login/>}</p>
            </TabPanel>
            <TabPanel>
              <p>{<Signup/>}</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Homepage;
