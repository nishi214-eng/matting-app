import { SignIn } from './pages/signIn';
import SignUp from './pages/signUp';
import { ResetPassword } from './pages/resetPassword';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import './App.css';
import ChatList from './pages/ChatList';
import ProfileForm from './pages/ProfileForm';
import FileUploadForm from './components/FileUploadForm';


function App() {
  return (
    <div className="App">
      <header className="App-header">
      </header>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Navigate to="/FileUploadForm" />} />  {/* デフォルトルート */}
          <Route path="/FileUploadForm" element={<FileUploadForm />} />
          <Route path="*" element={<h1>Not Found Page</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
