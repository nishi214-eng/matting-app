// components/LicenseUploadForm.tsx
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { uploadFile } from '../feature/uploadFile'; // ファイルアップロードの機能をインポート
import { Button, CircularProgress, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // useNavigateフックをインポート
import "../style/auth.css";

interface LicenseUploadFormProps {
  onFailure?: () => void; // エラー時のコールバックプロパティを追加
}

interface LicenseUploadFormData {
  licenseFile: FileList;
}

export const LicenseUploadForm: React.FC<LicenseUploadFormProps> = ({ onFailure }) => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false); // アップロード成功フラグを追加
  const navigate = useNavigate(); // useNavigateの初期化

  // React Hook Formの使用
  const { register, handleSubmit, formState: { errors }, reset } = useForm<LicenseUploadFormData>();

  // フォームの送信処理
  const onSubmit: SubmitHandler<LicenseUploadFormData> = async (data) => {
    const file = data.licenseFile[0];
    if (!file) return;

    setUploading(true);
    setUploadSuccess(false); // フォーム送信時に成功フラグをリセット
    try {
      await uploadFile(file); // features/uploadFile.tsの関数を使用
      reset();
      setUploadSuccess(true); // アップロード成功フラグを設定
    } catch (error) {
      console.error('ライセンスファイルアップロードエラー:', error);
      if (onFailure) onFailure(); // エラー時に親コンポーネントのコールバックを呼び出す
    } finally {
      setUploading(false);
    }
  };

  // 閉じるボタンをクリックしたときの処理
  const handleClose = () => {
    navigate('/your-target-page'); // 指定のページに遷移
  };

  return (
    <div className="form_container">
      <section className="form_wrapper">
        <div className="form_outer">
          <form onSubmit={handleSubmit(onSubmit)} aria-label="ライセンスファイルアップロードフォーム">
            {!uploadSuccess ? ( // アップロードが成功していないときの表示
              <>
                <fieldset className="input_section">
                  <div className="input_subsection">
                    <label htmlFor="licenseFile" className="subsection_title">ライセンスファイル（必須）</label>
                    <div className="text_field">
                      <TextField
                        id="licenseFile"
                        type="file"
                        fullWidth
                        variant="outlined"
                        inputProps={{ accept: 'image/*' }} // アップロードを許可するファイルタイプ
                        sx={{
                          backgroundColor: 'white',
                          '& .MuiInputBase-input': { height: '100%', padding: '10px', border: '0px' },
                          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#96C78C' },
                        }}
                        {...register("licenseFile", { required: "免許書の提示は必須です" })} // 必須バリデーション
                        error={!!errors.licenseFile}
                        helperText={errors.licenseFile?.message}
                      />
                    </div>
                  </div>
                </fieldset>

                <div className="button_field">
                  <Button
                    variant="contained"
                    type="submit"
                    sx={{
                      width: '100%',
                      borderRadius: '1%',
                      backgroundColor: '#96C78C',
                      boxShadow: 'none',
                      '&:hover': { backgroundColor: '#98C78C' },
                    }}
                    disabled={uploading}
                  >
                    {uploading ? <CircularProgress size={24} /> : 'アップロード'}
                  </Button>
                </div>
              </>
            ) : ( // アップロード成功時の表示
              <div className="Item">
                <Typography variant="body1">アップロードは成功しました</Typography>
                <Button
                  variant="contained"
                  onClick={handleClose}
                  sx={{
                    marginTop: '16px',
                    backgroundColor: '#96C78C',
                    '&:hover': { backgroundColor: '#98C78C' },
                  }}
                >
                  閉じる
                </Button>
              </div>
            )}
          </form>
        </div>
      </section>
    </div>
  );
};

export default LicenseUploadForm;
