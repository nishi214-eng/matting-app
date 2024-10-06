import { useState } from "react";
import { auth } from "../infra/firebase";
import { createUserWithEmailAndPassword,sendEmailVerification } from "firebase/auth";
import { Button,TextField } from "@mui/material";
import { useForm,SubmitHandler } from "react-hook-form";


import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Visibility } from "@mui/icons-material";
import { VisibilityOff } from "@mui/icons-material";

interface SignupForm {
    email: string
    password: string
}

export default function SignUp(){
     //const { showAlert } = useContext(AlertContext);
  
    // React Hook Formの使用
    const { register, handleSubmit, formState: { errors } } = useForm<SignupForm>(); // useForm関数をLoginForm型で呼び出す
    // 送信時の処理
    const onSubmit: SubmitHandler<SignupForm> = async (data) => {
        const {email,password} = data;        
        try {
            // Firebase Authでユーザーを作成
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // 確認メール内リンクのリダイレクト先のURLを設定
            const actionCodeSettings = {
                url: "http://localhost:3000/", // リダイレクト先のURL。本番環境では変更する
                handleCodeInApp: true,
            };
            //ユーザ登録の確認メールを送信
                sendEmailVerification(userCredential.user, actionCodeSettings);
                console.log(
                    "success",
                    `${email}宛てに確認メールを送信しました。メールボックスを確認してください。`
                );

        } catch (error) {
            console.log(error);
        }
    }
    
    // パスワードの表示可否を切りかえる状態変数
    const [showPassword, setShowPassword] = useState(false);
    // パスワードの表示可否を切り替える関数
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    // ボタンを押下したときに余計な動作を防ぐ
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    };
    
    return(
        <div className="form_container">
        <section className="form_wrapper">
          <div className="form_outer">
  
            <form onSubmit={handleSubmit(onSubmit)} aria-label="サインアップフォーム">
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
  
                <div className="input_subsection">
                  <label htmlFor="password" className="subsection_title">
                    パスワード
                  </label>
                  <div className="text_field">
                  <TextField
                    id="password"
                    type={showPassword ? "password":"text"}
                    fullWidth
                      variant="outlined"
                      sx={{
                        backgroundColor: "white",
                        '& .MuiInputBase-input': {
                            height: '100%',
                            padding: '10px', 
                        },
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#96C78C', // フォーカス時のボーダー色
                        },
                        '& .MuiFormHelperText-root': { // ここを修正
                            margin: '0px', // マージンを0に設定
                        },
                    }}
                    {...register("password", {
                        required: "パスワードは必須です",
                        minLength: {
                        value: 6,
                        message: "パスワードは6文字以上で入力してください",
                        },
                        maxLength: {
                        value: 12,
                        message: "パスワードは12文字以内で入力してください",
                        },
                    })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}                
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
                  ログイン
                </Button>
              </div>
              <div className="linkItem">
                <ul>
                    <li>
                        <Link to={"/signup"} >
                            アカウント作成
                        </Link>
                    </li>
                    <li>
                        <Link to={"/signup"} >
                            パスワードを忘れた
                        </Link>
                    </li>
                </ul>
              </div>
            </form>
          </div>
        </section>
      </div>
    )
}