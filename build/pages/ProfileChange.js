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
const uploadFile_1 = require("../feature/uploadFile");
const AuthContext_1 = require("../store/AuthContext");
const NavigationButtons_1 = __importDefault(require("../components/NavigationButtons"));
const material_1 = require("@mui/material");
const Select_1 = __importDefault(require("@mui/material/Select"));
const mui_file_input_1 = require("mui-file-input");
const auth_1 = require("firebase/auth");
const react_router_dom_1 = require("react-router-dom");
const useSnackber_1 = require("../store/useSnackber");
const react_2 = require("react");
;
const ProfileChange = () => {
    const { user } = (0, AuthContext_1.useAuthContext)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { showAlert } = (0, react_2.useContext)(useSnackber_1.AlertContext);
    //プロフィール・ただしnicknameのついては初期に入力されたものからの変更は禁止
    const [profile, setProfile] = (0, react_1.useState)({ nickName: user === null || user === void 0 ? void 0 : user.displayName, gender: "", age: "", height: "",
        userImage: "", userImage2: "", origin: "", hobby: "", drive: "", annualIncome: "", smoking: "",
        drinking: "", marriageWant: "", firstSon: "" });
    //入力の際の候補
    const age = [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
        41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60];
    const gender = ["未回答", "男", "女"];
    const height = [140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200];
    const annualIncome = ["200万", "300万", "400万", "500万", "600万",
        "700万", "800万", "900万", "1000万以上"];
    const yesNo = ["はい", "いいえ"];
    const doDont = ["する", "しない"];
    const exist = ["ある", "なし"];
    const drive = ["しない", "車", "バイク", "どちらも"];
    const prefectures = ["北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県", "茨城県", "栃木県", "群馬県",
        "埼玉県", "千葉県", "東京都", "神奈川県", "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県",
        "岐阜県", "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
        "鳥取県", "島根県", "岡山県", "広島県", "山口県", "徳島県", "香川県", "愛媛県", "高知県", "福岡県",
        "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"];
    const [image, setImage] = (0, react_1.useState)(null); //アイコンイメージ
    const [image2, setImage2] = (0, react_1.useState)(null); //アイコンイメージ
    const [imageUrl, setImageUrl] = (0, react_1.useState)(null); //仮置き、入力されたアイコン画像
    const [imageUrl2, setImageUrl2] = (0, react_1.useState)(null); //仮置き、入力されたアイコン画像
    const [preImage, setPreImage] = (0, react_1.useState)(""); //変更前のユーザーのアイコン
    const [preImage2, setPreImage2] = (0, react_1.useState)(""); //変更前のユーザーのアイコン
    //登録者自身のプロフィールを取得してデータに格納
    (0, react_1.useEffect)(() => {
        const fetchProfiles = () => __awaiter(void 0, void 0, void 0, function* () {
            // profiles コレクション内の profileNickName ドキュメントを参照
            const profileDocRef = (0, firestore_1.doc)(firebase_1.db, "profiles", profile.nickName);
            // そのドキュメント内の "profile" サブコレクションの "data" ドキュメントを参照
            const dataDocRef = (0, firestore_1.doc)(profileDocRef, "profile", "data");
            const querySnapshot = yield (0, firestore_1.getDoc)(dataDocRef);
            const profilesData = querySnapshot.data();
            setProfile(profilesData);
            setPreImage(profilesData.userImage);
            setPreImage2(profilesData.userImage2);
        });
        fetchProfiles();
    }, []);
    //フォームにイメージの入力があった場合
    const handleSetImage3 = (newFile) => {
        if (newFile == null) {
            const url = "";
            setImageUrl(url); //入力イメージの表示
        }
        else {
            const url = URL.createObjectURL(newFile);
            setImageUrl(url); //入力イメージの表示
        }
        setImage(newFile);
    };
    //フォームにイメージの入力があった場合・その2
    const handleSetImage4 = (newFile) => {
        if (newFile == null) {
            const url = "";
            setImageUrl2(url); //入力イメージの表示
        }
        else {
            const url = URL.createObjectURL(newFile);
            setImageUrl2(url); //入力イメージの表示
        }
        setImage2(newFile);
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
        //try以下を追加
        try {
            if (profile.nickName) {
                if (user) {
                    yield (0, auth_1.updateProfile)(user, {
                        displayName: profile.nickName, // 新しいユーザーネーム
                    }).then(() => {
                        console.log("Display name updated successfully!");
                    });
                }
                ;
            }
            //イメージのアップロードがあるなら
            if (image) {
                const url = yield (0, uploadFile_1.uploadFile)(image, profile.nickName, 'profile'); // features/uploadFile.tsの関数を使用
                console.log('Image uploaded successfully:', url);
                setProfile(Object.assign(Object.assign({}, profile), { userImage: url })); //結果のURLをプロフィールに追加
            }
            if (image2) {
                const url2 = yield (0, uploadFile_1.uploadFile)(image2, profile.nickName, 'profile'); // features/uploadFile.tsの関数を使用
                console.log('Image uploaded successfully:', url2);
                setProfile(Object.assign(Object.assign({}, profile), { userImage2: url2 })); //結果のURLをプロフィールに追加
            }
            // profiles コレクション内の profileNickName ドキュメントを参照
            const profileDocRef = (0, firestore_1.doc)(firebase_1.db, "profiles", profile.nickName);
            // そのドキュメント内の "profile" サブコレクションの "data" ドキュメントを参照
            const dataDocRef = (0, firestore_1.doc)(profileDocRef, "profile", "data");
            // "data" ドキュメントに profile のデータをセット
            yield (0, firestore_1.setDoc)(dataDocRef, profile);
            navigate("/Home");
        }
        catch (error) {
            console.error('Error saving Profile: ', error);
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
                }, children: "\u30D7\u30ED\u30D5\u30A3\u30FC\u30EB\u7DE8\u96C6" }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, children: [(0, jsx_runtime_1.jsx)(material_1.TextField, { id: "nikcName", label: "\u30CB\u30C3\u30AF\u30CD\u30FC\u30E0", disabled: true, value: profile.nickName, sx: { m: 1, minWidth: 120, width: 250 }, size: "small", onChange: (event) => { setProfile(Object.assign(Object.assign({}, profile), { nickName: event.target.value })); } }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "caption", component: "div", gutterBottom: true, children: "\u203B\u30CB\u30C3\u30AF\u30CD\u30FC\u30E0\u306F\u5909\u66F4\u3067\u304D\u307E\u305B\u3093" }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsxs)(material_1.FormControl, { sx: { m: 1, minWidth: 120, width: 250 }, size: "small", children: [(0, jsx_runtime_1.jsx)(material_1.InputLabel, { id: "gender-select-small-label", children: "\u6027\u5225" }), (0, jsx_runtime_1.jsxs)(Select_1.default, { labelId: "gender-select-small-label", name: "gender", value: profile.gender, label: "Gender", onChange: handleOptionChange, children: [(0, jsx_runtime_1.jsx)(material_1.MenuItem, { value: "", children: (0, jsx_runtime_1.jsx)("em", {}) }), gender.map((name) => ((0, jsx_runtime_1.jsx)(material_1.MenuItem, { value: name, children: name }, name)))] })] }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsxs)(material_1.FormControl, { sx: { m: 1, minWidth: 120, width: 250 }, size: "small", children: [(0, jsx_runtime_1.jsx)(material_1.InputLabel, { id: "age-select-small-label", children: "\u5E74\u9F62" }), (0, jsx_runtime_1.jsxs)(Select_1.default, { labelId: "age-select-small-label", name: "age", value: profile.age, label: "Age", onChange: handleOptionChange, children: [(0, jsx_runtime_1.jsx)(material_1.MenuItem, { value: "", children: (0, jsx_runtime_1.jsx)("em", {}) }), age.map((name) => ((0, jsx_runtime_1.jsx)(material_1.MenuItem, { value: name, children: name }, name)))] })] }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsxs)(material_1.FormControl, { sx: { m: 1, minWidth: 120, width: 250 }, size: "small", children: [(0, jsx_runtime_1.jsx)(material_1.InputLabel, { id: "height-select-small-label", children: "\u8EAB\u9577" }), (0, jsx_runtime_1.jsxs)(Select_1.default, { labelId: "height-select-small-label", name: "height", value: profile.height, label: "Hright", onChange: handleOptionChange, children: [(0, jsx_runtime_1.jsx)(material_1.MenuItem, { value: "", children: (0, jsx_runtime_1.jsx)("em", {}) }), height.map((name) => ((0, jsx_runtime_1.jsx)(material_1.MenuItem, { value: name, children: name }, name)))] })] }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body1", component: "h6", mt: 1, gutterBottom: true, children: "\u30A2\u30A4\u30B3\u30F3\u753B\u50CF1\u30FB\u9078\u629E" }), (0, jsx_runtime_1.jsx)(mui_file_input_1.MuiFileInput, { value: image, onChange: handleSetImage3, variant: "outlined", sx: { m: 1, minWidth: 120, width: 250 } }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "caption", component: "div", gutterBottom: true, children: "PNG/JPEG/GIF \u30D5\u30A1\u30A4\u30EB\u306E\u307F\u3001\u30D5\u30A1\u30A4\u30EB\u30B5\u30A4\u30BA\u306F5MB\u4EE5\u5185\u3002" }), (image) && !(image.type === "image/png" || image.type === "image/jpeg" || image.type === "image/gif") && ((0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "caption", component: "div", color: "error.main", gutterBottom: true, children: "\u3053\u306E\u30D5\u30A1\u30A4\u30EB\u30BF\u30A4\u30D7\u306F\u30B5\u30DD\u30FC\u30C8\u3057\u3066\u3044\u307E\u305B\u3093\u3002" })), imageUrl && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("img", { src: imageUrl, alt: "selected", style: { height: '300px', width: '300px' } }), (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleReset, variant: "outlined", children: "Reset" })] })), (!imageUrl && preImage != "") && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("img", { src: preImage, alt: "selected", style: { height: '300px', width: '300px' } }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "caption", component: "div", gutterBottom: true, children: "\u5909\u66F4\u524D\u306E\u30A2\u30A4\u30B3\u30F3" })] })), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body1", component: "h6", mt: 1, gutterBottom: true, children: "\u30A2\u30A4\u30B3\u30F3\u753B\u50CF2\u30FB\u9078\u629E" }), (0, jsx_runtime_1.jsx)(mui_file_input_1.MuiFileInput, { value: image2, onChange: handleSetImage4, variant: "outlined", sx: { m: 1, minWidth: 120, width: 250 } }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "caption", component: "div", gutterBottom: true, children: "PNG/JPEG/GIF \u30D5\u30A1\u30A4\u30EB\u306E\u307F\u3001\u30D5\u30A1\u30A4\u30EB\u30B5\u30A4\u30BA\u306F5MB\u4EE5\u5185\u3002" }), (image2) && !(image2.type === "image/png" || image2.type === "image/jpeg" || image2.type === "image/gif") && ((0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "caption", component: "div", color: "error.main", gutterBottom: true, children: "\u3053\u306E\u30D5\u30A1\u30A4\u30EB\u30BF\u30A4\u30D7\u306F\u30B5\u30DD\u30FC\u30C8\u3057\u3066\u3044\u307E\u305B\u3093\u3002" })), imageUrl2 && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("img", { src: imageUrl2, alt: "selected", style: { height: '300px', width: '300px' } }), (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleReset2, variant: "outlined", children: "Reset" })] })), (!imageUrl2 && preImage2 != "") && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("img", { src: preImage2, alt: "selected", style: { height: '300px', width: '300px' } }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "caption", component: "div", gutterBottom: true, children: "\u5909\u66F4\u524D\u306E\u30A2\u30A4\u30B3\u30F32" })] })), (0, jsx_runtime_1.jsxs)(material_1.FormControl, { sx: { m: 1, minWidth: 120, width: 250 }, size: "small", children: [(0, jsx_runtime_1.jsx)(material_1.InputLabel, { id: "prefecture-select-small-label", children: "\u51FA\u8EAB" }), (0, jsx_runtime_1.jsxs)(Select_1.default, { labelId: "prefecture-select-small-label", name: "origin", value: profile.origin, label: "Origin", onChange: handleOptionChange, children: [(0, jsx_runtime_1.jsx)(material_1.MenuItem, { value: "", children: (0, jsx_runtime_1.jsx)("em", {}) }), prefectures.map((name) => ((0, jsx_runtime_1.jsx)(material_1.MenuItem, { value: name, children: name }, name)))] })] }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)(material_1.TextField, { id: "hobby", label: "\u8DA3\u5473", value: profile.hobby, sx: { m: 1, minWidth: 120, width: 250 }, size: "small", onChange: (event) => { setProfile(Object.assign(Object.assign({}, profile), { hobby: event.target.value })); } }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsxs)(material_1.FormControl, { sx: { m: 1, minWidth: 120, width: 250 }, size: "small", children: [(0, jsx_runtime_1.jsx)(material_1.InputLabel, { id: "drive-select-small-label", children: "\u904B\u8EE2\u3059\u308B\u304B" }), (0, jsx_runtime_1.jsxs)(Select_1.default, { labelId: "drive-select-small-label", name: "drive", value: profile.drive, label: "Drive", onChange: handleOptionChange, children: [(0, jsx_runtime_1.jsx)(material_1.MenuItem, { value: "", children: (0, jsx_runtime_1.jsx)("em", {}) }), drive.map((name) => ((0, jsx_runtime_1.jsx)(material_1.MenuItem, { value: name, children: name }, name)))] })] }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsxs)(material_1.FormControl, { sx: { m: 1, minWidth: 120, width: 250 }, size: "small", children: [(0, jsx_runtime_1.jsx)(material_1.InputLabel, { id: "annualIncome-select-small-label", children: "\u5E74\u53CE" }), (0, jsx_runtime_1.jsxs)(Select_1.default, { labelId: "annualIncome-select-small-label", name: "annualIncome", value: profile.annualIncome, label: "AnnualIncome", onChange: handleOptionChange, children: [(0, jsx_runtime_1.jsx)(material_1.MenuItem, { value: "", children: (0, jsx_runtime_1.jsx)("em", {}) }), annualIncome.map((name) => ((0, jsx_runtime_1.jsx)(material_1.MenuItem, { value: name, children: name }, name)))] })] }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsxs)(material_1.FormControl, { sx: { m: 1, minWidth: 120, width: 250 }, size: "small", children: [(0, jsx_runtime_1.jsx)(material_1.InputLabel, { id: "smoking-select-small-label", children: "\u55AB\u7159" }), (0, jsx_runtime_1.jsxs)(Select_1.default, { labelId: "smoking-select-small-label", name: "smoking", value: profile.smoking, label: "smoking", onChange: handleOptionChange, children: [(0, jsx_runtime_1.jsx)(material_1.MenuItem, { value: "", children: (0, jsx_runtime_1.jsx)("em", {}) }), doDont.map((name) => ((0, jsx_runtime_1.jsx)(material_1.MenuItem, { value: name, children: name }, name)))] })] }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsxs)(material_1.FormControl, { sx: { m: 1, minWidth: 120, width: 250 }, size: "small", children: [(0, jsx_runtime_1.jsx)(material_1.InputLabel, { id: "drinking-select-small-label", children: "\u98F2\u9152" }), (0, jsx_runtime_1.jsxs)(Select_1.default, { labelId: "drinking-select-small-label", name: "drinking", value: profile.drinking, label: "drinking", onChange: handleOptionChange, children: [(0, jsx_runtime_1.jsx)(material_1.MenuItem, { value: "", children: (0, jsx_runtime_1.jsx)("em", {}) }), doDont.map((name) => ((0, jsx_runtime_1.jsx)(material_1.MenuItem, { value: name, children: name }, name)))] })] }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsxs)(material_1.FormControl, { sx: { m: 1, minWidth: 120, width: 250 }, size: "small", children: [(0, jsx_runtime_1.jsx)(material_1.InputLabel, { id: "marriageWant-select-small-label", children: "\u7D50\u5A5A\u9858\u671B" }), (0, jsx_runtime_1.jsxs)(Select_1.default, { labelId: "marriageWant-select-small-label", name: "marriageWant", value: profile.marriageWant, label: "marriageWant", onChange: handleOptionChange, children: [(0, jsx_runtime_1.jsx)(material_1.MenuItem, { value: "", children: (0, jsx_runtime_1.jsx)("em", {}) }), exist.map((name) => ((0, jsx_runtime_1.jsx)(material_1.MenuItem, { value: name, children: name }, name)))] })] }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsxs)(material_1.FormControl, { sx: { m: 1, minWidth: 120, width: 250 }, size: "small", children: [(0, jsx_runtime_1.jsx)(material_1.InputLabel, { id: "firstSon-select-small-label", children: "\u9577\u7537\u304B\u3069\u3046\u304B" }), (0, jsx_runtime_1.jsxs)(Select_1.default, { labelId: "firstSon-select-small-label", name: "firstSon", value: profile.firstSon, label: "firstSon", onChange: handleOptionChange, children: [(0, jsx_runtime_1.jsx)(material_1.MenuItem, { value: "", children: (0, jsx_runtime_1.jsx)("em", {}) }), yesNo.map((name) => ((0, jsx_runtime_1.jsx)(material_1.MenuItem, { value: name, children: name }, name)))] })] }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", type: "submit", children: "\u66F4\u65B0" }), (0, jsx_runtime_1.jsx)(NavigationButtons_1.default, {})] })] }));
};
exports.default = ProfileChange;
