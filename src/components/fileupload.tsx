import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../infra/firebase'; 
import { v4 as uuidv4 } from 'uuid';
import { Button, CircularProgress, TextField, Typography, Box } from '@mui/material';
import { Link, Navigate } from 'react-router-dom';
import "../style/auth.css";

interface FileUploadForm {
  file: FileList;
}

export const FileUpload: React.FC = () => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);
  const [redirect, setRedirect] = useState<boolean>(false); // リダイレクト状態管理

  // React Hook Formの使用
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FileUploadForm>();

  // ファイルアップロード処理
  const onSubmit: SubmitHandler<FileUploadForm> = async (data) => {
    const file = data.file[0];
    if (!file) return;

    setUploading(true);
    const fileRef = ref(storage, `uploads/${uuidv4()}_${file.name}`);

    try {
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      setDownloadURL(url);
      setRedirect(true); // アップロード成功時にリダイレクトフラグをセット
      reset();
    } catch (error) {
      console.error('ファイルアップロードエラー:', error);
    } finally {
      setUploading(false);
    }
  };

  // リダイレクトの処理
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
                <label htmlFor="file" className="subsection_title">
                  アップロードするファイル
                </label>
                <div className="text_field">
                  <TextField
                    id="file"
                    type="file"
                    fullWidth
                    variant="outlined"
                    inputProps={{
                      accept: 'image/*',
                    }}
                    sx={{
                      backgroundColor: 'white',
                      '& .MuiInputBase-input': {
                        height: '100%',
                        padding: '10px',
                        border: '0px',
                      },
                      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#96C78C', // フォーカス時のボーダー色
                      },
                    }}
                    {...register("file", {
                      required: "ファイルは必須です",
                    })}
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
                  '&:hover': {
                    backgroundColor: '98C78C',
                  },
                }}
                disabled={uploading}
              >
                {uploading ? <CircularProgress size={24} /> : 'アップロード'}
              </Button>
            </div>

            {downloadURL && (
              <div className="linkItem">
                <Typography variant="body1">
                  アップロードされたファイルのURL:
                </Typography>
                <a href={downloadURL} target="_blank" rel="noopener noreferrer">{downloadURL}</a>
              </div>
            )}

            <div className="linkItem">
              <ul>
                <li>
                  <Link to="/">ログイン</Link>
                </li>
              </ul>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default FileUpload;
