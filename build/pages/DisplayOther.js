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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const firebase_1 = require("../infra/firebase");
const firestore_1 = require("firebase/firestore");
const material_1 = require("@mui/material");
const icons_material_1 = require("@mui/icons-material");
const AuthContext_1 = require("../store/AuthContext");
const react_router_dom_1 = require("react-router-dom");
const sortName_1 = require("../feature/sortName");
const DisplayOther = () => {
    const { user } = (0, AuthContext_1.useAuthContext)();
    const location = (0, react_router_dom_1.useLocation)();
    const { partnerName } = location.state || { partnerName: '名称未設定' };
    const [matting, setMatti] = (0, react_1.useState)({ name: user === null || user === void 0 ? void 0 : user.displayName, count1: 0, count2: 0 });
    const [profile, setProfile] = (0, react_1.useState)({
        nickName: partnerName, gender: "", age: "", height: "",
        userImage: "", userImage2: "", origin: "", hobby: "",
        drive: "", annualIncome: "", smoking: "", drinking: "",
        marriageWant: "", firstSon: ""
    });
    // 現在表示中の画像インデックス
    const [currentImageIndex, setCurrentImageIndex] = (0, react_1.useState)(0);
    // プロフィール画像のリスト
    const images = [profile.userImage, profile.userImage2].filter((img) => img !== "");
    (0, react_1.useEffect)(() => {
        const fetchProfiles = () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const profileDocRef = (0, firestore_1.doc)(firebase_1.db, "profiles", profile.nickName);
            const dataDocRef = (0, firestore_1.doc)(profileDocRef, "profile", "data");
            const querySnapshot = yield (0, firestore_1.getDoc)(dataDocRef);
            const profilesData = querySnapshot.data();
            setProfile(profilesData);
            const combineName = (0, sortName_1.sortName)(profile.nickName, matting.name);
            const mattingDoc = (0, firestore_1.doc)(firebase_1.db, "chatroom", combineName[0] + "_" + combineName[1]);
            const mattingDocRef2 = (0, firestore_1.doc)(mattingDoc, "chatcount", "count2");
            const mattingquerySnapshot2 = yield (0, firestore_1.getDoc)(mattingDocRef2);
            const getCount2 = (_a = mattingquerySnapshot2.data()) === null || _a === void 0 ? void 0 : _a.count;
            setMatti(Object.assign(Object.assign({}, matting), { count2: getCount2 }));
        });
        fetchProfiles();
    }, []);
    // 画像切り替えのハンドラー
    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };
    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };
    return ((0, jsx_runtime_1.jsxs)(material_1.Box, { sx: {
            maxWidth: "600px",
            margin: "0 auto",
            padding: "16px",
            backgroundColor: "#f7f7f7",
            borderRadius: "16px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
        }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h5", sx: { textAlign: "center", fontWeight: "bold", marginBottom: "16px", color: "#333" }, children: partnerName }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: "24px"
                }, children: [images.length > 0 ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(material_1.ImageList, { cols: 1, sx: { width: "100%", maxWidth: 300 }, children: (0, jsx_runtime_1.jsx)(material_1.ImageListItem, { children: (0, jsx_runtime_1.jsx)("img", { src: images[currentImageIndex] || "/images/noimage.png", alt: `profile-${currentImageIndex}`, style: {
                                            borderRadius: '8px',
                                            objectFit: 'contain', // 画像全体を表示する
                                            width: '100%', // 幅を親要素に合わせる
                                            height: 'auto' // 固定高さ
                                        } }) }, currentImageIndex) }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: {
                                    display: "flex",
                                    justifyContent: "space-between",
                                    width: "100%",
                                    marginTop: "16px"
                                }, children: [(0, jsx_runtime_1.jsx)(material_1.IconButton, { onClick: handlePrevImage, "aria-label": "\u524D\u306E\u753B\u50CF", children: (0, jsx_runtime_1.jsx)(icons_material_1.ArrowBackIos, {}) }), (0, jsx_runtime_1.jsx)(material_1.IconButton, { onClick: handleNextImage, "aria-label": "\u6B21\u306E\u753B\u50CF", children: (0, jsx_runtime_1.jsx)(icons_material_1.ArrowForwardIos, {}) })] })] })) : ((0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body1", children: "\u753B\u50CF\u304C\u3042\u308A\u307E\u305B\u3093" })), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: "flex", flexDirection: "column", gap: 2 }, children: [(0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle1", fontWeight: "bold", children: "\u30CB\u30C3\u30AF\u30CD\u30FC\u30E0:" }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body1", children: profile.nickName || "未入力" })] }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle1", fontWeight: "bold", children: "\u6027\u5225:" }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body1", children: profile.gender || "未入力" })] }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle1", fontWeight: "bold", children: "\u5E74\u9F62:" }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body1", children: profile.age || "未入力" })] }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle1", fontWeight: "bold", children: "\u8EAB\u9577:" }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body1", children: profile.height || "未入力" })] }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle1", fontWeight: "bold", children: "\u51FA\u8EAB:" }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body1", children: profile.origin || "未入力" })] }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle1", fontWeight: "bold", children: "\u8DA3\u5473:" }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body1", children: profile.hobby || "未入力" })] }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle1", fontWeight: "bold", children: "\u5E74\u53CE:" }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body1", children: profile.annualIncome || "未入力" })] })] })] })] }));
};
exports.default = DisplayOther;
