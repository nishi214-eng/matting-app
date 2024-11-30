"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_router_dom_1 = require("react-router-dom");
const useButtonNavigation = () => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    // ナビゲート機能を返す
    const handleNavigation = (path) => {
        navigate(path);
    };
    return handleNavigation;
};
exports.default = useButtonNavigation;
