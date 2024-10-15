// components/FileUploadForm.tsx
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { uploadFile } from '../feature/uploadFile'; // ファイルアップロードの機能をインポート
import { Button, CircularProgress, TextField, Typography } from '@mui/material';
import { Link, Navigate } from 'react-router-dom';
import "../style/auth.css";

interface FileUploadForm {
  file: FileList;
}

export const FileUploadForm: React.FC = () => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);
  const [redirect, setRedirect] = useState<boolean>(false);

  // React Hook Formの使用
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FileUploadForm>();

  // フォームの送信処理
  const onSubmit: SubmitHandler<FileUploadForm> = async (data) => {
    const file = data.file[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadFile(file); // features/uploadFile.tsの関数を使用
      setDownloadURL(url);
      setRedirect(true); // アップロード成功時にリダイレクトフラグをセット
      reset();
    } catch (error) {
      console.error('ファイルアップロードエラー:', error);
    } finally {
      setUploading(false);
    }
  };

  // リダイレクト処理
  if (redirect) {
    return <Navigate to="/success" />; // 成功ページへリダイレクト
  }

  return (
    <div className="form_container">
      <section className="form_wrapper">
        <div className="form_outer">
          <form onSubmit={handleSubmit(onSubmit)} aria-label="ファイルアップロードフォーム">
            <fieldset className="input_section">
              <div className="input_subsection">
                <label htmlFor="file" className="subsection_title">アップロードするファイル</label>
                <div className="text_field">
                  <TextField
                    id="file"
                    type="file"
                    fullWidth
                    variant="outlined"
                    inputProps={{ accept: 'image/*' }}
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
                  '&:hover': { backgroundColor: '98C78C' },
                }}
                disabled={uploading}
              >
                {uploading ? <CircularProgress size={24} /> : 'アップロード'}
              </Button>
            </div>

            {downloadURL && (
              <div className="linkItem">
                <Typography variant="body1">アップロードされたファイルのURL:</Typography>
                <a href={downloadURL} target="_blank" rel="noopener noreferrer">{downloadURL}</a>
              </div>
            )}

            <div className="linkItem">
              <ul>
                <li><Link to="/">ログイン</Link></li>
              </ul>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default FileUploadForm;
