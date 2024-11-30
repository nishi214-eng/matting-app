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
exports.ResetPassword = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_hook_form_1 = require("react-hook-form");
const react_1 = require("react");
const firebase_1 = require("../infra/firebase");
const auth_1 = require("firebase/auth");
const material_1 = require("@mui/material");
const auth_2 = require("firebase/auth");
const react_router_dom_1 = require("react-router-dom");
const useSnackber_1 = require("../store/useSnackber");
const react_2 = require("react");
require("../style/auth.css");
const ResetPassword = () => {
    var _a;
    const { showAlert } = (0, react_2.useContext)(useSnackber_1.AlertContext);
    // React Hook Formの使用
    const { register, handleSubmit, formState: { errors } } = (0, react_hook_form_1.useForm)(); // useForm関数をLoginForm型で呼び出す
    // ページ読み込み時にログアウトする
    (0, react_1.useEffect)(() => {
        (0, auth_2.signOut)(firebase_1.auth);
    }, []);
    const onSubmit = (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { email } = data;
        const actionCodeSettings = {
            // パスワード再設定後のリダイレクト URL本番環境では変更
            url: 'http://localhost:3000/login',
        };
        try {
            (0, auth_1.sendPasswordResetEmail)(firebase_1.auth, email, actionCodeSettings);
            showAlert(`${email}にメールを送信しました。`, "success");
        }
        catch (error) {
            console.log(error);
        }
    });
    return ((0, jsx_runtime_1.jsx)("div", { className: "form_container", children: (0, jsx_runtime_1.jsx)("section", { className: "form_wrapper", children: (0, jsx_runtime_1.jsxs)("div", { className: "form_outer", children: [(0, jsx_runtime_1.jsx)("img", { src: "/images/logp.jpg", alt: "\u30ED\u30B4", width: "100%", height: "auto" }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit(onSubmit), "aria-label": "\u30ED\u30B0\u30A4\u30F3\u30D5\u30A9\u30FC\u30E0", children: [(0, jsx_runtime_1.jsx)("fieldset", { className: "input_section", children: (0, jsx_runtime_1.jsx)("div", { className: "input_subsection", children: (0, jsx_runtime_1.jsx)("div", { className: "text_field", children: (0, jsx_runtime_1.jsx)(material_1.TextField, Object.assign({ id: "email", fullWidth: true, placeholder: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9", variant: "outlined", sx: {
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
                                        }), { error: !!errors.email, helperText: (_a = errors.email) === null || _a === void 0 ? void 0 : _a.message })) }) }) }), (0, jsx_runtime_1.jsx)("div", { className: "button_field", children: (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", type: "submit", sx: {
                                        width: "100%",
                                        borderRadius: "1%",
                                        backgroundColor: "#96C78C",
                                        boxShadow: "none",
                                        '&:hover': {
                                            backgroundColor: "98C78C",
                                        },
                                    }, children: "\u30D1\u30B9\u30EF\u30FC\u30C9\u3092\u30EA\u30BB\u30C3\u30C8" }) }), (0, jsx_runtime_1.jsx)("div", { className: "linkItem", children: (0, jsx_runtime_1.jsx)("ul", { children: (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/", children: "\u30ED\u30B0\u30A4\u30F3" }) }) }) })] })] }) }) }));
};
exports.ResetPassword = ResetPassword;
