import React, { useState } from "react";
import { db } from "../infra/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {uploadFile} from "../feature/uploadFile";
import { useAuthContext } from '../store/AuthContext';
import NaviButtons from '../components/NavigationButtons';
import { Button, Box,Typography, TextField, MenuItem, FormControl, InputLabel } from "@mui/material";
import { updateProfile } from "firebase/auth";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { MuiFileInput } from 'mui-file-input';


//プロフィールオブジェクトの型定義。プロフィールの項目はこちらから
interface Profile {
    nickName: string;
    gender : string |  "";
    userImage: string | "";
    userImage2: string | "";
    age: string | "";
    height : string |  "";
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
    const age = [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
        41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60];
    const gender = [ "未回答", "男", "女"];
    const height = [140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200];
    const annualIncome = ["200万", "300万","400万","500万", "600万", 
        "700万", "800万", "900万", "1000万以上"];
    const yesNo = ["はい", "いいえ"];
    const doDont= ["する", "しない"];
    const exist = ["ある", "なし"];
    const drive = ["しない", "車", "バイク", "どちらも"];
    const prefectures = 
    ["北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県", "茨城県", "栃木県", "群馬県",
        "埼玉県", "千葉県", "東京都", "神奈川県", "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県",
        "岐阜県", "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
        "鳥取県", "島根県", "岡山県", "広島県", "山口県", "徳島県", "香川県", "愛媛県", "高知県", "福岡県",
        "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"];


    const [image, setImage] = useState<File | null>(null);//アイコンイメージ
    const [image2, setImage2] = useState<File | null>(null);//アイコンイメージ
    const [imageUrl, setImageUrl] = useState<string | null>(null);//仮置き、入力されたアイコン画像
    const [imageUrl2, setImageUrl2] = useState<string | null>(null);//仮置き、入力されたアイコン画像

    //フォームにイメージの入力があった場合
    const handleSetImage3 = (newFile: File | null) => {
        if(newFile == null){
            const url = "";
            setImageUrl(url);//入力イメージの表示
        }else {
            const url = URL.createObjectURL(newFile);
            setImageUrl(url);//入力イメージの表示
        }
        setImage(newFile);
    };
    //フォームにイメージの入力があった場合・その2
    const handleSetImage4 = (newFile: File | null) => {
        if(newFile == null){
            const url = "";
            setImageUrl2(url);//入力イメージの表示
        }else {
            const url = URL.createObjectURL(newFile);
            setImageUrl2(url);//入力イメージの表示
        }
        setImage2(newFile);
    };
    //フォームの選択肢の入力があった場合
    const handleOptionChange = (event : SelectChangeEvent) => {
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
                    setProfile({...profile, userImage : url as string});//結果のURLをプロフィールに追加
                }
                if(image2){
                    const url = await uploadFile(image2, user?.email as string, 'profile'); // features/uploadFile.tsの関数を使用
                    console.log('Image uploaded successfully:', url);
                    setProfile({...profile, userImage2 : url as string});//結果のURLをプロフィールに追加
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
            <TextField id="nikcName" label="ニックネーム" value={profile.nickName}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => { setProfile({...profile, nickName : event.target.value});}}
            />
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="gender-select-small-label">性別</InputLabel>
                <Select
                    labelId="gender-select-small-label" name="gender" value={profile.gender} label="Gender"
                    onChange={handleOptionChange}>
                    <MenuItem value=""><em></em></MenuItem>
                    {gender.map((name) => (
                        <MenuItem key={name} value={name}>{name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="age-select-small-label">年齢</InputLabel>
                <Select
                    labelId="age-select-small-label" name="age" value={profile.age} label="Age"
                    onChange={handleOptionChange}>
                    <MenuItem value=""><em></em></MenuItem>
                    {age.map((name) => (
                        <MenuItem key={name} value={name}>{name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="height-select-small-label">身長</InputLabel>
                <Select
                    labelId="height-select-small-label" name="height" value={profile.height} label="Hright"
                    onChange={handleOptionChange}>
                    <MenuItem value=""><em></em></MenuItem>
                    {height.map((name) => (
                        <MenuItem key={name} value={name}>{name}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Typography variant="body1" component="h6" mt={1} gutterBottom>アイコン画像1・選択</Typography>
            <MuiFileInput value={image} onChange={handleSetImage3} variant="outlined" />
            <br />
            <Typography variant="caption" component="div" gutterBottom>PNG/JPEG/GIF ファイルのみ、ファイルサイズは5MB以内。</Typography>
            {(image) && !(image.type === "image/png" || image.type === "image/jpeg" || image.type === "image/gif") && (
            <Typography variant="caption" component="div" color="error.main" gutterBottom>このファイルタイプはサポートしていません。</Typography>
            )}
            {imageUrl && (
                <div>
                    <img src={imageUrl} alt="selected" style={{ height: '300px', width: '300px' }} />
                    <button onClick={handleReset}>Reset</button>
                </div>
            )}

            <Typography variant="body1" component="h6" mt={1} gutterBottom>アイコン画像2・選択</Typography>
            <MuiFileInput value={image2} onChange={handleSetImage4} variant="outlined" />
            <br />
            <Typography variant="caption" component="div" gutterBottom>PNG/JPEG/GIF ファイルのみ、ファイルサイズは5MB以内。</Typography>
            {(image2) && !(image2.type === "image/png" || image2.type === "image/jpeg" || image2.type === "image/gif") && (
            <Typography variant="caption" component="div" color="error.main" gutterBottom>このファイルタイプはサポートしていません。</Typography>
            )}
            {imageUrl2 && (
                <div>
                    <img src={imageUrl2} alt="selected" style={{ height: '300px', width: '300px' }} />
                    <button onClick={handleReset2}>Reset</button>
                </div>
            )}

            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="prefecture-select-small-label">出身</InputLabel>
                <Select
                    labelId="prefecture-select-small-label" name="origin" value={profile.origin} label="Origin"
                    onChange={handleOptionChange}>
                    <MenuItem value=""><em></em></MenuItem>
                    {prefectures.map((name) => (
                        <MenuItem key={name} value={name}>{name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField id="hobby" label="趣味" value={profile.hobby}
                 onChange={(event: React.ChangeEvent<HTMLInputElement>) => { setProfile({...profile, hobby : event.target.value});}}
                />
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="drive-select-small-label">運転するか</InputLabel>
                <Select
                    labelId="drive-select-small-label" name="drive" value={profile.drive} label="Drive"
                    onChange={handleOptionChange}>
                    <MenuItem value=""><em></em></MenuItem>
                    {drive.map((name) => (
                        <MenuItem key={name} value={name}>{name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="annualIncome-select-small-label">年収</InputLabel>
                <Select
                    labelId="annualIncome-select-small-label" name="annualIncome" value={profile.annualIncome} label="AnnualIncome"
                    onChange={handleOptionChange}>
                    <MenuItem value=""><em></em></MenuItem>
                    {annualIncome.map((name) => (
                        <MenuItem key={name} value={name}>{name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="smoking-select-small-label">喫煙</InputLabel>
                <Select
                    labelId="smoking-select-small-label" name="smoking" value={profile.smoking} label="smoking"
                    onChange={handleOptionChange}>
                    <MenuItem value=""><em></em></MenuItem>
                    {doDont.map((name) => (
                        <MenuItem key={name} value={name}>{name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="drinking-select-small-label">飲酒</InputLabel>
                <Select
                    labelId="drinking-select-small-label" name="drinking" value={profile.drinking} label="drinking"
                    onChange={handleOptionChange}>
                    <MenuItem value=""><em></em></MenuItem>
                    {doDont.map((name) => (
                        <MenuItem key={name} value={name}>{name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="marriageWant-select-small-label">結婚願望</InputLabel>
                <Select
                    labelId="marriageWant-select-small-label" name="marriageWant" value={profile.marriageWant} label="marriageWant"
                    onChange={handleOptionChange}>
                    <MenuItem value=""><em></em></MenuItem>
                    {exist.map((name) => (
                        <MenuItem key={name} value={name}>{name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="firstSon-select-small-label">長男かどうか</InputLabel>
                <Select
                    labelId="firstSon-select-small-label" name="firstSon" value={profile.firstSon} label="firstSon"
                    onChange={handleOptionChange}>
                    <MenuItem value=""><em></em></MenuItem>
                    {yesNo.map((name) => (
                        <MenuItem key={name} value={name}>{name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button variant = "contained" type = "submit">送信</Button>
            <NaviButtons/>
        </form>
        </Box>
    );
};


export default ProfileForm;