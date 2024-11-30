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
exports.FileUploadForm = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
// components/FileUploadForm.tsx
/*コンポネント使うとき
<FileUploadForm uploadType="license" />
<FileUploadForm uploadType="icon" />
<FileUploadForm uploadType="profile" />*/
const react_1 = require("react");
const react_hook_form_1 = require("react-hook-form");
const AuthContext_1 = require("../store/AuthContext");
const uploadFile_1 = require("../feature/uploadFile"); // ファイルアップロードの機能をインポート
const material_1 = require("@mui/material");
const react_router_dom_1 = require("react-router-dom"); // useNavigateフックをインポート
require("../style/auth.css");
const NavigationButtons_1 = __importDefault(require("./NavigationButtons"));
const FileUploadForm = ({ onFailure, uploadType }) => {
    var _a;
    const [uploading, setUploading] = (0, react_1.useState)(false);
    const [downloadURL, setDownloadURL] = (0, react_1.useState)(null);
    const navigate = (0, react_router_dom_1.useNavigate)(); // useNavigateの初期化
    // React Hook Formの使用
    const { register, handleSubmit, formState: { errors }, reset } = (0, react_hook_form_1.useForm)();
    // 認証ユーザーのIDを取得
    const { user } = (0, AuthContext_1.useAuthContext)();
    const userId = user === null || user === void 0 ? void 0 : user.uid; // ユーザーIDを取得
    // フォームの送信処理
    const onSubmit = (data) => __awaiter(void 0, void 0, void 0, function* () {
        const file = data.file[0];
        if (!file || !userId)
            return;
        setUploading(true);
        try {
            const url = yield (0, uploadFile_1.uploadFile)(file, userId, uploadType); // uploadType をアップロード関数に渡す
            setDownloadURL(url);
            reset();
            navigate(-1); // アップロード成功時に前の画面に戻る
        }
        catch (error) {
            console.error('ファイルアップロードエラー:', error);
            if (onFailure)
                onFailure(); // エラー時に親コンポーネントのコールバックを呼び出す
        }
        finally {
            setUploading(false);
        }
    });
    return ((0, jsx_runtime_1.jsx)("div", { className: "form_container", children: (0, jsx_runtime_1.jsx)("section", { className: "form_wrapper", children: (0, jsx_runtime_1.jsx)("div", { className: "form_outer", children: (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit(onSubmit), "aria-label": "\u30D5\u30A1\u30A4\u30EB\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u30D5\u30A9\u30FC\u30E0", children: [(0, jsx_runtime_1.jsx)("fieldset", { className: "input_section", children: (0, jsx_runtime_1.jsxs)("div", { className: "input_subsection", children: [(0, jsx_runtime_1.jsxs)("label", { htmlFor: "file", className: "subsection_title", children: [uploadType === 'license' && '免許書のアップロード', uploadType === 'icon' && 'アイコンのアップロード', uploadType === 'profile' && 'プロフィールのアップロード'] }), (0, jsx_runtime_1.jsx)("div", { className: "text_field", children: (0, jsx_runtime_1.jsx)(material_1.TextField, Object.assign({ id: "file", type: "file", fullWidth: true, variant: "outlined", inputProps: { accept: uploadType === 'license' ? 'image/*' : uploadType === 'icon' ? 'image/png,image/jpeg' : 'image/*' }, sx: {
                                                backgroundColor: 'white',
                                                '& .MuiInputBase-input': { height: '100%', padding: '10px', border: '0px' },
                                                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#96C78C' },
                                            } }, register("file", { required: "ファイルは必須です" }), { error: !!errors.file, helperText: (_a = errors.file) === null || _a === void 0 ? void 0 : _a.message })) })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "button_field", children: (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", type: "submit", sx: {
                                    width: '100%',
                                    borderRadius: '1%',
                                    backgroundColor: '#96C78C',
                                    boxShadow: 'none',
                                    '&:hover': { backgroundColor: '#98C78C' },
                                }, disabled: uploading, children: uploading ? (0, jsx_runtime_1.jsx)(material_1.CircularProgress, { size: 24 }) : 'アップロード' }) }), downloadURL && ( // downloadURLが存在する場合にのみ表示
                        (0, jsx_runtime_1.jsxs)("div", { className: "Item", children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body1", children: "\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u306F\u6210\u529F\u3057\u307E\u3057\u305F" }), (0, jsx_runtime_1.jsx)(NavigationButtons_1.default, {})] }))] }) }) }) }));
};
exports.FileUploadForm = FileUploadForm;
exports.default = exports.FileUploadForm;
