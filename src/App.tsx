import { SignIn } from './pages/signIn';
import SignUp from './pages/signUp';
import { ResetPassword } from './pages/resetPassword';
import { BrowserRouter, Route, Routes} from "react-router-dom";

import React from 'react';
import logo from './logo.svg';
import './App.css';
import ChatList from './ChatList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      </header>
      <ChatList />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/ResetPassword" element={<ResetPassword />} />
          <Route path="*" element={<h1>Not Found Page</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
