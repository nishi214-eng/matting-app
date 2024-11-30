"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const chatLog_1 = __importDefault(require("../components/chatLog"));
const AuthContext_1 = require("../store/AuthContext");
const react_router_dom_1 = require("react-router-dom");
const Chat = () => {
    const { user } = (0, AuthContext_1.useAuthContext)();
    const location = (0, react_router_dom_1.useLocation)();
    const { partnerName } = location.state || { partnerName: '名称未設定' };
    return ((0, jsx_runtime_1.jsxs)("div", { children: [user && user.displayName &&
                (0, jsx_runtime_1.jsx)(chatLog_1.default, { partnerName: partnerName }), !user &&
                (0, jsx_runtime_1.jsx)("h1", { children: "\u30FB\u30FB\u30FB" })] }));
};
exports.default = Chat;
