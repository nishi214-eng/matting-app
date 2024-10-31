// components/FileUploadForm.tsx

/*コンポネント使うとき
<FileUploadForm uploadType="license" />
<FileUploadForm uploadType="icon" />
<FileUploadForm uploadType="profile" />*/

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAuthContext } from '../store/AuthContext';
import { uploadFile } from '../feature/uploadFile'; // ファイルアップロードの機能をインポート
import { Button, CircularProgress, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // useNavigateフックをインポート
import "../style/auth.css";

interface FileUploadFormProps {
  onFailure?: () => void; // エラー時のコールバックプロパティを追加
  uploadType: 'license' | 'icon' | 'profile'; // アップロードタイプを追加
}

interface FileUploadFormData {
  file: FileList;
}

export const FileUploadForm: React.FC<FileUploadFormProps> = ({ onFailure, uploadType }) => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);
  const navigate = useNavigate(); // useNavigateの初期化

  // React Hook Formの使用
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FileUploadFormData>();

  // 認証ユーザーのIDを取得
  const { user } = useAuthContext(); 
  const userId = user?.uid; // ユーザーIDを取得

  // フォームの送信処理
  const onSubmit: SubmitHandler<FileUploadFormData> = async (data) => {
    const file = data.file[0];
    if (!file || !userId) return;

    setUploading(true);
    try {
      const url = await uploadFile(file, userId, uploadType); // uploadType をアップロード関数に渡す
      setDownloadURL(url);
      reset();
      navigate(-1); // アップロード成功時に前の画面に戻る
    } catch (error) {
      console.error('ファイルアップロードエラー:', error);
      if (onFailure) onFailure(); // エラー時に親コンポーネントのコールバックを呼び出す
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="form_container">
      <section className="form_wrapper">
        <div className="form_outer">
          <form onSubmit={handleSubmit(onSubmit)} aria-label="ファイルアップロードフォーム">
            <fieldset className="input_section">
              <div className="input_subsection">
                <label htmlFor="file" className="subsection_title">
                  {uploadType === 'license' && '免許書のアップロード'}
                  {uploadType === 'icon' && 'アイコンのアップロード'}
                  {uploadType === 'profile' && 'プロフィールのアップロード'}
                </label>
                <div className="text_field">
                  <TextField
                    id="file"
                    type="file"
                    fullWidth
                    variant="outlined"
                    inputProps={{ accept: uploadType === 'license' ? 'image/*' : uploadType === 'icon' ? 'image/png,image/jpeg' : 'image/*' }} // アップロードするファイルの種類を指定
                    sx={{
                      backgroundColor: 'white',
                      '& .MuiInputBase-input': { height: '100%', padding: '10px', border: '0px' },
                      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#96C78C' },
                    }}
                    {...register("file", { required: "ファイルは必須です" })}
                    error={!!errors.file}
                    helperText={errors.file?.message}
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

            {downloadURL && ( // downloadURLが存在する場合にのみ表示
              <div className="Item">
                <Typography variant="body1">アップロードは成功しました</Typography>
              </div>
            )}
          </form>
        </div>
      </section>
    </div>
  );
};

export default FileUploadForm;
