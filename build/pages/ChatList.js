"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("../infra/firebase");
const react_router_dom_1 = require("react-router-dom");
const NavigationButtons_1 = __importDefault(require("../components/NavigationButtons"));
const AuthContext_1 = require("../store/AuthContext");
const material_1 = require("@mui/material");
const getMatchingList_1 = require("../feature/getMatchingList");
function ChatList() {
    const [chats, setChats] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { user } = (0, AuthContext_1.useAuthContext)(); // useAuthContextからユーザー情報を取得
    (0, react_1.useEffect)(() => {
        const fetchChats = () => __awaiter(this, void 0, void 0, function* () {
            try {
                if (user === null || user === void 0 ? void 0 : user.displayName) {
                    const matchingUser = yield (0, getMatchingList_1.getMatchingList)(user === null || user === void 0 ? void 0 : user.displayName);
                    const fetchedUserData = yield Promise.all(matchingUser.map((userName) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            const userRef = (0, firestore_1.doc)(firebase_1.db, 'profiles', userName, `profile`, `data`); // userNameをIDとして検索
                            const userDoc = yield (0, firestore_1.getDoc)(userRef);
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
                            }
                            else {
                                return null;
                            }
                        }
                        catch (err) {
                            console.error('Error fetching user data:', err);
                            return null;
                        }
                    })));
                    // nullを除外してvalidChatsとして扱う
                    const validChats = fetchedUserData.filter((chat) => chat !== null);
                    setChats(validChats);
                }
                { /*
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
                */
                }
                { /*
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
                */
                }
            }
            catch (err) {
                console.error("Error fetching chats:", err);
                setError("チャットの取得に失敗しました。");
            }
            finally {
                setLoading(false);
            }
        });
        fetchChats();
    }, []);
    if (loading) {
        return ((0, jsx_runtime_1.jsx)(material_1.Box, { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", children: (0, jsx_runtime_1.jsx)(material_1.CircularProgress, {}) }));
    }
    if (error) {
        return (0, jsx_runtime_1.jsx)(material_1.Typography, { color: "error", children: error });
    }
    return ((0, jsx_runtime_1.jsxs)(material_1.Box, { sx: {
            maxWidth: "600px",
            margin: "0 auto",
            padding: "16px",
            backgroundColor: "#f7f7f7",
            borderRadius: "16px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h5", gutterBottom: true, sx: {
                    textAlign: "center",
                    marginBottom: "16px",
                    fontWeight: "bold",
                    color: "#333",
                }, children: "\u3084\u308A\u53D6\u308A\u4E00\u89A7" }), (0, jsx_runtime_1.jsx)(material_1.List, { children: chats.map((chat) => ((0, jsx_runtime_1.jsxs)(material_1.ListItem, { alignItems: "flex-start", onClick: () => navigate(`/chat`, { state: { partnerName: chat.name } }), sx: {
                        borderRadius: "8px",
                        "&:hover": {
                            backgroundColor: "#f9f9f9",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        },
                    }, children: [(0, jsx_runtime_1.jsx)(material_1.Avatar, { alt: chat.name, src: chat.userImage }), (0, jsx_runtime_1.jsx)(material_1.Box, { sx: { marginLeft: 2 }, children: (0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "body1", children: [chat.name, "\uFF08", chat.age, "\u6B73\uFF09 - ", chat.origin] }) })] }, chat.id))) }), (0, jsx_runtime_1.jsx)(NavigationButtons_1.default, {})] }));
}
exports.default = ChatList;
