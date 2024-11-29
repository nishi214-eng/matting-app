import { SignIn } from './pages/signIn';
import SignUp from './pages/signUp';
import { ResetPassword } from './pages/resetPassword';
import { BrowserRouter, Route, Routes} from "react-router-dom";

import './App.css';
import ChatList from './pages/ChatList';
import ProfileForm from './pages/ProfileForm';
import ProfileDisplay from './pages/ProfileDisplay';
import Chat from './pages/Chat';
import { AuthProvider } from './store/AuthContext';
import { AlertProvider } from './store/useSnackber';
import VideoConnect2 from './pages/VideoConnect2';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      </header>
      <BrowserRouter>
        <AuthProvider>
          <AlertProvider>
            <Routes>
              <Route path="/" element={<SignIn />} />
              <Route path="/SignUp" element={<SignUp />} />
              <Route path="/ResetPassword" element={<ResetPassword />} />
              <Route path="/ChatList" element={<ChatList />} />
              <Route path="/Chat" element={<Chat/>} />
              <Route path="/ProfileForm" element={<ProfileForm />} />
              <Route path="/ProfileDisplay" element={<ProfileDisplay />} />
              <Route path="/Tel" element={<VideoConnect2 />} />
              <Route path="*" element={<h1>Not Found Page</h1>} />
            </Routes>
          </AlertProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;