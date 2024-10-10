// ChatList.tsx

import { useEffect, useState } from "react";
import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { db } from "../infra/firebase";

// Chat�C���^�[�t�F�[�X�ɐV�����v���p�e�B��ǉ�
interface Chat {
    id: string; //ID
    userName: string; //���O
    lastMessage: string; //�ŐV���b�Z
    timestamp: number; //����
    userImage: string; // ���[�U�[�摜
    age: number;       // �N��
    origin: string;    // �o�g�n
}

function ChatList() {
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "chats"));
                const chatData = querySnapshot.docs.map(
                    (doc: QueryDocumentSnapshot<DocumentData>): Chat => ({
                        id: doc.id,//ID���擾
                        userName: doc.data().userName,//���O���擾
                        lastMessage: doc.data().lastMessage,//�ŐV���b�Z���擾
                        timestamp: doc.data().timestamp,//���Ԃ��擾
                        userImage: doc.data().userImage, // ���[�U�[�摜���擾
                        age: doc.data().age,               // �N����擾
                        origin: doc.data().origin,         // �o�g�n���擾
                    })
                );

                console.log("Fetched chats:", chatData); // �擾�����f�[�^���R���\�[���ɏo��
                setChats(chatData);
            } catch (err) {
                console.error("Error fetching chats:", err); // �G���[���R���\�[���ɏo��
                setError("Failed to fetch chats.");
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>�g�[�N</h2>
            <ul className="chat-list">
                {chats.map((chat) => (
                    <li key={chat.id} className="chat-item">
                        <img src={chat.userImage} alt={chat.userName} className="user-image" />
                        <div className="chat-details"> 
                            <h3>{chat.userName}  {chat.age}��  {chat.origin}</h3>
                            <p className="last-message">{chat.lastMessage}</p>
                        </div>
                        <small className="timestamp">{new Date(chat.timestamp * 1000).toLocaleString()}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ChatList;
