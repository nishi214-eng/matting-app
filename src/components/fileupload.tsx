import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../infra/firebase'; // Firebase Storage を初期化したファイルのパスを指定
import { v4 as uuidv4 } from 'uuid';

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);

  // ファイル選択ハンドラー
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    } else {
      setFile(null);
      setFileName('');
    }
  };

  // ファイルアップロード処理
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) return;

    setUploading(true);
    const fileRef = ref(storage, `uploads/${uuidv4()}_${file.name}`); // ユニークなファイル名にする

    try {
      // Firebase Storageにファイルをアップロード
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      setDownloadURL(url); // アップロード完了後のURLを取得
      console.log('ファイルアップロード成功:', url);
    } catch (error) {
      console.error('ファイルアップロードエラー:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h2>ファイルアップロード</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>画像ファイルをアップロード:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        {fileName && <p>選択されたファイル: {fileName}</p>}
        <button type="submit" disabled={uploading}>
          {uploading ? 'アップロード中...' : 'アップロード'}
        </button>
      </form>
      {downloadURL && (
        <div>
          <p>アップロードされたファイルのURL:</p>
          <a href={downloadURL} target="_blank" rel="noopener noreferrer">{downloadURL}</a>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
