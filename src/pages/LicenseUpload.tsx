// src/components/LicenseUpload.tsx
import React, { useState } from "react";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { storage } from "./infra/firebase";

const LicenseUpload: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  // ファイルが選択された時に呼び出される
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setImageFile(file);
  };

  // Firebase Storageに画像をアップロードする
  const handleUpload = async () => {
    if (imageFile) {
      const storageRef = ref(storage, `licenses/license_${Date.now()}_${imageFile.name}`);
      try {
        await uploadBytes(storageRef, imageFile);
        setUploadStatus("画像が正常にアップロードされました");
      } catch (error) {
        console.error("アップロードエラー:", error);
        setUploadStatus("画像のアップロードに失敗しました");
      }
    } else {
      setUploadStatus("画像ファイルを選択してください");
    }
  };

  return (
    <div>
      <h2>運転免許証をアップロードしてください</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>アップロード</button>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

export default LicenseUpload;
