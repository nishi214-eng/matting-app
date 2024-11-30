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
exports.getMatchingList = void 0;
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("../infra/firebase"); // Firebaseの設定ファイルからdbをインポート
const getMatchingList = (userName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Firestoreの"username"コレクションを取得
        const querySnapshot = yield (0, firestore_1.getDocs)((0, firestore_1.collection)(firebase_1.db, "profiles", `${userName}`, "mattingList"));
        ;
        // "username"フィールドを1つずつ取り出して配列に格納
        const matchingUsernames = querySnapshot.docs.map(doc => doc.data().nickName);
        // 配列を返す
        return matchingUsernames;
    }
    catch (error) {
        console.error("Error getting matching list: ", error);
        return []; // エラーが発生した場合、空の配列を返す
    }
});
exports.getMatchingList = getMatchingList;
