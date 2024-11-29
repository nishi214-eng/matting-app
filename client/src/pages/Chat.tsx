import React, { useState } from 'react';
import ChatLogView from '../components/chatLog';
import { useAuthContext } from '../store/AuthContext';
import { sortName } from '../feature/sortName';
import VideoConnect from './VideoConnect';
import { Button } from '@mui/material';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';

const Chat: React.FC = () => {
    let partnerName = "花山薫"
    const {user} = useAuthContext(); 
    const [roomName,setRoomName] = useState<string|null>(null);
    const startTel = () => {
  
            // userとmyNameの並びを一意にすることでchatRoomの名前を特定
            const sortNameArray = sortName(partnerName,"aaa");
            const chatRoomName = sortNameArray[0] + "_" + sortNameArray[1];
            setRoomName(chatRoomName);
        
    }
    return (
        <div>
            <Button
                onClick={startTel}
            >
                <LocalPhoneIcon/>
            </Button>
            {user && !roomName &&
                <ChatLogView partnerName={partnerName}/>
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