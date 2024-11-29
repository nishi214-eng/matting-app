import { useForm, SubmitHandler } from "react-hook-form"

import { useEffect,useState } from "react";
import { auth } from "../infra/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { TextField, Button } from "@mui/material";
import { signOut } from "firebase/auth";
import { Link, Navigate } from "react-router-dom";
import { AlertContext } from '../store/useSnackber';
import { useContext } from 'react';

import "../style/auth.css";

interface ResetPasswordForm {
  email: string
}

export const ResetPassword = () => {
    const { showAlert } = useContext(AlertContext);
  
    // React Hook Formの使用
    const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordForm>(); // useForm関数をLoginForm型で呼び出す
  
    // ページ読み込み時にログアウトする
    useEffect(() => {
      signOut(auth);
    }, []);
  
    const onSubmit: SubmitHandler<ResetPasswordForm> = async (data) => {
      const { email } = data;
  
      const actionCodeSettings = {
        // パスワード再設定後のリダイレクト URL本番環境では変更
        url: 'http://localhost:3000/login',
      }
      try{
        sendPasswordResetEmail(auth, email, actionCodeSettings)
        showAlert(`${email}にメールを送信しました。`,"success");
      }catch(error){
        console.log(error)
      }
    };
  
    return (
      <div className="form_container">
        <section className="form_wrapper">
          <div className="form_outer">
  
            <form onSubmit={handleSubmit(onSubmit)} aria-label="ログインフォーム">
              <fieldset className="input_section">
                <div className="input_subsection">
                  <label htmlFor="email" className="subsection_title">
                    メールアドレス
                  </label>
                  <div className="text_field">
                    <TextField
                      id="email"
                      fullWidth
                      variant="outlined"
                      sx={{
                        backgroundColor: "white",
                        '& .MuiInputBase-input': {
                            height: '100%',
                            padding: '10px', 
                            border: '0px', 
                        },
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#96C78C', // フォーカス時のボーダー色
                        },
                      }}
                      {...register("email", {
                        required: "メールアドレスは必須です",
                        pattern: {
                          value: /^.+@.+\..+/,
                          message: "正しいメールアドレスを入力してください",
                        },
                      })}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  </div>
                </div>
              </fieldset>
  
              <div className="button_field">
                <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    width: "100%",
                    borderRadius: "1%",
                    backgroundColor: "#96C78C",
                    boxShadow: "none",
                    '&:hover': {
                      backgroundColor: "98C78C",
                    },
                  }}
                >
                  パスワードをリセット
                </Button>
              </div>
              <div className="linkItem">
                <ul>
                    <li>
                        <Link to={"/"} >
                            ログイン
                        </Link>
                    </li>
                </ul>
              </div>
            </form>
          </div>
        </section>
      </div>
    );
  };
  