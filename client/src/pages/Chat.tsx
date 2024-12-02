import React, { useState } from 'react';
import ChatLogView from '../components/chatLog';
import { useAuthContext } from '../store/AuthContext';
import { useLocation } from 'react-router-dom';

const Chat: React.FC = () => {
    const {user} = useAuthContext(); 

    const location = useLocation();
    const { partnerName } = location.state || { partnerName: '名称未設定' };

    return (
        <div>
            {user && user.displayName &&
                <ChatLogView partnerName={partnerName}/>
            }
            {!user &&
                <h1>
                    ・・・
                </h1>
            }
        </div>
    );
};

export default Chat;