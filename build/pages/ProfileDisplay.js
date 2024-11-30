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
const react_router_dom_1 = require("react-router-dom");
const AuthContext_1 = require("../store/AuthContext");
const material_1 = require("@mui/material");
;
const ProfileDisplay = () => {
    const { user } = (0, AuthContext_1.useAuthContext)();
    //プロフィール
    const [profile, setProfile] = (0, react_1.useState)({ nickName: user === null || user === void 0 ? void 0 : user.displayName, gender: "", age: "", height: "",
        userImage: "", userImage2: "", origin: "", hobby: "", drive: "", annualIncome: "", smoking: "",
        drinking: "", marriageWant: "", firstSon: "" });
    //DBからもらってきてデータを格納し、画面をレンダリング
    (0, react_1.useEffect)(() => {
        const fetchProfiles = () => __awaiter(void 0, void 0, void 0, function* () {
            // profiles コレクション内の profileNickName ドキュメントを参照
            const profileDocRef = (0, firestore_1.doc)(firebase_1.db, "profiles", profile.nickName);
            // そのドキュメント内の "profile" サブコレクションの "data" ドキュメントを参照
            const dataDocRef = (0, firestore_1.doc)(profileDocRef, "profile", "data");
            const querySnapshot = yield (0, firestore_1.getDoc)(dataDocRef);
            const profilesData = querySnapshot.data();
            setProfile(profilesData);
        });
        fetchProfiles();
    }, []);
    //フォームの選択肢の入力があった場合
    const handleChange = (e) => {
        const { id, value } = e.target;
        setProfile(Object.assign(Object.assign({}, profile), { [id]: value }));
    };
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)(material_1.Box, { sx: {
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
                        }, children: "\u3042\u306A\u305F\u306E\u30D7\u30ED\u30D5\u30A3\u30FC\u30EB" }), (0, jsx_runtime_1.jsx)(material_1.TextField, { id: "nikcName", label: "\u30CB\u30C3\u30AF\u30CD\u30FC\u30E0", value: profile.nickName, sx: { m: 1, minWidth: 120, width: 250 }, size: "small", onChange: handleChange, slotProps: {
                            input: {
                                readOnly: true,
                            },
                        } }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)(material_1.TextField, { id: "gender", label: "\u6027\u5225", value: profile.gender, sx: { m: 1, minWidth: 120, width: 250 }, size: "small", onChange: handleChange, slotProps: {
                            input: {
                                readOnly: true,
                            },
                        } }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)(material_1.TextField, { id: "age", label: "\u5E74\u9F62", value: profile.age, sx: { m: 1, minWidth: 120, width: 250 }, size: "small", onChange: handleChange, slotProps: {
                            input: {
                                readOnly: true,
                            },
                        } }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)(material_1.TextField, { id: "height", label: "\u8EAB\u9577", value: profile.height, sx: { m: 1, minWidth: 120, width: 250 }, size: "small", onChange: handleChange, slotProps: {
                            input: {
                                readOnly: true,
                            },
                        } }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body1", component: "h6", mt: 1, gutterBottom: true, children: "\u30A2\u30A4\u30B3\u30F3\u753B\u50CF1" }), profile.userImage !== "" && ((0, jsx_runtime_1.jsx)("img", { src: profile.userImage, alt: "selected", style: { height: '300px', width: '300px' } })), profile.userImage === "" && ((0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body1", component: "h3", mt: 1, gutterBottom: true, children: "\u672A\u5165\u529B" })), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body1", component: "h6", mt: 1, gutterBottom: true, children: "\u30A2\u30A4\u30B3\u30F3\u753B\u50CF2" }), profile.userImage2 !== "" && ((0, jsx_runtime_1.jsx)("img", { src: profile.userImage2, alt: "selected", style: { height: '300px', width: '300px' } })), profile.userImage2 === "" && ((0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body1", component: "h3", mt: 1, gutterBottom: true, children: "\u672A\u5165\u529B" })), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)(material_1.TextField, { id: "origin", label: "\u51FA\u8EAB", value: profile.origin, sx: { m: 1, minWidth: 120, width: 250 }, size: "small", onChange: handleChange, slotProps: {
                            input: {
                                readOnly: true,
                            },
                        } }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)(material_1.TextField, { id: "hobby", label: "\u8DA3\u5473", value: profile.hobby, sx: { m: 1, minWidth: 120, width: 250 }, size: "small", onChange: handleChange, slotProps: {
                            input: {
                                readOnly: true,
                            },
                        } }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)(material_1.TextField, { id: "drive", label: "\u904B\u8EE2\u3059\u308B\u304B", value: profile.drive, sx: { m: 1, minWidth: 120, width: 250 }, size: "small", onChange: handleChange, slotProps: {
                            input: {
                                readOnly: true,
                            },
                        } }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)(material_1.TextField, { id: "annualIncome", label: "\u5E74\u53CE", value: profile.annualIncome, sx: { m: 1, minWidth: 120, width: 250 }, size: "small", onChange: handleChange, slotProps: {
                            input: {
                                readOnly: true,
                            },
                        } }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)(material_1.TextField, { id: "smoking", label: "\u55AB\u7159", value: profile.smoking, sx: { m: 1, minWidth: 120, width: 250 }, size: "small", onChange: handleChange, slotProps: {
                            input: {
                                readOnly: true,
                            },
                        } }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)(material_1.TextField, { id: "drinking", label: "\u98F2\u9152", value: profile.drinking, sx: { m: 1, minWidth: 120, width: 250 }, size: "small", onChange: handleChange, slotProps: {
                            input: {
                                readOnly: true,
                            },
                        } }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)(material_1.TextField, { id: "marriageWant", label: "\u7D50\u5A5A\u9858\u671B", value: profile.marriageWant, sx: { m: 1, minWidth: 120, width: 250 }, size: "small", onChange: handleChange, slotProps: {
                            input: {
                                readOnly: true,
                            },
                        } }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)(material_1.TextField, { id: "firstSon", label: "\u9577\u7537\u304B\u3069\u3046\u304B", value: profile.firstSon, sx: { m: 1, minWidth: 120, width: 250 }, size: "small", onChange: handleChange, slotProps: {
                            input: {
                                readOnly: true,
                            },
                        } }), (0, jsx_runtime_1.jsx)("br", {})] }), (0, jsx_runtime_1.jsx)("div", { className: "linkItem", children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/ProfileForm", children: "\u30D7\u30ED\u30D5\u30A3\u30FC\u30EB\u66F4\u65B0" }) })] }));
};
exports.default = ProfileDisplay;
