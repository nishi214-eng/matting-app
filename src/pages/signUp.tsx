import { useState } from "react";
import { auth } from "../infra/firebase";
import { createUserWithEmailAndPassword,sendEmailVerification } from "firebase/auth";
import { Button,TextField } from "@mui/material";

export default function SignUp(){
    // 各入力の状態変数
    const [userName,setUserName] = useState(""); 
    const [mail,setMail] = useState("");
    const [password,setPassword] = useState("");

    // 入力によって状態変数を更新する
    const onChangeUserName = (e:any) => {
        setUserName(e.target.value);
    };
    const onChangeMail = (e:any) => {
        setMail(e.target.value);
    };
    const onChangePassword = (e:any) => {
        setPassword(e.target.value);
    };

    // 送信時の処理
    const handleSubmit = async (event:any) => {
        event.preventDefault();
        
        try {
            // Firebase Authでユーザーを作成
            const userCredential = await createUserWithEmailAndPassword(auth, mail, password);
            // 確認メール内リンクのリダイレクト先のURLを設定
            const actionCodeSettings = {
                url: "http://localhost:3000/", // リダイレクト先のURL。本番環境では変更する
                handleCodeInApp: true,
            };
            //ユーザ登録の確認メールを送信
                sendEmailVerification(userCredential.user, actionCodeSettings);
                console.log(
                    "success",
                    `${mail}宛てに確認メールを送信しました。メールボックスを確認してください。`
                );

        } catch (error) {
            console.log(error);
        }
    }
    
    
    return(
        <div className="wrapper_signUpForm">
            <form id="form" onSubmit={handleSubmit}>
                <TextField name="userName" label="ユーザーネーム" variant="outlined" value={userName} onChange={onChangeUserName}/>
                <TextField name="mailAddress" label="メールアドレス" variant="outlined" value={mail} onChange={onChangeMail}/>
                <TextField name="passWord" label="パスワード" variant="outlined" value={password} onChange={onChangePassword}/>
                <Button type="submit">
                    送信
                </Button>
            </form>
            <div className="link_item">
                
            </div>
        </div>
    )
}