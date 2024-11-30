"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertProvider = exports.AlertContext = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const Snackbar_1 = __importDefault(require("@mui/material/Snackbar"));
const material_1 = require("@mui/material");
const react_1 = require("react");
const react_2 = require("react");
// contextを作成
exports.AlertContext = (0, react_1.createContext)({});
const AlertProvider = (props) => {
    const [open, setOpen] = (0, react_2.useState)(false); // アラート開閉のstate
    const [severity, setSeverity] = (0, react_2.useState)("success"); // アラートの種類のstate
    const [alertText, setAlertText] = (0, react_2.useState)(""); // アラートの文章のstate
    const { children } = props; // 子コンポーネントの宣言
    const showAlert = (text, severity) => {
        setOpen(true);
        setSeverity(severity);
        setAlertText(text);
    };
    // アラートを閉じる
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(exports.AlertContext.Provider, { value: { showAlert }, children: children }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(Snackbar_1.default, { open: open, autoHideDuration: 5000, onClose: handleClose, children: (0, jsx_runtime_1.jsx)(material_1.Alert, { onClose: handleClose, severity: severity, variant: "filled", sx: { width: '100%' }, children: alertText }) }) })] }));
};
exports.AlertProvider = AlertProvider;
