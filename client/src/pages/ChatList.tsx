import { useEffect, useState } from "react";
import { collection, getDocs, QueryDocumentSnapshot, DocumentData,doc,setDoc,getDoc } from "firebase/firestore";
import { db } from "../infra/firebase";
import { useNavigate } from "react-router-dom";
import NaviButtons from '../components/NavigationButtons';
import { useAuthContext } from '../store/AuthContext';
import {
    Avatar,
    List,
    ListItem,
    Typography,
    CircularProgress,
    Box,
} from "@mui/material";
import { getMatchingList } from "../feature/getMatchingList";
// import { sortName } from "../feature/sortName";

interface Chat {
    id: string;
    name: string;
    //lastMessage: string;
    //timestamp: number;
    userImage: string;
    age: number;
    origin: string;
}

function ChatList() {
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { user } = useAuthContext(); // useAuthContextからユーザー情報を取得

    useEffect(() => {
        const fetchChats = async () => {
            try {

                if(user?.displayName){
                    const matchingUser = await getMatchingList(user?.displayName);

                    const fetchedUserData: (Chat | null)[] = await Promise.all(
                        matchingUser.map(async (userName: string) => {
                            try {
                                const userRef = doc(db, 'profiles', userName,`profile`,`data`); // userNameをIDとして検索
                                const userDoc = await getDoc(userRef);

                                if (userDoc.exists()) {
                                    // ドキュメントが存在する場合、そのデータを取得
                                    const userData = userDoc.data();
                                    return {
                                        id: userName,
                                        name: userData.nickName || 'Unknown',
                                        userImage: userData.userImage || '',
                                        age: userData.age || 0,
                                        origin: userData.origin || '',
                                    };
                                } else {
                                    return null;
                                }
                            } catch (err) {
                                console.error('Error fetching user data:', err);
                                return null;
                            }
                        })
                    );

                    // nullを除外してvalidChatsとして扱う
                    const validChats: Chat[] = fetchedUserData.filter((chat) => chat !== null) as Chat[];
                    setChats(validChats);
                }
                {/*
                let roomName:string[] = [];
                // matchingUser配列1つ1つを取り出して処理
                const chatRef = collection(db, "profiles");
                matchingUser.forEach((userName: string) => {
                    
                });
                
                const chatRoomsQuery = collection(db, "chatroom");

                // `roomName` 配列内の名前に一致するドキュメントをフィルタリングし、存在しない場合は作成
                const filteredChatRooms = await Promise.all(
                    roomName.map(async (chatRoomName) => {
                        // chatRoomNameをIDとして指定してドキュメントを取得
                        const docRef = doc(chatRoomsQuery, chatRoomName);
                        const docSnapshot = await getDoc(docRef);
                        
                        if (docSnapshot.exists()) {
                            // すでに存在するドキュメントを返す
                            return docSnapshot;
                        } else {
                            // 存在しない場合は新しい空のドキュメントを作成
                            await setDoc(docRef, {});
                        }
                    })
                );
                */}

                {/*
                // roomDocsの
                const chatData = await Promise.all(
                    filteredChatRooms.map(async (doc: any) => {
                        const chatRoomData = doc.data || doc;  // 既存のドキュメントか新しく作成したものかを確認
                        const chatRef = collection(db, "profiles");
                        const userDocs = await getDocs(chatRef);

                        return userDocs.docs.map((userDoc) => {
                            const userData = userDoc.data();
                            return {
                                id: userDoc.id, // userIdを保存
                                name: userData.name || "名前未設定", // デフォルト値
                                lastMessage: userData.message || "メッセージなし",
                                timestamp: userData.timestamp?.seconds || 0, // Firestore Timestamp を変換
                                userImage: userData.userImage || "",
                                age: userData.age || 0, // デフォルト値
                                origin: userData.origin || "出身地不明",
                            };
                        });
                    })
                );
                */}

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
                        onClick={() => navigate(`/chat`, { state: { partnerName: chat.name} })} // 個別チャットページへの遷移navigate(`/chat/${chat.id}`)} 
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
                            {/*
                            <Typography variant="caption">
                                {new Date(chat.timestamp * 1000).toLocaleString()}
                            </Typography>
                            <Typography>
                                {chat.lastMessage}
                            </Typography>
                            */}
                        </Box>
                    </ListItem>
                ))}
            </List>
            <NaviButtons/>
        </Box>
    );
}

export default ChatList;
