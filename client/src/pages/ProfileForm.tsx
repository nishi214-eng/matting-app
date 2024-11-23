import React, { useState } from "react";
import { db } from "../infra/firebase";
import { doc, collection, setDoc, getDoc } from "firebase/firestore";
import {uploadFile} from "../feature/uploadFile";
import { useAuthContext } from '../store/AuthContext';
import { Select } from "@mui/material";

//プロフィールオブジェクトの型定義。プロフィールの項目はこちらから
interface Profile {
    nickName: string;
    gender : string | undefined;
    userImage: string | null;
    userImage2: string | null;
    age: number | undefined;
    height : number | undefined;
    origin: string;
    hobby: string;
    drive: string | undefined;
    annualIncome : string | undefined;
    smoking : string | undefined;
    drinking : string | undefined;
    marriageWant : string | undefined;
    firstSon : string | undefined;
};

const ProfileForm: React.FC = () => {
    //プロフィール
    const [profile, setProfile] = useState<Profile>
    ({nickName: "", gender : undefined, age: undefined, height : undefined, 
        userImage: "", userImage2: "",origin: "", hobby: "" , drive : undefined, annualIncome : undefined, 
        smoking : undefined, drinking : undefined, marriageWant : undefined, firstSon : undefined});
    const {user} = useAuthContext(); 
    //入力の際の候補
    const age = [ , 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
        42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60
    ];
    const gender = [ "", "男", "女", "未回答"];
    const height = [ , 140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200];
    const annualIncome = ["", "200万", "300万","400万","500万", "600万", 
        "700万", "800万", "900万", "1000万以上"
    ];
    const yesNo = ["", "はい", "いいえ"];
    const doDont= ["", "する", "しない"];
    const exist = ["", "ある", "なし"];
    const drive = ["", "しない", "車", "バイク", "どちらも"];

    const [image, setImage] = useState<File | null>(null);//アイコンイメージ
    const [image2, setImage2] = useState<File | null>(null);//アイコンイメージ
    const [imageUrl, setImageUrl] = useState<string | null>(null);//仮置き、入力されたアイコン画像
    const [imageUrl2, setImageUrl2] = useState<string | null>(null);//仮置き、入力されたアイコン画像

    //フォームに通常の入力があった場合
    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile({...profile, [name] : value});
    };
    //フォームにイメージの入力があった場合
    const handleSetImage = (e : React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files){
            setImage(e.target.files[0]);
            if(e.target.files[0] == null){
                const url = "";
                setImageUrl(url);//入力イメージの表示
            }else {
                const url = URL.createObjectURL(e.target.files[0]);
                setImageUrl(url);//入力イメージの表示
            }
        }
    };
    //フォームにイメージの入力があった場合・その2
    const handleSetImage2 = (e : React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files){
            setImage2(e.target.files[0]);
            if(e.target.files[0] == null){
                const url = "";
                setImageUrl2(url);//入力イメージの表示
            }else {
                const url = URL.createObjectURL(e.target.files[0]);
                setImageUrl2(url);//入力イメージの表示
            }
        }
    };
    //フォームの数字入力があった場合
    const handleNumberChange = (event : React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.target;
        setProfile({...profile, [name] : value});
    };
    //フォームの選択肢の入力があった場合
    const handleOptionChange = (event : React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.target;
        setProfile({...profile, [name] : value});
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
        const profileDocRef = doc(db, 'profiles', profile.nickName);
        const profileDoc = await getDoc(profileDocRef);
        if(profileDoc.exists()){
            alert("そのニックネームは既に使用されています");
        }else{
            //try以下を追加
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
                await setDoc(doc( db, "profiles", profile.nickName ), profile);//firebaseのFireStoreにプロフィールをぶちこむ
                console.log('Profile saved successfully');
            } catch(error){
                console.error('Error saving Profile: ', error);
            }
        }
    }

    return(
        <form onSubmit={handleSubmit}>
            <div>
                <label>ニックネーム:
                    <input type="text" name="nickName" value={profile.nickName} onChange={handleChange} />
                </label>
            </div>
            <div>
                <label>性別:
                    <select name="gender" value={profile.gender} onChange={handleOptionChange}>
                        <option value="" disabled>選択してください</option>
                        {gender.map(gender => (
                            <option key={gender} value={gender}>{gender}</option>
                        ))}
                    </select>
                    {profile.gender != undefined && <p>性別: {profile.gender}</p>}
                </label>
            </div>
            <div>
                <label>年齢:
                    <select name="age" value={profile.age} onChange={handleNumberChange}>
                        <option value="" disabled>選択してください</option>
                        {age.map(age => (
                            <option key={age} value={age}>{age}</option>
                        ))}
                    </select>
                    {profile.age != undefined && <p>選択された年齢: {profile.age}</p>}
                </label>
            </div>
            <div>
                <label>身長:
                    <select name="height" value={profile.height} onChange={handleNumberChange}>
                        <option value="" disabled>選択してください</option>
                        {height.map(height => (
                            <option key={height} value={height}>{height}</option>
                        ))}
                    </select>
                    {profile.height != undefined && <p>選択された身長: {profile.height}</p>}
                </label>
            </div>
            <div>
                <label>アイコン:
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
                <label>アイコン2:
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
                <label>出身:
                    <input type="text" name="origin" value={profile.origin} onChange={handleChange} />
                </label>
            </div>
            <div>
                <label>趣味:
                    <input type="text" name="hobby" value={profile.hobby} onChange={handleChange} />
                </label>
            </div>
            <div>
                <label>運転するか:
                    <select name="drive" value={profile.drive} onChange={handleOptionChange}>
                        <option value="" disabled>選択してください</option>
                        {drive.map(drive => (
                            <option key={drive} value={drive}>{drive}</option>
                        ))}
                    </select>
                    {profile.drive != undefined && <p>運転するか: {profile.drive}</p>}
                </label>
            </div>
            <div>
                <label>年収:
                    <select name="annualIncome" value={profile.annualIncome} onChange={handleOptionChange}>
                        <option value="" disabled>選択してください</option>
                        {annualIncome.map(annualIncome => (
                            <option key={annualIncome} value={annualIncome}>{annualIncome}</option>
                        ))}
                    </select>
                    {profile.annualIncome != undefined && <p>年収: {profile.annualIncome}</p>}
                </label>
            </div>
            <div>
                <label>喫煙:
                    <select name="smoking" value={profile.smoking} onChange={handleOptionChange}>
                        <option value="" disabled>選択してください</option>
                        {doDont.map(doDont => (
                            <option key={doDont} value={doDont}>{doDont}</option>
                        ))}
                    </select>
                    {profile.smoking != undefined && <p>喫煙: {profile.smoking}</p>}
                </label>
            </div>
            <div>
                <label>飲酒:
                    <select name="drinking" value={profile.drinking} onChange={handleOptionChange}>
                        <option value="" disabled>選択してください</option>
                        {doDont.map(doDont => (
                            <option key={doDont} value={doDont}>{doDont}</option>
                        ))}
                    </select>
                    {profile.drinking != undefined && <p>飲酒: {profile.drinking}</p>}
                </label>
            </div>
            <div>
                <label>結婚願望:
                    <select name="marriageWant" value={profile.marriageWant} onChange={handleOptionChange}>
                        <option value="" disabled>選択してください</option>
                        {exist.map(exist => (
                            <option key={exist} value={exist}>{exist}</option>
                        ))}
                    </select>
                    {profile.marriageWant != undefined && <p>結婚願望: {profile.marriageWant}</p>}
                </label>
            </div>
            <div>
                <label>長男:
                    <select name="marriageWant" value={profile.marriageWant} onChange={handleOptionChange}>
                        <option value="" disabled>選択してください</option>
                        {exist.map(yesNo => (
                            <option key={yesNo} value={yesNo}>{yesNo}</option>
                        ))}
                    </select>
                    {profile.firstSon != undefined && <p>長男: {profile.firstSon}</p>}
                </label>
            </div>
            <button type = "submit">Submit</button>
        </form>
    );
};


export default ProfileForm;