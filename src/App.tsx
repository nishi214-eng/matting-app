import React from 'react';
import logo from './logo.svg';
import './App.css';
import SignIn from './pages/signIn';
import SignUp from './pages/signUp';
import { BrowserRouter, Route, Routes} from "react-router-dom";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="*" element={<h1>Not Found Page</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
