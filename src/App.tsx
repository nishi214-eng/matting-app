import React from 'react';
import logo from './logo.svg';
import './App.css';
import ChatList from './ChatList';
import LicenseUpload from './LicenseUpload';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <h1>運転免許証のアップロード</h1>
      <LicenseUpload />
      </header>
      <ChatList />
    </div>
  );
}

export default App;
