import React, { useState, useEffect } from "react";
import { db } from "../infra/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { sortName } from "../feature/sortName";
import { Box, TextField, Typography } from "@mui/material";

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
//相手のオブジェクト
interface Matting {
  name: string | "";
  count1: number;
  count2: number;
};

const DisplayOther: React.FC = () => {
    //他ユーザの名前を受け取る。この人を表示することになる
    const otherUserName = "花山薫";
    const [matting, setMatti] = useState<Matting>({name: "佐藤次郎", count1:0, count2:0});
    //プロフィール
    const [profile, setProfile] = useState<Profile>({nickName: otherUserName, gender :  "", age: "", height :  "",
        userImage: "", userImage2: "",origin: "", hobby: "" , drive :  "", annualIncome :  "", smoking :  "",
        drinking :  "", marriageWant :  "", firstSon :  ""});

    //DBからもらってきてデータを格納し、画面をレンダリング
    useEffect(() => {
      const fetchProfiles = async () => {
        // profiles コレクション内の profileNickName ドキュメントを参照
        const profileDocRef = doc(db, "profiles", profile.nickName);
        // そのドキュメント内の "profile" サブコレクションの "data" ドキュメントを参照
        const dataDocRef = doc(profileDocRef, "profile", "data");
        const querySnapshot = await getDoc(dataDocRef);
        const profilesData: Profile = querySnapshot.data() as Profile;
        setProfile(profilesData);
        
        // チャットルームに
        const combineName = sortName(profile.nickName, matting.name);
        const mattingDoc = doc(db, "chatroom", combineName[0] + "_" + combineName[1]);

        //カウント1
        //const mattingDocRef1 = doc(mattingDoc, "chatcount", "count1");
        //const mattingquerySnapshot1 = await getDoc(mattingDocRef1);
        //let getCount1 = mattingquerySnapshot1.data()?.count;
        //setMatti({...matting, count1: getCount1 as number});

        const mattingDocRef2 = doc(mattingDoc, "chatcount", "count2");
        const mattingquerySnapshot2 = await getDoc(mattingDocRef2);
        const getCount2 = mattingquerySnapshot2.data()?.count;
        setMatti({...matting, count2: getCount2 as number});
      };
      fetchProfiles();
    }, []);

    //フォームの選択肢の入力があった場合
    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfile({...profile, [id] : value});
    };

    return(
    <div>
      <Box sx={{
            maxWidth: "600px",
            margin: "0 auto",
            padding: "16px",
            backgroundColor: "#f7f7f7",
            borderRadius: "16px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}>
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
        あなたのプロフィール
      </Typography>
      <TextField id="nikcName" label="ニックネーム" value={profile.nickName} sx={{ m: 1, minWidth: 120, width: 250 }} size="small"
          onChange={handleChange}
          slotProps={{
            input: {
            readOnly: true,
            },
          }}
      />
      <br />
      <TextField id="gender" label="性別" value={profile.gender} sx={{ m: 1, minWidth: 120, width: 250 }} size="small"
        onChange={handleChange}
        slotProps={{
          input: {
          readOnly: true,
          },
        }}
      />
      <br />
      <TextField id="age" label="年齢" value={profile.age} sx={{ m: 1, minWidth: 120, width: 250 }} size="small"
        onChange={handleChange}
        slotProps={{
          input: {
          readOnly: true,
          },
        }}
      />
      <br />
      <TextField id="height" label="身長" value={profile.height} sx={{ m: 1, minWidth: 120, width: 250 }} size="small"
        onChange={handleChange}
        slotProps={{
          input: {
          readOnly: true,
          },
        }}
      />
      <br />
      <Typography variant="body1" component="h6" mt={1} gutterBottom>アイコン画像1</Typography>
      {profile.userImage !== "" && (
          <img src={profile.userImage} alt="selected" style={{ height: '300px', width: '300px' }} />
      )}
      {profile.userImage === "" && (
        <Typography variant="body1" component="h3" mt={1} gutterBottom>未入力</Typography>
      )}
      <br />
      <Typography variant="body1" component="h6" mt={1} gutterBottom>アイコン画像2</Typography>
      {(profile.userImage2 !== "" && matting.count1 >= 3 && matting.count2 >= 3) && (
          <img src={profile.userImage2} alt="selected" style={{ height: '300px', width: '300px' }} />
      )}
      {((profile.userImage2 === "" && matting.count1 < 3 && matting.count2 < 3) &&
        <Typography variant="body1" component="h3" mt={1} gutterBottom>未入力</Typography>
      )}
      <br />
      <TextField id="origin" label="出身" value={profile.origin} sx={{ m: 1, minWidth: 120, width: 250 }} size="small"
      onChange={handleChange}
      slotProps={{
        input: {
        readOnly: true,
        },
      }}
      />
      <br />
      <TextField id="hobby" label="趣味" value={profile.hobby} sx={{ m: 1, minWidth: 120, width: 250 }} size="small"
      onChange={handleChange}
      slotProps={{
        input: {
        readOnly: true,
        },
      }}
      />
      <br />
      <TextField id="drive" label="運転するか" value={profile.drive} sx={{ m: 1, minWidth: 120, width: 250 }} size="small"
      onChange={handleChange}
      slotProps={{
        input: {
        readOnly: true,
        },
      }}
      />
      <br />
      <TextField id="annualIncome" label="年収" value={profile.annualIncome} sx={{ m: 1, minWidth: 120, width: 250 }} size="small"
      onChange={handleChange}
      slotProps={{
        input: {
        readOnly: true,
        },
      }}
      />
      <br />
      <TextField id="smoking" label="喫煙" value={profile.smoking} sx={{ m: 1, minWidth: 120, width: 250 }} size="small"
      onChange={handleChange}
      slotProps={{
        input: {
        readOnly: true,
        },
      }}
      />
      <br />
      <TextField id="drinking" label="飲酒" value={profile.drinking} sx={{ m: 1, minWidth: 120, width: 250 }} size="small"
      onChange={handleChange}
      slotProps={{
        input: {
        readOnly: true,
        },
      }}
      />
      <br />
      <TextField id="marriageWant" label="結婚願望" value={profile.marriageWant} sx={{ m: 1, minWidth: 120, width: 250 }} size="small"
      onChange={handleChange}
      slotProps={{
        input: {
        readOnly: true,
        },
      }}
      />
      <br />
      <TextField id="firstSon" label="長男かどうか" value={profile.firstSon} sx={{ m: 1, minWidth: 120, width: 250 }} size="small"
      onChange={handleChange}
      slotProps={{
        input: {
        readOnly: true,
        },
      }}
      />
      <br />
      </Box>
      <div className="linkItem">
        <Link to={"/ProfileForm"} >
            プロフィール更新
        </Link>
      </div>
    </div>
      
  );
};


export default DisplayOther;