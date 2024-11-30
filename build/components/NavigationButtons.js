"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const material_1 = require("@mui/material");
const useButtonNavigation_1 = __importDefault(require("../feature/useButtonNavigation"));
const Home_1 = __importDefault(require("@mui/icons-material/Home"));
const Message_1 = __importDefault(require("@mui/icons-material/Message"));
const AccountCircle_1 = __importDefault(require("@mui/icons-material/AccountCircle"));
const NavigationButtons = () => {
    // useButtonNavigationフックを使用して、遷移機能を取得
    const navigateTo = (0, useButtonNavigation_1.default)();
    return ((0, jsx_runtime_1.jsxs)(material_1.Box, { sx: {
            display: 'flex',
            bottom: 0, // 下端に固定
            position: "absolute",
            width: "100%",
            left: 0,
            right: 0,
            backgroundColor: '#f8f8f8', // フッターバーの背景色
            justifyContent: 'space-around', // ボタンを均等に配置
            alignItems: 'center', // アイコンを中央に配置
            height: '8%', // 高さを調整
        }, children: [(0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: 'flex', flexDirection: 'column', alignItems: 'center' }, children: [(0, jsx_runtime_1.jsx)(material_1.IconButton, { size: "large", sx: {
                            padding: 0,
                            color: '#96C78C', // アイコンの色
                            '&:hover': {
                                color: '#88b078', // ホバー時に色変更
                            },
                        }, onClick: () => navigateTo('/Home'), children: (0, jsx_runtime_1.jsx)(Home_1.default, { fontSize: "inherit" }) }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "caption", sx: { color: '#96C78C' }, children: "\u30DB\u30FC\u30E0" })] }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: 'flex', flexDirection: 'column', alignItems: 'center' }, children: [(0, jsx_runtime_1.jsx)(material_1.IconButton, { size: "large", sx: {
                            color: '#96C78C', // アイコンの色
                            padding: 0,
                            '&:hover': {
                                color: '#88b078', // ホバー時に色変更
                            },
                        }, onClick: () => navigateTo('/ChatList'), children: (0, jsx_runtime_1.jsx)(Message_1.default, { fontSize: "inherit" }) }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "caption", sx: { color: '#96C78C' }, children: "\u3084\u308A\u53D6\u308A" })] }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: 'flex', flexDirection: 'column', alignItems: 'center' }, children: [(0, jsx_runtime_1.jsx)(material_1.IconButton, { size: "large", sx: {
                            color: '#96C78C', // アイコンの色
                            padding: 0,
                            '&:hover': {
                                color: '#88b078', // ホバー時に色変更
                            },
                        }, onClick: () => navigateTo('/ProfileDisplay'), children: (0, jsx_runtime_1.jsx)(AccountCircle_1.default, { fontSize: "inherit" }) }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "caption", sx: { color: '#96C78C' }, children: "\u8A2D\u5B9A" })] })] }));
};
exports.default = NavigationButtons;
