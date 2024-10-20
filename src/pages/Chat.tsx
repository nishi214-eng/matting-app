import React from 'react';
import ChatLogView from '../components/chatLog';
import { useAuthContext } from '../store/AuthContext';

const Chat: React.FC = () => {
    let partnerName = "佐藤次郎"
    const {user} = useAuthContext(); 
    return (
        <div>
            {user &&
                <ChatLogView partnerName={partnerName}/>
            }
            {!user &&
                <h1>
                    エラー：ログインされていません
                </h1>
            }
        </div>
    );
};

export default Chat;