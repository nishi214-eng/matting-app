import React from 'react';
import logo from './logo.svg';
import './App.css';
import SignIn from './pages/signIn';
import SignUp from './pages/signUp';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <SignIn/>
        <SignUp/>
      </header>
    </div>
  );
}

export default App;
