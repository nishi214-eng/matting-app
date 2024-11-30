"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuthContext = exports.AuthProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const auth_1 = require("@firebase/auth");
const firebase_1 = require("../infra/firebase");
// コンテキストの初期値
const initialState = {
    user: undefined,
};
// コンテキストの作成
const AuthContext = (0, react_1.createContext)(initialState);
const AuthProvider = ({ children }) => {
    // userオブジェクトを格納するstate
    const [user, setUser] = (0, react_1.useState)(initialState);
    // コンポーネントがマウントされると実行
    (0, react_1.useEffect)(() => {
        try {
            // ログインしているユーザーの情報をuserに格納
            return (0, auth_1.onAuthStateChanged)(firebase_1.auth, (user) => {
                setUser({
                    user,
                });
            });
        }
        catch (error) {
            setUser(initialState);
            throw error;
        }
    }, []);
    return (0, jsx_runtime_1.jsx)(AuthContext.Provider, { value: user, children: children });
};
exports.AuthProvider = AuthProvider;
const useAuthContext = () => (0, react_1.useContext)(AuthContext);
exports.useAuthContext = useAuthContext;
