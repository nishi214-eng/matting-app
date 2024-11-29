import { useEffect, useState } from "react";
import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { db } from "../infra/firebase";
import { useNavigate } from "react-router-dom";
import NaviButtons from '../components/NavigationButtons';
import {
    Avatar,
    List,
    ListItem,
    Typography,
    CircularProgress,
    Box,
} from "@mui/material";

interface Chat {
    id: string;
    name: string;
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
                const querySnapshot1 = await getDocs(collection(db, "chatroom"));
                const chatData = await Promise.all(
                    querySnapshot1.docs.map(async (doc: QueryDocumentSnapshot<DocumentData>) => {
                        const chatRef = collection(db, `chatroom/${doc.id}/userIdList`);
                        const userDocs = await getDocs(chatRef);

                        return userDocs.docs.map((userDoc) => {
                            const data = userDoc.data();
                            return {
                                id: userDoc.id, // userIdを保存
                                name: data.name || "名前未設定", // デフォルト値
                                lastMessage: data.message || "メッセージなし",
                                timestamp: data.timestamp?.seconds || 0, // Firestore Timestamp を変換
                                userImage: data.userImage || "",
                                age: data.age || 0, // デフォルト値
                                origin: data.origin || "出身地不明",
                            };
                        });
                    })
                );

                setChats(chatData.flat());
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
        <Box
            sx={{
                maxWidth: "600px",
                margin: "0 auto",
                padding: "16px",
                backgroundColor: "#f7f7f7",
                borderRadius: "16px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
        >
            <Typography
                variant="h5"
                gutterBottom
                sx={{
                    textAlign: "center",
                    marginBottom: "16px",
                    fontWeight: "bold",
                    color: "#333",
                }}
            >
                トーク一覧
            </Typography>
            <List>
                {chats.map((chat) => (
                    <ListItem
                        key={chat.id}
                        alignItems="flex-start"
                        onClick={() => navigate(`/chat`)} // 個別チャットページへの遷移navigate(`/chat/${chat.id}`)} 
                        sx={{
                            borderRadius: "8px",
                            "&:hover": {
                                backgroundColor: "#f9f9f9",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            },
                        }}
                    >
                        <Avatar alt={chat.name} src={chat.userImage} />
                        <Box sx={{ marginLeft: 2 }}>
                            <Typography variant="body1">
                                {chat.name}（{chat.age}歳） - {chat.origin}
                            </Typography>
                            <Typography variant="caption">
                                {new Date(chat.timestamp * 1000).toLocaleString()}
                            </Typography>
                            <Typography>
                                {chat.lastMessage}
                            </Typography>
                        </Box>
                    </ListItem>
                ))}
            </List>
            <NaviButtons/>
        </Box>
    );
}

export default ChatList;
