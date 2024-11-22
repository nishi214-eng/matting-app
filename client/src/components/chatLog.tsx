import React, { useState, useEffect } from 'react';
import { db } from '../infra/firebase';
import {
  collection,
  onSnapshot,
  addDoc,
  QuerySnapshot,
  query,
  orderBy,
  limit,
  doc,
  setDoc,
  increment
} from 'firebase/firestore';
import { useAuthContext } from '../store/AuthContext';
import { sortName } from '../feature/sortName';
import NaviButtons from './NavigationButtons';

import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Send } from '@mui/icons-material';

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
  partnerName: string;
}

const ChatLogView: React.FC<ChatLogViewProps> = ({ partnerName }) => {
  const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);
  const [inputMsg, setInputMsg] = useState('');

  const { user } = useAuthContext();
  const userName = '佐藤次郎';
  const sortNameArray = sortName(partnerName, userName);
  const chatRoomName = sortNameArray[0] + '_' + sortNameArray[1];
  let chatRef = collection(db, 'chatroom', chatRoomName, 'messages');

  const addLog = (id: string, data: any) => {
    const log = {
      key: id,
      ...data,
    };
    setChatLogs((prev) =>
      [...prev, log].sort((a, b) => a.date.valueOf() - b.date.valueOf())
    );
  };

  const submitMsg = async (argMsg?: string) => {
    const message = argMsg || inputMsg;
    if (!message) return;
    if (user) {
      await addDoc(chatRef, {
        name: userName,
        msg: message,
        date: new Date().getTime(),
      });
      const countRef = doc(
        db,
        'chatroom',
        chatRoomName,
        'chatcount',
        userName === sortNameArray[0] ? 'count1' : 'count2'
      );
      await setDoc(countRef, { count: increment(1) }, { merge: true });
    }
    setInputMsg('');
  };

  useEffect(() => {
    if (user) {
      const q = query(chatRef, orderBy('date', 'desc'), limit(10));
      return onSnapshot(q, (snapshot: QuerySnapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            addLog(change.doc.id, change.doc.data());
            const doc = document.documentElement;
            window.setTimeout(
              () => window.scroll(0, doc.scrollHeight - doc.clientHeight),
              100
            );
          }
        });
      });
    }
  }, []);

  return (
    <Box
      id="wrapper_chatLog"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <Paper
        id="outer_chatLogView"
        sx={{
          width: '100%',
          maxWidth: '600px',
          padding: '10px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: 2,
          marginBottom: '20px',
          overflowY: 'auto',
          maxHeight: '60vh',
        }}
      >

        
        {chatLogs.map((item) => (
          <Box
            key={item.key}
            sx={{
              display: 'flex',
              flexDirection: userName === item.name ? 'row-reverse' : 'row',
              alignItems: 'flex-start',
              marginBottom: '10px',
            }}
          >
            <Paper
              sx={{
                padding: '10px',
                maxWidth: '80%',
                borderRadius: '16px',
                backgroundColor: userName === item.name ? '#e1f5fe' : '#e8f5e9',
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {item.name}
              </Typography>
              <Typography variant="body2" sx={{ wordWrap: 'break-word' }}>
                {item.msg}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: 'gray', display: 'block', textAlign: 'right' }}
              >
                {formatHHMM(item.date)}
              </Typography>
            </Paper>
          </Box>
        ))}
      </Paper>

      <form
        className="inputform"
        onSubmit={async (e) => {
          e.preventDefault();
          await submitMsg();
        }}
        style={{ width: '100%', maxWidth: '600px' }}
      >
        <TextField
          id="text"
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder="メッセージを入力..."
          fullWidth
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="send-message"
                  onClick={() => submitMsg()}
                >
                  <Send />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            backgroundColor: 'white',
            '& .MuiOutlinedInput-root': {
              borderRadius: '16px',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#96C78C',
            },
          }}
        />
        <NaviButtons/>
      </form>
      
    </Box>
    
  );
};

export default ChatLogView;
