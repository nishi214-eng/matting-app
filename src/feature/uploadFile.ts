// features/uploadFile.ts
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../infra/firebase';
import { v4 as uuidv4 } from 'uuid';

export const uploadFile = async (file: File, userId: string, uploadType: 'license' | 'icon' | 'profile'): Promise<string | null> => {
  if (!file) return null;

  const fileRef = ref(storage, `uploads/${userId}/${uploadType}/${uuidv4()}_${file.name}`); // ユーザーIDとアップロードタイプに基づいてパスを作成

  try {
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  } catch (error) {
    console.error('File upload error:', error);
    throw new Error('File upload failed');
  }
};
