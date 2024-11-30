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
exports.default = SignUp;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const firebase_1 = require("../infra/firebase");
const auth_1 = require("firebase/auth");
const material_1 = require("@mui/material");
const react_hook_form_1 = require("react-hook-form");
const react_router_dom_1 = require("react-router-dom");
const IconButton_1 = __importDefault(require("@mui/material/IconButton"));
const InputAdornment_1 = __importDefault(require("@mui/material/InputAdornment"));
const icons_material_1 = require("@mui/icons-material");
const icons_material_2 = require("@mui/icons-material");
const useSnackber_1 = require("../store/useSnackber");
const react_2 = require("react");
const FileUploadForm_1 = require("../components/FileUploadForm"); // FileUploadForm コンポーネントをインポート
require("../style/auth.css");
function SignUp() {
    var _a, _b, _c;
    const { showAlert } = (0, react_2.useContext)(useSnackber_1.AlertContext);
    const [isSubmitted, setIsSubmitted] = (0, react_1.useState)(false); // サインアップが完了したかどうかの状態
    // React Hook Formの使用
    const { register, handleSubmit, formState: { errors }, getValues, trigger } = (0, react_hook_form_1.useForm)(); // useForm関数をLoginForm型で呼び出す
    // 送信時の処理
    const onSubmit = (data) => __awaiter(this, void 0, void 0, function* () {
        const { email, password } = data;
        try {
            // Firebase Authでユーザーを作成
            const userCredential = yield (0, auth_1.createUserWithEmailAndPassword)(firebase_1.auth, email, password);
            // 確認メール内リンクのリダイレクト先のURLを設定
            const actionCodeSettings = {
                url: "http://localhost:3000/", // リダイレクト先のURL。本番環境では変更する
                handleCodeInApp: true,
            };
            //ユーザ登録の確認メールを送信
            (0, auth_1.sendEmailVerification)(userCredential.user, actionCodeSettings);
            showAlert(`${email}宛てに確認メールを送信しました。メールボックスを確認してください。`, "success");
            // サインアップ成功後、フォーム送信完了としてマーク
            setIsSubmitted(true);
        }
        catch (error) {
            console.log(error);
            // showAlert("アカウント作成に失敗", "error");
        }
    });
    // パスワードの表示可否を切りかえる状態変数
    const [showPassword, setShowPassword] = (0, react_1.useState)(false);
    // パスワードの表示可否を切り替える関数
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    // ボタンを押下したときに余計な動作を防ぐ
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "form_container", children: (0, jsx_runtime_1.jsxs)("section", { className: "form_wrapper", children: [(0, jsx_runtime_1.jsxs)("div", { className: "form_outer", children: [(0, jsx_runtime_1.jsx)("img", { src: "/images/logp.jpg", alt: "\u30ED\u30B4", width: "100%", height: "auto" }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit(onSubmit), "aria-label": "\u30B5\u30A4\u30F3\u30A2\u30C3\u30D7\u30D5\u30A9\u30FC\u30E0", children: [(0, jsx_runtime_1.jsxs)("fieldset", { className: "input_section", children: [(0, jsx_runtime_1.jsx)("div", { className: "input_subsection", children: (0, jsx_runtime_1.jsx)("div", { className: "text_field", children: (0, jsx_runtime_1.jsx)(material_1.TextField, Object.assign({ id: "email", fullWidth: true, variant: "outlined", placeholder: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9", sx: {
                                                        backgroundColor: "white",
                                                        '& .MuiInputBase-input': {
                                                            height: '100%',
                                                            padding: '10px',
                                                            border: '0px',
                                                        },
                                                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: '#96C78C', // フォーカス時のボーダー色
                                                        },
                                                    } }, register("email", {
                                                    required: "メールアドレスは必須です",
                                                    pattern: {
                                                        value: /^.+@.+\..+/,
                                                        message: "正しいメールアドレスを入力してください",
                                                    },
                                                }), { error: !!errors.email, helperText: (_a = errors.email) === null || _a === void 0 ? void 0 : _a.message })) }) }), (0, jsx_runtime_1.jsx)("div", { className: "input_subsection", children: (0, jsx_runtime_1.jsx)("div", { className: "text_field", children: (0, jsx_runtime_1.jsx)(material_1.TextField, Object.assign({ id: "password", placeholder: "\u30D1\u30B9\u30EF\u30FC\u30C9", type: showPassword ? "password" : "text", fullWidth: true, variant: "outlined", sx: {
                                                        backgroundColor: "white",
                                                        '& .MuiInputBase-input': {
                                                            height: '100%',
                                                            padding: '10px',
                                                        },
                                                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: '#96C78C', // フォーカス時のボーダー色
                                                        },
                                                        '& .MuiFormHelperText-root': {
                                                            margin: '0px', // マージンを0に設定
                                                        },
                                                    } }, register("password", {
                                                    required: "パスワードは必須です",
                                                    onBlur: () => {
                                                        if (getValues("password_confirmation")) {
                                                            trigger("password_confirmation");
                                                        }
                                                    },
                                                    minLength: {
                                                        value: 6,
                                                        message: "パスワードは6文字以上で入力してください",
                                                    },
                                                    maxLength: {
                                                        value: 12,
                                                        message: "パスワードは12文字以内で入力してください",
                                                    },
                                                }), { error: !!errors.password, helperText: (_b = errors.password) === null || _b === void 0 ? void 0 : _b.message, slotProps: {
                                                        input: {
                                                            endAdornment: ((0, jsx_runtime_1.jsx)(InputAdornment_1.default, { position: "end", children: (0, jsx_runtime_1.jsx)(IconButton_1.default, { "aria-label": "toggle password visibility", onClick: handleClickShowPassword, onMouseDown: handleMouseDownPassword, children: showPassword ? (0, jsx_runtime_1.jsx)(icons_material_2.VisibilityOff, {}) : (0, jsx_runtime_1.jsx)(icons_material_1.Visibility, {}) }) })),
                                                        },
                                                    } })) }) }), (0, jsx_runtime_1.jsx)("div", { className: "input_subsection", children: (0, jsx_runtime_1.jsx)("div", { className: "text_field", children: (0, jsx_runtime_1.jsx)(material_1.TextField, Object.assign({ id: "password_confirmation", type: "text", placeholder: "\u30D1\u30B9\u30EF\u30FC\u30C9\u306E\u78BA\u8A8D", fullWidth: true, variant: "outlined", sx: {
                                                        backgroundColor: "white",
                                                        '& .MuiInputBase-input': {
                                                            height: '100%',
                                                            padding: '10px',
                                                        },
                                                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: '#96C78C', // フォーカス時のボーダー色
                                                        },
                                                        '& .MuiFormHelperText-root': {
                                                            margin: '0px', // マージンを0に設定
                                                        },
                                                    } }, register("password_confirmation", {
                                                    required: "確認のためパスワードを再入力してください",
                                                    validate: (value) => {
                                                        return (value === getValues("password") || "パスワードが一致しません");
                                                    },
                                                    minLength: {
                                                        value: 6,
                                                        message: "パスワードは6文字以上で入力してください",
                                                    },
                                                    maxLength: {
                                                        value: 12,
                                                        message: "パスワードは12文字以内で入力してください",
                                                    },
                                                }), { error: !!errors.password_confirmation, helperText: (_c = errors.password_confirmation) === null || _c === void 0 ? void 0 : _c.message })) }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "button_field", children: (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", type: "submit", sx: {
                                            width: "100%",
                                            borderRadius: "1%",
                                            backgroundColor: "#96C78C",
                                            boxShadow: "none",
                                            '&:hover': {
                                                backgroundColor: "98C78C",
                                            },
                                        }, children: "\u30A2\u30AB\u30A6\u30F3\u30C8\u3092\u4F5C\u6210" }) }), (0, jsx_runtime_1.jsx)("div", { className: "linkItem", children: (0, jsx_runtime_1.jsx)("ul", { children: (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/", children: "\u30ED\u30B0\u30A4\u30F3" }) }) }) })] })] }), isSubmitted && (0, jsx_runtime_1.jsx)(FileUploadForm_1.FileUploadForm, { uploadType: "license" })] }) }));
}
