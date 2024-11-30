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
const material_1 = require("@mui/material");
const firebase_1 = require("../infra/firebase");
const firestore_1 = require("firebase/firestore");
const AuthContext_1 = require("../store/AuthContext");
const NavigationButtons_1 = __importDefault(require("../components/NavigationButtons"));
const useSnackber_1 = require("../store/useSnackber");
const react_2 = require("react");
const ThumbUpAlt_1 = __importDefault(require("@mui/icons-material/ThumbUpAlt"));
const Reply_1 = __importDefault(require("@mui/icons-material/Reply"));
const MatchingPage = () => {
    const { user } = (0, AuthContext_1.useAuthContext)();
    const [candidates, setCandidates] = (0, react_1.useState)([]);
    const [currentIndex, setCurrentIndex] = (0, react_1.useState)(0);
    const [matchedCandidate, setMatchedCandidate] = (0, react_1.useState)(null);
    const [userProfile, setUserProfile] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [skippedCandidates, setSkippedCandidates] = (0, react_1.useState)([]);
    const [waitingCandidates, setWaitingCandidates] = (0, react_1.useState)([]);
    const [openSkipListDialog, setOpenSkipListDialog] = (0, react_1.useState)(false);
    const [openMatchingListDialog, setOpenMatchingListDialog] = (0, react_1.useState)(false);
    const userNickName = user === null || user === void 0 ? void 0 : user.displayName;
    const [userGender, setUserGender] = (0, react_1.useState)("");
    const { showAlert } = (0, react_2.useContext)(useSnackber_1.AlertContext);
    // ユーザーと候補者のデータを取得
    (0, react_1.useEffect)(() => {
        const fetchUserProfile = () => __awaiter(void 0, void 0, void 0, function* () {
            if (!user)
                return;
            try {
                const profileDocRef = (0, firestore_1.doc)(firebase_1.db, "profiles", userNickName, "profile", "data"); // userNickNameを使ってユーザーのプロフィールを取得
                const profileDoc = yield (0, firestore_1.getDoc)(profileDocRef);
                if (profileDoc.exists()) {
                    const profileData = profileDoc.data();
                    setUserProfile({
                        id: userNickName,
                        nickName: profileData.nickName,
                        gender: profileData.gender || "",
                        userImage: profileData.userImage || "",
                        age: profileData.age || "",
                        origin: profileData.origin || "",
                    });
                    setUserGender(profileData.gender || "");
                }
                else {
                    console.error("User profile not found");
                }
            }
            catch (error) {
                console.error("Error fetching user profile: ", error);
            }
        });
        const fetchCandidates = () => __awaiter(void 0, void 0, void 0, function* () {
            if (!user)
                return;
            try {
                const querySnapshot = yield (0, firestore_1.getDocs)((0, firestore_1.collection)(firebase_1.db, "profiles"));
                const fetchedCandidates = [];
                const skippedList = [];
                const waitingList = [];
                const matchedListSnapshot = yield (0, firestore_1.getDocs)((0, firestore_1.collection)(firebase_1.db, "profiles", userNickName, "mattingList"));
                const matchedCandidates = matchedListSnapshot.docs.map(doc => doc.id);
                for (const docSnapshot of querySnapshot.docs) {
                    const candidateId = docSnapshot.id;
                    if (candidateId !== userNickName && !matchedCandidates.includes(candidateId)) {
                        const profileDocRef = (0, firestore_1.doc)(firebase_1.db, "profiles", candidateId, "profile", "data");
                        const profileDoc = yield (0, firestore_1.getDoc)(profileDocRef);
                        if (profileDoc.exists()) {
                            const profileData = profileDoc.data();
                            const candidate = {
                                id: candidateId,
                                nickName: profileData.nickName,
                                gender: profileData.gender || "",
                                userImage: profileData.userImage || "",
                                age: profileData.age || "",
                                origin: profileData.origin || "",
                            };
                            const skipListSnapshot = yield (0, firestore_1.getDocs)((0, firestore_1.collection)(firebase_1.db, "profiles", userNickName, "skipList"));
                            const isSkipped = skipListSnapshot.docs.some(doc => doc.id === candidateId);
                            if (isSkipped) {
                                skippedList.push(candidate);
                            }
                            else {
                                if ((userGender === "男" && candidate.gender === "女") || (userGender === "女" && candidate.gender === "男")) {
                                    waitingList.push(candidate);
                                }
                            }
                            fetchedCandidates.push(candidate);
                        }
                    }
                }
                setCandidates(waitingList);
                setSkippedCandidates(skippedList);
                setWaitingCandidates(waitingList);
                setLoading(false);
            }
            catch (error) {
                console.error("Error fetching candidates: ", error);
            }
        });
        fetchUserProfile();
        fetchCandidates();
    }, [user, userGender]);
    const fetchNextCandidate = () => __awaiter(void 0, void 0, void 0, function* () {
        if (currentIndex + 1 < candidates.length) {
            setCurrentIndex(prevIndex => prevIndex + 1);
        }
        else {
            showAlert(`候補者がいません！`, "error");
        }
    });
    const handleMatch = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!user || !userProfile || !candidates[currentIndex])
            return;
        const matched = candidates[currentIndex];
        try {
            yield (0, firestore_1.addDoc)((0, firestore_1.collection)(firebase_1.db, "profiles", matched.id, "mattingList"), {
                id: userNickName,
                nickName: userProfile.nickName, // Only store nickName
            });
            yield (0, firestore_1.addDoc)((0, firestore_1.collection)(firebase_1.db, "profiles", userNickName, "mattingList"), {
                id: matched.id,
                nickName: matched.nickName,
            });
            showAlert(`${matched.nickName}にいいねしました！`, "success");
            setMatchedCandidate(matched);
            setCandidates(prevCandidates => prevCandidates.filter(candidate => candidate.id !== matched.id));
            fetchNextCandidate();
        }
        catch (error) {
            console.error("Error adding to matching list: ", error);
            showAlert(`マッチングリストへの追加中にエラーが発生しました。再試行してください。`, "error");
        }
    });
    const handleSkip = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!user || !candidates[currentIndex])
            return;
        const skipped = candidates[currentIndex];
        try {
            yield (0, firestore_1.addDoc)((0, firestore_1.collection)(firebase_1.db, "profiles", userNickName, "skipList"), {
                id: skipped.id,
                nickName: skipped.nickName,
            });
            fetchNextCandidate();
        }
        catch (error) {
            showAlert(`候補者をスキップできませんでした。再試行してください。`, "error");
        }
    });
    const handleOpenSkipListDialog = () => setOpenSkipListDialog(true);
    const handleCloseSkipListDialog = () => setOpenSkipListDialog(false);
    const handleOpenMatchingListDialog = () => setOpenMatchingListDialog(true);
    const handleCloseMatchingListDialog = () => setOpenMatchingListDialog(false);
    return ((0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { maxWidth: "800px", margin: "0 auto", padding: "16px", textAlign: "center" }, children: [loading ? ((0, jsx_runtime_1.jsx)(material_1.Box, { sx: { display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }, children: (0, jsx_runtime_1.jsx)(material_1.CircularProgress, {}) })) : candidates.length > 0 && candidates[currentIndex] ? ((0, jsx_runtime_1.jsxs)(material_1.Card, { sx: { boxShadow: 3, marginBottom: 2 }, children: [(0, jsx_runtime_1.jsx)(material_1.CardMedia, { component: "img", height: "300", image: candidates[currentIndex].userImage || "/images/noimage.png", alt: candidates[currentIndex].nickName }), (0, jsx_runtime_1.jsxs)(material_1.CardContent, { children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h5", children: candidates[currentIndex].nickName }), (0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "body2", children: [candidates[currentIndex].age, "\u6B73"] }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body2", children: candidates[currentIndex].origin }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: "flex", justifyContent: "space-between" }, children: [(0, jsx_runtime_1.jsx)(material_1.IconButton, { size: "large", sx: {
                                            color: '#FF6F6F', // サムズアップアイコンの色を淡い赤に変更
                                            '&:hover': {
                                                color: '#FF3D3D', // ホバー時の色をもう少し濃い赤に変更
                                            },
                                        }, onClick: handleMatch, children: (0, jsx_runtime_1.jsx)(ThumbUpAlt_1.default, { fontSize: "inherit" }) }), (0, jsx_runtime_1.jsx)(material_1.IconButton, { size: "large", sx: {
                                            color: '#6EC1E4', // スキップアイコンの色を淡い青に変更
                                            '&:hover': {
                                                color: '#4DA9D7', // ホバー時の色を少し濃い青に変更
                                            },
                                        }, onClick: handleSkip, children: (0, jsx_runtime_1.jsx)(Reply_1.default, { fontSize: "inherit" }) })] })] })] })) : ((0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", children: "\u5019\u88DC\u8005\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3067\u3057\u305F\u3002" })), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { width: "100%", marginBottom: "16px", display: 'flex', flexDirection: 'column', gap: '6px' }, children: [(0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", type: "submit", sx: {
                            width: "100%",
                            borderRadius: "1%",
                            backgroundColor: "#96C78C",
                            boxShadow: "none",
                            '&:hover': {
                                backgroundColor: "98C78C",
                            },
                        }, onClick: handleOpenSkipListDialog, children: "\u30B9\u30AD\u30C3\u30D7\u30EA\u30B9\u30C8" }), (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", type: "submit", sx: {
                            width: "100%",
                            borderRadius: "1%",
                            backgroundColor: "#96C78C",
                            boxShadow: "none",
                            '&:hover': {
                                backgroundColor: "98C78C",
                            },
                        }, onClick: handleOpenMatchingListDialog, children: "\u30DE\u30C3\u30C1\u30F3\u30B0\u5F85\u3061\u30EA\u30B9\u30C8" })] }), (0, jsx_runtime_1.jsxs)(material_1.Dialog, { open: openSkipListDialog, onClose: handleCloseSkipListDialog, maxWidth: "sm", fullWidth: true, children: [(0, jsx_runtime_1.jsx)(material_1.DialogTitle, { children: "\u30B9\u30AD\u30C3\u30D7\u30EA\u30B9\u30C8" }), (0, jsx_runtime_1.jsx)(material_1.DialogContent, { children: skippedCandidates.length > 0 ? (skippedCandidates.map((candidate) => ((0, jsx_runtime_1.jsx)(material_1.Box, { sx: { display: "flex", alignItems: "center", marginBottom: 1 }, children: (0, jsx_runtime_1.jsxs)(material_1.Card, { sx: { display: "flex", width: "100%" }, children: [(0, jsx_runtime_1.jsx)(material_1.CardMedia, { component: "img", image: candidate.userImage || "/images/default-profile.png", alt: candidate.nickName, sx: { width: 80, height: 80 } }), (0, jsx_runtime_1.jsx)(material_1.CardContent, { children: (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body1", children: candidate.nickName }) })] }) }, candidate.id)))) : ((0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body2", children: "\u30B9\u30AD\u30C3\u30D7\u3057\u305F\u5019\u88DC\u8005\u306F\u3042\u308A\u307E\u305B\u3093\u3002" })) }), (0, jsx_runtime_1.jsx)(material_1.DialogActions, { children: (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleCloseSkipListDialog, color: "primary", children: "\u9589\u3058\u308B" }) })] }), (0, jsx_runtime_1.jsxs)(material_1.Dialog, { open: openMatchingListDialog, onClose: handleCloseMatchingListDialog, maxWidth: "sm", fullWidth: true, children: [(0, jsx_runtime_1.jsx)(material_1.DialogTitle, { children: "\u30DE\u30C3\u30C1\u30F3\u30B0\u5F85\u3061\u30EA\u30B9\u30C8" }), (0, jsx_runtime_1.jsx)(material_1.DialogContent, { children: waitingCandidates.length > 0 ? (waitingCandidates.map((candidate) => ((0, jsx_runtime_1.jsx)(material_1.Box, { sx: { display: "flex", alignItems: "center", marginBottom: 1 }, children: (0, jsx_runtime_1.jsxs)(material_1.Card, { sx: { display: "flex", width: "100%" }, children: [(0, jsx_runtime_1.jsx)(material_1.CardMedia, { component: "img", image: candidate.userImage || "/images/default-profile.png", alt: candidate.nickName, sx: { width: 80, height: 80 } }), (0, jsx_runtime_1.jsx)(material_1.CardContent, { children: (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body1", children: candidate.nickName }) })] }) }, candidate.id)))) : ((0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body2", children: "\u30DE\u30C3\u30C1\u30F3\u30B0\u5F85\u3061\u5019\u88DC\u8005\u306F\u3042\u308A\u307E\u305B\u3093\u3002" })) }), (0, jsx_runtime_1.jsx)(material_1.DialogActions, { children: (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleCloseMatchingListDialog, color: "primary", children: "\u9589\u3058\u308B" }) })] }), (0, jsx_runtime_1.jsx)(NavigationButtons_1.default, {})] }));
};
exports.default = MatchingPage;
