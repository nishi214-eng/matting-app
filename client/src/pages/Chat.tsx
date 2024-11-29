import React, { useState } from 'react';
import ChatLogView from '../components/chatLog';
import { useAuthContext } from '../store/AuthContext';
import { sortName } from '../feature/sortName';
import VideoConnect from './VideoConnect';
import { Button } from '@mui/material';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import { useLocation } from 'react-router-dom';

const Chat: React.FC = () => {
    const {user} = useAuthContext(); 
    const [roomName,setRoomName] = useState<string|null>(null);

    const location = useLocation();
    const { partnerName } = location.state || { partnerName: '名称未設定' };

    const startTel = () => {
  
            // userとmyNameの並びを一意にすることでchatRoomの名前を特定
            if(user?.displayName){
                const sortNameArray = sortName(partnerName,user?.displayName);
                const chatRoomName = sortNameArray[0] + "_" + sortNameArray[1];
                setRoomName(chatRoomName);
            }
        
    }
    return (
        <div>
            <Button
                onClick={startTel}
            >
                <LocalPhoneIcon/>
            </Button>
            {user && !roomName && user.displayName &&
                <ChatLogView partnerName={partnerName} userName={user.displayName}/>
            }
            {!user &&
                <h1>
                    ・・・
                </h1>
            }
            {roomName &&
                <VideoConnect room={roomName}/>   
            }
        </div>
    );
};

export default Chat;