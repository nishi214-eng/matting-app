import React, { useState } from "react";
import { db, storage } from "./infra/firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, getStorage, uploadBytes, getDownloadURL} from "firebase/storage";

//プロフィールオブジェクトの型定義。プロフィールの項目はこちらから
interface Profile {
    nickName: string;
    age: number;
    userImage: string;
    origin: string;
    hobby: string;
};

const ProfileForm: React.FC = () => {
    //入力されているプロフィールのデータ,入力で変化があると画面を再レンダリングする
    const [profile, setProfile] = useState<Profile>
    ({nickName: "", age: 0, userImage: "", 
        origin: "", hobby: "" });
    //アイコンイメージ
    const [image, setImage] = useState<File | null>(null);
    //ストレージにぶち込んだイメージのURL
    const [url, setUrl] = useState<string | null>(null);

    //フォームに入力があると、入力内容を取得
    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile({...profile, [name] : value});
        //イメージの変更なら
        /*
        if(e.target.files){
            setImage(e.target.files);
        }
        */
    };

    //送信ボタンを押した時の処理
    const handleSubmit = async (e : React.FormEvent ) => {
        e.preventDefault(); //フォームに対するユーザーからの操作を阻止
        try {
            //addDoc には await 必要。
            await addDoc(collection( db, "profiles" ), profile);    //firebaseのFireStoreにプロフィールをぶちこむ
            console.log('Profile saved successfully');
            //イメージのアップロードがあるなら
            /*
            if(image){
                const storageRef = ref(storage, 'images/${image.name}');
                await uploadBytes(storageRef, image);
                const downloadURL = await getDownloadURL(storageRef);
                setUrl(downloadURL);
                console.log('Image uploaded successfully:', downloadURL);
            }
            */
        } catch(error){
            console.error('Error saving Profile: ', error);
        }
    }

    return(
        <form onSubmit={handleSubmit}>
            <div>
                <label>nickName:
                    <input type="text" name="name" value={profile.nickName} onChange={handleChange} />
                </label>
            </div>
            <div>
                <label>Age:
                    <input type="number" name="age" value={profile.age} onChange={handleChange} />
                </label>
            </div>
            <div>
                <label>Origin:
                    <input type="text" name="origin" value={profile.origin} onChange={handleChange} />
                </label>
            </div>
            <div>
                <label>Hobby:
                    <input type="text" name="hobby" value={profile.hobby} onChange={handleChange} />
                </label>
            </div>
            <button type = "submit">Submit</button>
        </form>
    );
};


export default ProfileForm;