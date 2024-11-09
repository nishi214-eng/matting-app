// ChatList.tsx

import { useEffect, useState } from "react";
import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { db } from "../infra/firebase";

// チャットインターフェースに必要なプロパティを定義
interface Chat {
    id: string; // ID
    userName: string; // ユーザー名
    lastMessage: string; // 最新メッセージ
    timestamp: number; // タイムスタンプ
    userImage: string; // ユーザー画像
    age: number;       // 年齢
    origin: string;    // 出身地
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
                        id: doc.id, // IDを取得
                        userName: doc.data().userName, // ユーザー名を取得
                        lastMessage: doc.data().lastMessage, // 最新メッセージを取得
                        timestamp: doc.data().timestamp, // タイムスタンプを取得
                        userImage: doc.data().userImage, // ユーザー画像を取得
                        age: doc.data().age, // 年齢を取得
                        origin: doc.data().origin, // 出身地を取得
                    })
                );

                console.log("Fetched chats:", chatData); // 取得したデータをコンソールに表示
                setChats(chatData);
            } catch (err) {
                console.error("Error fetching chats:", err); // エラー発生時にコンソールに表示
                setError("チャットの取得に失敗しました。");
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, []);

    if (loading) {
        return <div>読み込み中...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>トーク</h2>
            <ul className="chat-list">
                {chats.map((chat) => (
                    <li key={chat.id} className="chat-item">
                        <img src={chat.userImage} alt={chat.userName} className="user-image" />
                        <div className="chat-details">
                            <h3>{chat.userName} {chat.age}歳 {chat.origin}</h3>
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