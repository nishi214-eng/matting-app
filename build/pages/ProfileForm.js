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
const uploadFile_1 = require("../feature/uploadFile");
const AuthContext_1 = require("../store/AuthContext");
const material_1 = require("@mui/material");
const auth_1 = require("firebase/auth");
const useSnackber_1 = require("../store/useSnackber");
const react_2 = require("react");
;
const ProfileForm = () => {
    const { showAlert } = (0, react_2.useContext)(useSnackber_1.AlertContext);
    //プロフィール
    const [profile, setProfile] = (0, react_1.useState)({ nickName: "", gender: undefined, age: "", height: undefined,
        userImage: "", userImage2: "", origin: "", hobby: "", drive: undefined, annualIncome: undefined,
        smoking: undefined, drinking: undefined, marriageWant: undefined, firstSon: undefined });
    const { user } = (0, AuthContext_1.useAuthContext)();
    //入力の際の候補
    const age = [, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
        42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60
    ];
    const gender = ["", "男", "女", "未回答"];
    const height = [, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200];
    const annualIncome = ["", "200万", "300万", "400万", "500万", "600万",
        "700万", "800万", "900万", "1000万以上"
    ];
    const yesNo = ["", "はい", "いいえ"];
    const doDont = ["", "する", "しない"];
    const exist = ["", "ある", "なし"];
    const drive = ["", "しない", "車", "バイク", "どちらも"];
    const [image, setImage] = (0, react_1.useState)(null); //アイコンイメージ
    const [image2, setImage2] = (0, react_1.useState)(null); //アイコンイメージ
    const [imageUrl, setImageUrl] = (0, react_1.useState)(null); //仮置き、入力されたアイコン画像
    const [imageUrl2, setImageUrl2] = (0, react_1.useState)(null); //仮置き、入力されたアイコン画像
    //フォームに通常の入力があった場合
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(Object.assign(Object.assign({}, profile), { [name]: value }));
    };
    //フォームにイメージの入力があった場合
    const handleSetImage = (e) => {
        if (e.target.files) {
            setImage(e.target.files[0]);
            if (e.target.files[0] == null) {
                const url = "";
                setImageUrl(url); //入力イメージの表示
            }
            else {
                const url = URL.createObjectURL(e.target.files[0]);
                setImageUrl(url); //入力イメージの表示
            }
        }
    };
    //フォームにイメージの入力があった場合・その2
    const handleSetImage2 = (e) => {
        if (e.target.files) {
            setImage2(e.target.files[0]);
            if (e.target.files[0] == null) {
                const url = "";
                setImageUrl2(url); //入力イメージの表示
            }
            else {
                const url = URL.createObjectURL(e.target.files[0]);
                setImageUrl2(url); //入力イメージの表示
            }
        }
    };
    //フォームの数字入力があった場合
    const handleNumberChange = (event) => {
        const { name, value } = event.target;
        setProfile(Object.assign(Object.assign({}, profile), { [name]: value }));
    };
    //フォームの選択肢の入力があった場合
    const handleOptionChange = (event) => {
        const { name, value } = event.target;
        setProfile(Object.assign(Object.assign({}, profile), { [name]: value }));
    };
    //入力イメージのリセット
    const handleReset = () => {
        setImage(null);
        setImageUrl(null);
    };
    //入力イメージのリセット・その2
    const handleReset2 = () => {
        setImage2(null);
        setImageUrl2(null);
    };
    //送信ボタンを押した時の処理
    const handleSubmit = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault(); //フォームに対するユーザーからの操作を阻止
        const profileDocRef = (0, firestore_1.doc)(firebase_1.db, 'profiles', profile.nickName);
        const profileDoc = yield (0, firestore_1.getDoc)(profileDocRef);
        if (profileDoc.exists()) {
            showAlert(`プロフィールの更新に成功しました`, "error");
        }
        else {
            //try以下を追加
            try {
                // display nameを更新
                if (user) {
                    yield (0, auth_1.updateProfile)(user, {
                        displayName: profile.nickName, // 新しいユーザーネーム
                    }).then(() => {
                        console.log("Display name updated successfully!");
                    }).catch((error) => {
                        console.error("Error updating display name:", error);
                    });
                }
                else {
                    console.log("No user is signed in.");
                }
                //イメージのアップロードがあるなら
                if (image) {
                    const url = yield (0, uploadFile_1.uploadFile)(image, user === null || user === void 0 ? void 0 : user.email, 'profile'); // features/uploadFile.tsの関数を使用
                    console.log('Image uploaded successfully:', url);
                    setProfile(Object.assign(Object.assign({}, profile), { userImage: url })); //結果のURLをプロフィールに追加
                }
                if (image2) {
                    const url = yield (0, uploadFile_1.uploadFile)(image2, user === null || user === void 0 ? void 0 : user.email, 'profile'); // features/uploadFile.tsの関数を使用
                    console.log('Image uploaded successfully:', url);
                    setProfile(Object.assign(Object.assign({}, profile), { userImage2: url })); //結果のURLをプロフィールに追加
                }
                // 親ドキュメントの参照を取得
                const profileDocRef = (0, firestore_1.doc)(firebase_1.db, "profiles", profile.nickName);
                // 親ドキュメントを作成
                yield (0, firestore_1.setDoc)(profileDocRef, {}); // 必要に応じて初期データを設定
                // "profile" サブコレクションの "data" ドキュメントの参照を取得
                const dataDocRef = (0, firestore_1.doc)((0, firestore_1.collection)(profileDocRef, "profile"), "data");
                // "data" ドキュメントに profile のデータを設定
                yield (0, firestore_1.setDoc)(dataDocRef, profile);
                console.log('Profile saved successfully');
            }
            catch (error) {
                console.error('Error saving Profile: ', error);
            }
        }
    });
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
                }, children: "\u30D7\u30ED\u30D5\u30A3\u30FC\u30EB\u7DE8\u96C6" }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, children: [(0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("label", { children: ["\u30CB\u30C3\u30AF\u30CD\u30FC\u30E0:", (0, jsx_runtime_1.jsx)("input", { type: "text", name: "nickName", value: profile.nickName, onChange: handleChange })] }) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("label", { children: ["\u6027\u5225:", (0, jsx_runtime_1.jsxs)("select", { name: "gender", value: profile.gender, onChange: handleOptionChange, children: [(0, jsx_runtime_1.jsx)("option", { value: "", disabled: true, children: "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044" }), gender.map(gender => ((0, jsx_runtime_1.jsx)("option", { value: gender, children: gender }, gender)))] }), profile.gender != undefined && (0, jsx_runtime_1.jsxs)("p", { children: ["\u6027\u5225: ", profile.gender] })] }) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("label", { children: ["\u5E74\u9F62:", (0, jsx_runtime_1.jsxs)("select", { name: "age", value: profile.age, onChange: handleNumberChange, children: [(0, jsx_runtime_1.jsx)("option", { value: "", disabled: true, children: "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044" }), age.map(age => ((0, jsx_runtime_1.jsx)("option", { value: age, children: age }, age)))] }), profile.age && (0, jsx_runtime_1.jsxs)("p", { children: ["\u9078\u629E\u3055\u308C\u305F\u5E74\u9F62: ", profile.age] })] }) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("label", { children: ["\u8EAB\u9577:", (0, jsx_runtime_1.jsxs)("select", { name: "height", value: profile.height, onChange: handleNumberChange, children: [(0, jsx_runtime_1.jsx)("option", { value: "", disabled: true, children: "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044" }), height.map(height => ((0, jsx_runtime_1.jsx)("option", { value: height, children: height }, height)))] }), profile.height != undefined && (0, jsx_runtime_1.jsxs)("p", { children: ["\u9078\u629E\u3055\u308C\u305F\u8EAB\u9577: ", profile.height] })] }) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("label", { children: ["\u30A2\u30A4\u30B3\u30F3:", (0, jsx_runtime_1.jsx)("input", { type: "file", onChange: handleSetImage }), imageUrl && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("img", { src: imageUrl, alt: "selected", style: { height: '300px', width: '300px' } }), (0, jsx_runtime_1.jsx)("button", { onClick: handleReset, children: "Reset" })] }))] }) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("label", { children: ["\u30A2\u30A4\u30B3\u30F32:", (0, jsx_runtime_1.jsx)("input", { type: "file", onChange: handleSetImage2 }), imageUrl2 && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("img", { src: imageUrl2, alt: "selected", style: { height: '300px', width: '300px' } }), (0, jsx_runtime_1.jsx)("button", { onClick: handleReset2, children: "Reset" })] }))] }) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("label", { children: ["\u51FA\u8EAB:", (0, jsx_runtime_1.jsx)("input", { type: "text", name: "origin", value: profile.origin, onChange: handleChange })] }) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("label", { children: ["\u8DA3\u5473:", (0, jsx_runtime_1.jsx)("input", { type: "text", name: "hobby", value: profile.hobby, onChange: handleChange })] }) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("label", { children: ["\u904B\u8EE2\u3059\u308B\u304B:", (0, jsx_runtime_1.jsxs)("select", { name: "drive", value: profile.drive, onChange: handleOptionChange, children: [(0, jsx_runtime_1.jsx)("option", { value: "", disabled: true, children: "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044" }), drive.map(drive => ((0, jsx_runtime_1.jsx)("option", { value: drive, children: drive }, drive)))] }), profile.drive != undefined && (0, jsx_runtime_1.jsxs)("p", { children: ["\u904B\u8EE2\u3059\u308B\u304B: ", profile.drive] })] }) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("label", { children: ["\u5E74\u53CE:", (0, jsx_runtime_1.jsxs)("select", { name: "annualIncome", value: profile.annualIncome, onChange: handleOptionChange, children: [(0, jsx_runtime_1.jsx)("option", { value: "", disabled: true, children: "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044" }), annualIncome.map(annualIncome => ((0, jsx_runtime_1.jsx)("option", { value: annualIncome, children: annualIncome }, annualIncome)))] }), profile.annualIncome != undefined && (0, jsx_runtime_1.jsxs)("p", { children: ["\u5E74\u53CE: ", profile.annualIncome] })] }) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("label", { children: ["\u55AB\u7159:", (0, jsx_runtime_1.jsxs)("select", { name: "smoking", value: profile.smoking, onChange: handleOptionChange, children: [(0, jsx_runtime_1.jsx)("option", { value: "", disabled: true, children: "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044" }), doDont.map(doDont => ((0, jsx_runtime_1.jsx)("option", { value: doDont, children: doDont }, doDont)))] }), profile.smoking != undefined && (0, jsx_runtime_1.jsxs)("p", { children: ["\u55AB\u7159: ", profile.smoking] })] }) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("label", { children: ["\u98F2\u9152:", (0, jsx_runtime_1.jsxs)("select", { name: "drinking", value: profile.drinking, onChange: handleOptionChange, children: [(0, jsx_runtime_1.jsx)("option", { value: "", disabled: true, children: "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044" }), doDont.map(doDont => ((0, jsx_runtime_1.jsx)("option", { value: doDont, children: doDont }, doDont)))] }), profile.drinking != undefined && (0, jsx_runtime_1.jsxs)("p", { children: ["\u98F2\u9152: ", profile.drinking] })] }) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("label", { children: ["\u7D50\u5A5A\u9858\u671B:", (0, jsx_runtime_1.jsxs)("select", { name: "marriageWant", value: profile.marriageWant, onChange: handleOptionChange, children: [(0, jsx_runtime_1.jsx)("option", { value: "", disabled: true, children: "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044" }), exist.map(exist => ((0, jsx_runtime_1.jsx)("option", { value: exist, children: exist }, exist)))] }), profile.marriageWant != undefined && (0, jsx_runtime_1.jsxs)("p", { children: ["\u7D50\u5A5A\u9858\u671B: ", profile.marriageWant] })] }) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("label", { children: ["\u9577\u7537:", (0, jsx_runtime_1.jsxs)("select", { name: "marriageWant", value: profile.marriageWant, onChange: handleOptionChange, children: [(0, jsx_runtime_1.jsx)("option", { value: "", disabled: true, children: "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044" }), exist.map(yesNo => ((0, jsx_runtime_1.jsx)("option", { value: yesNo, children: yesNo }, yesNo)))] }), profile.firstSon != undefined && (0, jsx_runtime_1.jsxs)("p", { children: ["\u9577\u7537: ", profile.firstSon] })] }) }), (0, jsx_runtime_1.jsx)("button", { type: "submit", children: "Submit" })] })] }));
};
exports.default = ProfileForm;
