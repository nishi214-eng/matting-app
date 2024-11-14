// ChatList.tsx

import { useEffect, useState } from "react";
import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { db } from "../infra/firebase";
import { useNavigate } from "react-router-dom";

// Material-UIのコンポーネントをインポート
import {
    Avatar,
    Button,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
    CircularProgress,
    Box,
} from "@mui/material";

// チャットインターフェースに必要なプロパティを定義
interface Chat {
    id: string;
    userName: string;
    lastMessage: string;
    timestamp: number;
    userImage: string;
    age: number;
    origin: string;
}

function ChatList() {
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "chats"));
                const chatData = querySnapshot.docs.map(
                    (doc: QueryDocumentSnapshot<DocumentData>): Chat => ({
                        id: doc.id,
                        userName: doc.data().userName,
                        lastMessage: doc.data().lastMessage,
                        timestamp: doc.data().timestamp,
                        userImage: doc.data().userImage,
                        age: doc.data().age,
                        origin: doc.data().origin,
                    })
                );

                setChats(chatData);
            } catch (err) {
                console.error("Error fetching chats:", err);
                setError("チャットの取得に失敗しました。");
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Box p={2}>
            <Typography variant="h5" gutterBottom>トーク</Typography>
            <List>
                {chats.map((chat) => (
                    <ListItem key={chat.id} alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar alt={chat.userName} src={chat.userImage} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={`${chat.userName} ${chat.age}歳 ${chat.origin}`}
                            secondary={
                                <>
                                    <Typography component="span" variant="body2" color="textPrimary">
                                        {chat.lastMessage}
                                    </Typography>
                                    <br />
                                    <Typography variant="caption" color="textSecondary">
                                        {new Date(chat.timestamp * 1000).toLocaleString()}
                                    </Typography>
                                </>
                            }
                        />
                    </ListItem>
                ))}
            </List>
            <Box mt={2} display="flex" justifyContent="center">
                <Button variant="contained" color="primary" onClick={() => navigate("/home")}>
                    ホーム
                </Button>
                <Button variant="contained" color="primary" onClick={() => navigate("/ProfileDisplay")}>
                    プロフィール画面
                </Button>
            </Box>
        </Box>
    );
}

export default ChatList;
