import './App.css';
import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Welcome from './Pages/Welcome';
import Signup from './Pages/Signup'
import Navbar from './Components/Navbar';
import { AuthContext } from './Shared/Context/Auth-context';
import { FloatButton } from 'antd';
import { useAuth } from "./Shared/Hooks/auth-hook";
import Home from './Pages/Home';
import Contacts from './Pages/Contacts';
import SendMessage from './Pages/SendMessage';
import ReceiveImages from './Pages/ReceiveImages';


function App() {
let routes;
const { token, login, logout, userId } = useAuth();

  if(token){
    routes=(
      <React.Fragment>
<Navbar/>
      <Routes>
        <Route path="/" element={<Home />} exact/>
        <Route path="/contacts" element={<Contacts />} exact/>
        <Route path="/sendmessage/:id" element={<SendMessage />} exact/>
        <Route path="/receive" element={<ReceiveImages />} exact/>
      
      </Routes>
      </React.Fragment>
    )
  }else{
    routes=(
      <React.Fragment>
      <Navbar/>
      <Routes>
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      </React.Fragment>
    )
  }
  return (
    <AuthContext.Provider value={{isLoggedIn:!!token,userId,token,login:login,logout:logout}}>
      <Router>{routes}</Router>
      <FloatButton.BackTop />
    </AuthContext.Provider>
   
  );
}

export default App;
