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
const firebase_1 = require("../infra/firebase");
const firestore_1 = require("firebase/firestore");
const AuthContext_1 = require("../store/AuthContext");
const sortName_1 = require("../feature/sortName");
const NavigationButtons_1 = __importDefault(require("./NavigationButtons"));
const react_router_dom_1 = require("react-router-dom");
const material_1 = require("@mui/material");
const icons_material_1 = require("@mui/icons-material");
const LocalPhone_1 = __importDefault(require("@mui/icons-material/LocalPhone"));
const VideoConnect_1 = __importDefault(require("../pages/VideoConnect"));
// Dateオブジェクトを日本の時刻形式[hh:mm]に変換する関数
const formatHHMM = (time) => {
    return new Date(time).toTimeString().slice(0, 5);
};
const ChatLogView = ({ partnerName }) => {
    const [chatLogs, setChatLogs] = (0, react_1.useState)([]);
    const [inputMsg, setInputMsg] = (0, react_1.useState)('');
    const { user } = (0, AuthContext_1.useAuthContext)();
    const userName = user === null || user === void 0 ? void 0 : user.displayName;
    const sortNameArray = (0, sortName_1.sortName)(partnerName, userName);
    const chatRoomName = sortNameArray[0] + '_' + sortNameArray[1];
    let chatRef = (0, firestore_1.collection)(firebase_1.db, 'chatroom', chatRoomName, 'messages');
    const addLog = (id, data) => {
        const log = Object.assign({ key: id }, data);
        setChatLogs((prev) => [...prev, log].sort((a, b) => a.date.valueOf() - b.date.valueOf()));
    };
    const submitMsg = (argMsg) => __awaiter(void 0, void 0, void 0, function* () {
        const message = argMsg || inputMsg;
        if (!message)
            return;
        if (user) {
            yield (0, firestore_1.addDoc)(chatRef, {
                name: userName,
                msg: message,
                date: new Date().getTime(),
            });
            const countRef = (0, firestore_1.doc)(firebase_1.db, 'chatroom', chatRoomName, 'chatcount', userName === sortNameArray[0] ? 'count1' : 'count2');
            yield (0, firestore_1.setDoc)(countRef, { count: (0, firestore_1.increment)(1) }, { merge: true });
        }
        setInputMsg('');
    });
    (0, react_1.useEffect)(() => {
        if (user) {
            const q = (0, firestore_1.query)(chatRef, (0, firestore_1.orderBy)('date', 'desc'), (0, firestore_1.limit)(10));
            return (0, firestore_1.onSnapshot)(q, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        addLog(change.doc.id, change.doc.data());
                        const doc = document.documentElement;
                        window.setTimeout(() => window.scroll(0, doc.scrollHeight - doc.clientHeight), 100);
                    }
                });
            });
        }
    }, []);
    const navigate = (0, react_router_dom_1.useNavigate)(); // useNavigate を呼び出し
    const handleNavigate = () => {
        navigate(`/DisplayOther`, { state: { partnerName: partnerName } });
    };
    const [roomName, setRoomName] = (0, react_1.useState)(null);
    const startTel = () => {
        // userとmyNameの並びを一意にすることでchatRoomの名前を特定
        if (user === null || user === void 0 ? void 0 : user.displayName) {
            const sortNameArray = (0, sortName_1.sortName)(partnerName, user === null || user === void 0 ? void 0 : user.displayName);
            const chatRoomName = sortNameArray[0] + "_" + sortNameArray[1];
            setRoomName(chatRoomName);
        }
    };
    return ((0, jsx_runtime_1.jsxs)(material_1.Paper, { id: "wrapper_chatLog", sx: {
            maxWidth: '600px',
            margin: '0 auto',
            padding: '16px',
            backgroundColor: '#f7f7f7',
            borderRadius: '16px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }, children: [user && !roomName && user.displayName && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(material_1.Box, { sx: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%', // Ensure the container takes up full width
                            marginBottom: 2, // Optional, to provide some space between the buttons and other elements
                        }, children: [(0, jsx_runtime_1.jsx)(material_1.Button, { variant: "text", onClick: handleNavigate, sx: {
                                    fontWeight: 'bold',
                                    color: '#333',
                                    padding: 0,
                                    textTransform: 'none',
                                    '&:hover': {
                                        backgroundColor: 'transparent',
                                    },
                                }, children: partnerName }), (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: startTel, children: (0, jsx_runtime_1.jsx)(LocalPhone_1.default, {}) })] }), (0, jsx_runtime_1.jsx)(material_1.Paper, { id: "outer_chatLogView", sx: {
                            width: '90%',
                            padding: '5%',
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                            boxShadow: 1,
                            marginBottom: '20px',
                            overflowY: 'auto',
                            minHeight: '60vh',
                            maxHeight: '60vh',
                        }, children: chatLogs.map((item) => ((0, jsx_runtime_1.jsx)(material_1.Box, { sx: {
                                display: 'flex',
                                flexDirection: userName === item.name ? 'row-reverse' : 'row',
                                alignItems: 'flex-start',
                                marginBottom: '10px',
                            }, children: (0, jsx_runtime_1.jsxs)(material_1.Paper, { className: userName === item.name ? 'balloon_l' : 'balloon_r', sx: {
                                    padding: '10px',
                                    maxWidth: '80%',
                                    borderRadius: '16px',
                                    backgroundColor: userName === item.name ? '#e1f5fe' : '#e8f5e9',
                                }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body1", sx: { fontWeight: 'bold' }, children: item.name }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body2", sx: { wordWrap: 'break-word' }, children: item.msg }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "caption", sx: { color: 'gray', display: 'block', textAlign: 'right' }, children: formatHHMM(item.date) })] }) }, item.key))) }), (0, jsx_runtime_1.jsx)("form", { className: "inputform", onSubmit: (e) => __awaiter(void 0, void 0, void 0, function* () {
                            e.preventDefault();
                            yield submitMsg();
                        }), style: { width: '100%', maxWidth: '600px' }, children: (0, jsx_runtime_1.jsx)(material_1.TextField, { id: "text", type: "text", value: inputMsg, onChange: (e) => setInputMsg(e.target.value), placeholder: "\u30E1\u30C3\u30BB\u30FC\u30B8\u3092\u5165\u529B...", fullWidth: true, variant: "outlined", InputProps: {
                                endAdornment: ((0, jsx_runtime_1.jsx)(material_1.InputAdornment, { position: "end", children: (0, jsx_runtime_1.jsx)(material_1.IconButton, { "aria-label": "send-message", onClick: () => submitMsg(), children: (0, jsx_runtime_1.jsx)(icons_material_1.Send, {}) }) })),
                            }, sx: {
                                backgroundColor: 'white',
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '16px',
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#96C78C',
                                },
                            } }) }), (0, jsx_runtime_1.jsx)(NavigationButtons_1.default, {})] })), roomName && (0, jsx_runtime_1.jsx)(VideoConnect_1.default, { room: roomName })] }));
};
exports.default = ChatLogView;
