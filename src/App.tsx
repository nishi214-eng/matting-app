import { SignIn } from './pages/signIn';
import SignUp from './pages/signUp';
import { ResetPassword } from './pages/resetPassword';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import './App.css';
import ChatList from './pages/ChatList';
import ProfileForm from './pages/ProfileForm';
import FileUpload from './components/FileUpload';


function App() {
  return (
    <div className="App">
      <header className="App-header">
      </header>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/ResetPassword" element={<ResetPassword />} />
          <Route path="/ChatList" element={<ChatList />} />
          <Route path="/ProfileForm" element={<ProfileForm />} />
          <Route path="/" element={<Navigate to="/FileUpload" />} />  {/* デフォルトルート */}
          <Route path="/FileUpload" element={<FileUpload />} />
          <Route path="*" element={<h1>Not Found Page</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
