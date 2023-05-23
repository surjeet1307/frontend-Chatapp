

import { ChakraProvider } from '@chakra-ui/react';
import './App.css';
import Homepage from './components/Homepage';
import { BrowserRouter as Router,Routes ,Route} from 'react-router-dom';
import Chats from './components/Chats';
import ContextProvider from './ContextApi/chatProvider'




function App() {
  return (
    <div className='App'>
    
     <ChakraProvider>
      <Router>
        <ContextProvider>
        <Routes>

         <Route exact path='/' element={<Homepage/>} ></Route>
         <Route path='/chat' element={<Chats/>}></Route>
        </Routes>
        </ContextProvider>
      </Router>
     
     </ChakraProvider>
   
   
    </div>
  );
}

export default App;
