import { useState } from "react";
import { auth } from "../infra/firebase";
import { signInWithEmailAndPassword,sendEmailVerification } from "firebase/auth";
import { Button,TextField } from "@mui/material";

export default function SignIn(){
    // 各入力の状態変数
    const [mail,setMail] = useState("");
    const [password,setPassword] = useState("");

    // 入力によって状態変数を更新する
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
            signInWithEmailAndPassword(auth, mail, password)
            .then((userCredential) => {
                //  サインイン 
                const user = userCredential.user;
                //メールアドレスを認証しているか判別
                if(auth.currentUser){
                    if(auth.currentUser.emailVerified){
                        console.log("success","ログインに成功しました")
                    }else{
                        // 確認メール内リンクのリダイレクト先のURLを設定
                        const actionCodeSettings = {
                            url: "http://localhost:3000/", // リダイレクト先のURL。本番環境では変更する
                            handleCodeInApp: true,
                        };
                        //ユーザ登録の確認メールを送信
                        sendEmailVerification(user, actionCodeSettings);
                        console.log("error","メールアドレスを認証してください")
                    }
                }
                

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });


        } catch (error) {
            console.error('アカウント作成に失敗しました');
        }
    }
    
    
    return(
        <div className="wrapper_signInForm">
            <form id="form" onSubmit={handleSubmit}>
                <TextField name="mailAddress" label="メールアドレス" variant="outlined" value={mail} onChange={onChangeMail}/>
                <TextField name="passWord" label="パスワード" variant="outlined" value={password} onChange={onChangePassword}/>
                <Button type="submit" >送信</Button>
            </form>
            <div className="link_item">

            </div>
            <div className="link_item">
                
            </div>
        </div>
    )
}