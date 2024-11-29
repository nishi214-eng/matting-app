import { collection, getDocs, QuerySnapshot, DocumentData } from "firebase/firestore";
import { db } from "../infra/firebase"; // Firebaseの設定ファイルからdbをインポート

export const getMatchingList = async (userName: string): Promise<string[]> => {
    try {
        // Firestoreの"username"コレクションを取得
        const querySnapshot = await getDocs(collection(db, "profiles",`${userName}`,"mattingList"));; 
        // "username"フィールドを1つずつ取り出して配列に格納
        const matchingUsernames: string[] = querySnapshot.docs.map(doc => doc.data().nickName);

        // 配列を返す
        return matchingUsernames;
    } catch (error) {
        console.error("Error getting matching list: ", error);
        return []; // エラーが発生した場合、空の配列を返す
    }
};