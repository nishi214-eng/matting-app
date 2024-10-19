import React from 'react';
import ChatLogView from '../components/chatLog';


const Chat: React.FC = () => {
    let partnerName = "佐藤次郎"
    return (
        <div>
            <ChatLogView partnerName={partnerName}/>
        </div>
    );
};

export default Chat;