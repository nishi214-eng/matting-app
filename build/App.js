"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const signIn_1 = require("./pages/signIn");
const signUp_1 = __importDefault(require("./pages/signUp"));
const resetPassword_1 = require("./pages/resetPassword");
const react_router_dom_1 = require("react-router-dom");
require("./App.css");
const ChatList_1 = __importDefault(require("./pages/ChatList"));
const ProfileForm_1 = __importDefault(require("./pages/ProfileForm"));
const ProfileDisplay_1 = __importDefault(require("./pages/ProfileDisplay"));
const Chat_1 = __importDefault(require("./pages/Chat"));
const MatchingPage_1 = __importDefault(require("./pages/MatchingPage"));
const AuthContext_1 = require("./store/AuthContext");
const useSnackber_1 = require("./store/useSnackber");
const DisplayOther_1 = __importDefault(require("./pages/DisplayOther"));
function App() {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "App", children: [(0, jsx_runtime_1.jsx)("header", { className: "App-header" }), (0, jsx_runtime_1.jsx)(react_router_dom_1.BrowserRouter, { children: (0, jsx_runtime_1.jsx)(AuthContext_1.AuthProvider, { children: (0, jsx_runtime_1.jsx)(useSnackber_1.AlertProvider, { children: (0, jsx_runtime_1.jsxs)(react_router_dom_1.Routes, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/", element: (0, jsx_runtime_1.jsx)(signIn_1.SignIn, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/SignUp", element: (0, jsx_runtime_1.jsx)(signUp_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/ResetPassword", element: (0, jsx_runtime_1.jsx)(resetPassword_1.ResetPassword, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/Home", element: (0, jsx_runtime_1.jsx)(MatchingPage_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/ChatList", element: (0, jsx_runtime_1.jsx)(ChatList_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/Chat", element: (0, jsx_runtime_1.jsx)(Chat_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/ProfileForm", element: (0, jsx_runtime_1.jsx)(ProfileForm_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/ProfileDisplay", element: (0, jsx_runtime_1.jsx)(ProfileDisplay_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/DisplayOther", element: (0, jsx_runtime_1.jsx)(DisplayOther_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "*", element: (0, jsx_runtime_1.jsx)("h1", { children: "Not Found Page" }) })] }) }) }) })] }));
}
exports.default = App;
