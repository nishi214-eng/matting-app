import { useForm, SubmitHandler } from "react-hook-form"
import { useNavigate } from 'react-router-dom'; // useNavigateフックをインポート
import { useEffect,useState } from "react";
import { auth } from "../infra/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { TextField, Button } from "@mui/material";
import { signOut } from "firebase/auth";
import { Link } from "react-router-dom";

import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Visibility } from "@mui/icons-material";
import { VisibilityOff } from "@mui/icons-material";

import "../style/auth.css";

interface SigninForm {
  email: string
  password: string
}

export const SignIn = () => {
    //const { showAlert } = useContext(AlertContext);
    const navigate = useNavigate();
    // React Hook Formの使用
    const { register, handleSubmit, formState: { errors } } = useForm<SigninForm>(); // useForm関数をLoginForm型で呼び出す
  
    // ページ読み込み時にログアウトする
    useEffect(() => {
      signOut(auth);
    }, []);
  
    const onSubmit: SubmitHandler<SigninForm> = async (data) => {
      const { email, password } = data;
  
      try {
        // サインインの実行
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            if(user.displayName){
                // 次ページに遷移
                navigate("/Home")
            }else{
                // 次ページに遷移
                navigate("/ProfileForm")
            }
          })
          .catch((error) => {
            throw new Error(error);
          });

      } catch (error){
        // エラー処理
        console.log(error)
        // showAlert("メールアドレスまたはパスワードが異なります。", "error");
      }
    };
  
    // パスワードの表示可否を切りかえる状態変数
    const [showPassword, setShowPassword] = useState(false);
    // パスワードの表示可否を切り替える関数
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    // ボタンを押下したときに余計な動作を防ぐ
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    };
  
    return (
      <div className="form_container">
        <section className="form_wrapper">
          <div className="form_outer">
            <img src="/images/logp.jpg" alt="ロゴ" 
              width="100%"
              height="auto"      
            />

            <form onSubmit={handleSubmit(onSubmit)} aria-label="ログインフォーム">
              <fieldset className="input_section">
                <div className="input_subsection">
                  <div className="text_field">
                    <TextField
                      id="email"
                      fullWidth
                      variant="outlined"
                      placeholder="メールアドレス"
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
                  <div className="text_field">
                  <TextField
                    id="password"
                    type={showPassword ? "password":"text"}
                    placeholder="パスワード"
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
                        <Link to={"/ResetPassword"} >
                            パスワードを忘れた
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
  