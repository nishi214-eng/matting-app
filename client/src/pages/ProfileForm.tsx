import React, { useState } from "react";
import { db } from "../infra/firebase";
import { doc, collection, setDoc, getDoc } from "firebase/firestore";
import {uploadFile} from "../feature/uploadFile";
import { useAuthContext } from '../store/AuthContext';
import NaviButtons from '../components/NavigationButtons';
import { Box,Typography,Select } from "@mui/material";
import { updateProfile } from "firebase/auth";


//プロフィールオブジェクトの型定義。プロフィールの項目はこちらから
interface Profile {
    nickName: string;
    gender : string |  "";
    userImage: string | null;
    userImage2: string | null;
    age: number | "";
    height : number |  "";
    origin: string | "";
    hobby: string;
    drive: string |  "";
    annualIncome : string |  "";
    smoking : string |  "";
    drinking : string |  "";
    marriageWant : string |  "";
    firstSon : string |  "";
};

const ProfileForm: React.FC = () => {
    //プロフィール
    const [profile, setProfile] = useState<Profile>({nickName: "", gender :  "", age: "", height :  "",
        userImage: "", userImage2: "",origin: "", hobby: "" , drive :  "", annualIncome :  "", smoking :  "",
        drinking :  "", marriageWant :  "", firstSon :  ""});
    const {user} = useAuthContext(); 
    //入力の際の候補
    const age = [ , 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
        41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60
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
    const prefectures = 
    ["", "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県", "茨城県", "栃木県", "群馬県",
        "埼玉県", "千葉県", "東京都", "神奈川県", "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県",
        "岐阜県", "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
        "鳥取県", "島根県", "岡山県", "広島県", "山口県", "徳島県", "香川県", "愛媛県", "高知県", "福岡県",
        "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"];


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
                // display nameを更新
                if(user){
                    await updateProfile(user, {
                        displayName:profile.nickName, // 新しいユーザーネーム
                    }).then(() => {
                    console.log("Display name updated successfully!");
                    }).catch((error) => {
                    console.error("Error updating display name:", error);
                    });
                } else {
                    console.log("No user is signed in.");
                }
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
                // profiles コレクション内の profileNickName ドキュメントを参照
                const profileDocRef = doc(db, "profiles", profile.nickName);

                // そのドキュメント内の "profile" サブコレクションの "data" ドキュメントを参照
                const dataDocRef = doc(profileDocRef, "profile", "data");

                // "data" ドキュメントに profile のデータをセット
                await setDoc(dataDocRef, profile);

                console.log('Profile saved successfully');
            } catch(error){
                console.error('Error saving Profile: ', error);
            }
        }
    }

    return(
        <Box
            sx={{
                maxWidth: "600px",
                margin: "0 auto",
                padding: "16px",
                backgroundColor: "#f7f7f7",
                borderRadius: "16px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
        >
            <Typography
                variant="h5"
                gutterBottom
                sx={{
                    textAlign: "center",
                    marginBottom: "16px",
                    fontWeight: "bold",
                    color: "#333",
                }}
            >
                プロフィール編集
            </Typography>
        <form onSubmit={handleSubmit}>
            <div>
                <label>
                ニックネーム:
                <input type="text" name="nickName" value={profile.nickName} onChange={handleChange}/>
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
                    {profile.gender !=  ""&& <p>性別: {profile.gender}</p>}
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
                    {profile.age && <p>選択された年齢: {profile.age}</p>}
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
                    {profile.height !=  "" && <p>選択された身長: {profile.height}</p>}
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
                    <select name="origin" value={profile.origin} onChange={handleOptionChange}>
                        <option value="" disabled>選択してください</option>
                        {prefectures.map(origin => (
                            <option key={origin} value={origin}>{origin}</option>
                        ))}
                    </select>
                    {profile.origin !=  "" && <p>運転するか: {profile.origin}</p>}
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
                    {profile.drive !=  "" && <p>運転するか: {profile.drive}</p>}
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
                    {profile.annualIncome !=  "" && <p>年収: {profile.annualIncome}</p>}
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
                    {profile.smoking !=  "" && <p>喫煙: {profile.smoking}</p>}
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
                    {profile.drinking !=  "" && <p>飲酒: {profile.drinking}</p>}
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
                    {profile.marriageWant !=  "" && <p>結婚願望: {profile.marriageWant}</p>}
                </label>
            </div>
            <div>
                <label>長男:
                    <select name="firstSon" value={profile.firstSon} onChange={handleOptionChange}>
                        <option value="" disabled>選択してください</option>
                        {yesNo.map(yesNo => (
                            <option key={yesNo} value={yesNo}>{yesNo}</option>
                        ))}
                    </select>
                    {profile.firstSon !=  "" && <p>長男: {profile.firstSon}</p>}
                </label>
            </div>
            <button type = "submit">Submit</button>
            <NaviButtons/>
        </form>
        </Box>
    );
};


export default ProfileForm;