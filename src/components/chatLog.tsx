import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../infra/firebase';
import {
  collection,
  onSnapshot,
  addDoc,
  QuerySnapshot,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { useAuthContext } from '../store/AuthContext';

type ChatLog = {
  key: string;
  name: string;
  msg: string;
  date: Date;
};

// Dateオブジェクトを日本の時刻形式[hh:mm]に変換する関数
const formatHHMM = (time: Date) => {
  return new Date(time).toTimeString().slice(0, 5);
};

interface ChatLogViewProps {
    partnerName:string;
}

const ChatLogView: React.FC<ChatLogViewProps> = ({ partnerName }) => {
    const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);
    const [inputMsg, setInputMsg] = useState('');
    
    // 利用中のユーザーののユーザーネームを取得
    const {user} = useAuthContext(); 
    const userName = user?.displayName;
    
    // userとmyNameの並びを一意にする関数
    const chatRoomName = partnerName + "_" + userName
    
    // チャットルーム名
    let chatRef = collection(db, 'chatroom',chatRoomName, 'messages');

    //チャットログに追加
    const addLog = (id: string, data: any) => {
        const log = {
        key: id,
        ...data,
        };
        // Firestoreから取得したデータは時間降順のため、表示前に昇順に並び替える
        setChatLogs((prev) =>
        [...prev, log].sort((a, b) => a.date.valueOf() - b.date.valueOf())
        );
    };

    
    // メッセージ送信
    
    const submitMsg = async (argMsg?: string) => {
        const message = argMsg || inputMsg;
        if (!message) {
        return;
        }

        await addDoc(chatRef, {
        name: userName,
        msg: message,
        date: new Date().getTime(),
        });

        setInputMsg('');
    };

    useEffect(() => {
        // 最新10件取得。本番では50件まで増やす
        const q = query(chatRef, orderBy('date', 'desc'), limit(10));
        // データ同期(講読解除(cleanup)のためreturn)
        return onSnapshot(q, (snapshot: QuerySnapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
            // チャットログへ追加
            addLog(change.doc.id, change.doc.data());

            // 画面最下部へスクロール
            const doc = document.documentElement;
            window.setTimeout(
                () => window.scroll(0, doc.scrollHeight - doc.clientHeight),
                100
            );
            }
        });
        });

    }, []);

    return (
        <>
        {/* チャットログ */}
        <div>
            {chatLogs.map((item) => (
            <div
                className={`balloon_${userName === item.name ? 'r' : 'l'}`}
                key={item.key}
            >
                {userName === item.name ? `[${formatHHMM(item.date)}]` : ''}
                <div className="faceicon">
                
                </div>
                <div style={{ marginLeft: '3px' }}>
                {item.name}
                <p className="says">{item.msg}</p>
                </div>
                {userName === item.name ? '' : `[${formatHHMM(item.date)}]`}
            </div>
            ))}
        </div>
        
        {/* メッセージ入力 コンポーネント化する*/}
        <form
            className="chatform"
            onSubmit={async (e) => {
            e.preventDefault();
            await submitMsg();
            }}
        >
            <div>{userName}</div>
            <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            />
            <input
            type="image"
            onClick={() => submitMsg}
            src="../img/airplane.png"
            alt="Send Button"
            />
        </form>
        </>
    );
};

export default ChatLogView;