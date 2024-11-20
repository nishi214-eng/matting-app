import React, { useState } from "react";
import { db } from "../infra/firebase";
import { collection, addDoc } from "firebase/firestore";
import {uploadFile} from "../feature/uploadFile";
import { useAuthContext } from '../store/AuthContext';

//プロフィールオブジェクトの型定義。プロフィールの項目はこちらから
interface Profile {
    id : string | null | undefined;
    nickName: string;
    age: number;
    userImage: string | null;
    userImage2: string | null;
    origin: string;
    hobby: string;
};

const ProfileForm: React.FC = () => {
    //プロフィール
    const [profile, setProfile] = useState<Profile>
    ({id: "", nickName: "", age: 0, userImage: "", userImage2: "",
        origin: "", hobby: "" });
    const {user} = useAuthContext(); 


    
    const [image, setImage] = useState<File | null>(null);//アイコンイメージ
    const [image2, setImage2] = useState<File | null>(null);//アイコンイメージ
    const [imageUrl, setImageUrl] = useState<string | null>(null);//仮置き、入力されたアイコン画像
    const [imageUrl2, setImageUrl2] = useState<string | null>(null);//仮置き、入力されたアイコン画像

    //フォームに入力があると、入力内容を取得
    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile({...profile, [name] : value});
    };
    //フォームにイメージの入力があった場合
    const handleSetImage = (e : React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files){
            setImage(e.target.files[0]);
            const url = URL.createObjectURL(e.target.files[0]);
            setImageUrl(url);//入力イメージの表示
        }
    };
    //フォームにイメージの入力があった場合・その2
    const handleSetImage2 = (e : React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files){
            setImage2(e.target.files[0]);
            const url = URL.createObjectURL(e.target.files[0]);
            setImageUrl2(url);//入力イメージの表示
        }
    };


    //入力イメージのリセット
    const handleReset =() => {
        setImage(null);
        setImageUrl(null);
    };
    //入力イメージのリセット・その2
    const handleReset2 =() => {
        setImage2(null);
        setImageUrl2(null);
    };

    //送信ボタンを押した時の処理
    const handleSubmit = async (e : React.FormEvent ) => {
        e.preventDefault(); //フォームに対するユーザーからの操作を阻止
        try {
            //イメージのアップロードがあるなら
            if(image){
                const url = await uploadFile(image, user?.email as string, 'profile'); // features/uploadFile.tsの関数を使用
                console.log('Image uploaded successfully:', url);
                setProfile({...profile, userImage : url});//結果のURLをプロフィールに追加
            }
            if(image2){
                const url = await uploadFile(image2, user?.email as string, 'profile'); // features/uploadFile.tsの関数を使用
                console.log('Image uploaded successfully:', url);
                setProfile({...profile, userImage2 : url});//結果のURLをプロフィールに追加
            }
            setProfile({...profile, id : user?.email});
            await addDoc(collection( db, "profiles" ), profile);    //firebaseのFireStoreにプロフィールをぶちこむ
            console.log('Profile saved successfully');
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
                <label>userImage:
                <input type="file" onChange={handleSetImage} />
                    {imageUrl && (
                        <div>
                            <img src={imageUrl} alt="selected" style={{ height: '300px', width: '300px' }} />
                            <button onClick={handleReset}>Reset</button>
                        </div>
                    )}
                </label>
            </div>
            <div>
                <label>userImage2:
                <input type="file" onChange={handleSetImage2} />
                    {imageUrl2 && (
                        <div>
                            <img src={imageUrl2} alt="selected" style={{ height: '300px', width: '300px' }} />
                            <button onClick={handleReset2}>Reset</button>
                        </div>
                    )}
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