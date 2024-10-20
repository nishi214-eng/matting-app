import * as React from 'react';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import { Alert } from '@mui/material';
import { createContext } from 'react';
import { ReactNode } from 'react';
import { FC } from 'react';
import { useState } from 'react';

// アラートの種類の型定義
type severityType = "error"|"success";

// showAlert関数の型定義
type ShowAlertType = (text: string, severity: severityType) => void;

// contextを作成
export const AlertContext = createContext({} as {
    showAlert: ShowAlertType; // showAlert関数の型を指定。これがないとcontextを使うコンポーネントが、showalertのプロパティを認識できない(初期値は{}として渡すのでasを使用)
});


type Props = { // 子コンポーネントの型定義
	children: ReactNode; // Reactが描画できるすべての要素＝ReactNode
};

export const AlertProvider: FC<Props> = (props) => { // 子コンポーネントを引数として受け取る
  const [open, setOpen] = useState<boolean>(false); // アラート開閉のstate
  const [severity, setSeverity] = useState<severityType>("success"); // アラートの種類のstate
  const [alertText,setAlertText] = useState<string>(""); // アラートの文章のstate

  const { children } = props; // 子コンポーネントの宣言

  const showAlert = (text:string,severity:severityType) => { // 子コンポーネントで呼び出す関数。表示するテキストとアラートの種類が引数
    setOpen(true);
    setSeverity(severity);
    setAlertText(text);
  }

  // アラートを閉じる
  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <>
        <AlertContext.Provider value={{showAlert}}>
            {children} 
        </AlertContext.Provider>
        <div>
            <Snackbar
                open={open}
                autoHideDuration={5000}
                onClose={handleClose}
            >
                <Alert
                    onClose={handleClose}
                    severity= {severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {alertText}
                </Alert>
            </Snackbar>
        </div>
    </>
  );
}
