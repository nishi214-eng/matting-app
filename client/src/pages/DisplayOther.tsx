import React, { useState, useEffect } from "react";
import { db } from "../infra/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Box, Typography, Grid, IconButton, ImageList, ImageListItem } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { useAuthContext } from '../store/AuthContext';
import { useLocation } from "react-router-dom";
import { sortName } from "../feature/sortName";

// プロフィールオブジェクトの型定義
interface Profile {
  nickName: string;
  gender: string | "";
  userImage: string | "";
  userImage2: string | "";
  age: string | "";
  height: string | "";
  origin: string | "";
  hobby: string;
  drive: string | "";
  annualIncome: string | "";
  smoking: string | "";
  drinking: string | "";
  marriageWant: string | "";
  firstSon: string | "";
}

// 相手のオブジェクト
interface Matting {
  name: string | "";
  count1: number;
  count2: number;
}

const DisplayOther: React.FC = () => {
  const { user } = useAuthContext();
  const location = useLocation();
  const { partnerName } = location.state || { partnerName: '名称未設定' };

  const [matting, setMatti] = useState<Matting>({ name: user?.displayName as string, count1: 0, count2: 0 });
  const [profile, setProfile] = useState<Profile>({
    nickName: partnerName, gender: "", age: "", height: "",
    userImage: "", userImage2: "", origin: "", hobby: "",
    drive: "", annualIncome: "", smoking: "", drinking: "",
    marriageWant: "", firstSon: ""
  });

  // 現在表示中の画像インデックス
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // プロフィール画像のリスト
  const images = [profile.userImage, profile.userImage2].filter((img) => img !== "");

  useEffect(() => {
    const fetchProfiles = async () => {
      const profileDocRef = doc(db, "profiles", profile.nickName);
      const dataDocRef = doc(profileDocRef, "profile", "data");
      const querySnapshot = await getDoc(dataDocRef);
      const profilesData: Profile = querySnapshot.data() as Profile;
      setProfile(profilesData);

      const combineName = sortName(profile.nickName, matting.name);
      const mattingDoc = doc(db, "chatroom", combineName[0] + "_" + combineName[1]);
      const mattingDocRef2 = doc(mattingDoc, "chatcount", "count2");
      const mattingquerySnapshot2 = await getDoc(mattingDocRef2);
      const getCount2 = mattingquerySnapshot2.data()?.count;
      setMatti({ ...matting, count2: getCount2 as number });
    };
    fetchProfiles();
  }, []);

  // 画像切り替えのハンドラー
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <Box sx={{
      maxWidth: "600px",
      margin: "0 auto",
      padding: "16px",
      backgroundColor: "#f7f7f7",
      borderRadius: "16px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
    }}>
      <Typography
        variant="h5"
        sx={{ textAlign: "center", fontWeight: "bold", marginBottom: "16px", color: "#333" }}
      >
        {partnerName}
      </Typography>
      {/* 画像スライダー */}
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "24px"
      }}>
        {images.length > 0 ? (
          <>
           <ImageList cols={1} sx={{ width: "100%", maxWidth: 300 }}>
              <ImageListItem key={currentImageIndex}>
                <img
                  src={images[currentImageIndex] || "/images/noimage.png"}
                  alt={`profile-${currentImageIndex}`}
                  style={{
                    borderRadius: '8px',
                    objectFit: 'contain', // 画像全体を表示する
                    width: '100%',       // 幅を親要素に合わせる
                    height: 'auto'      // 固定高さ
                  }}
                />
              </ImageListItem>
            </ImageList>
            <Box sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              marginTop: "16px"
            }}>
              <IconButton onClick={handlePrevImage} aria-label="前の画像">
                <ArrowBackIos />
              </IconButton>
              <IconButton onClick={handleNextImage} aria-label="次の画像">
                <ArrowForwardIos />
              </IconButton>
            </Box>
          </>
        ) : (
          <Typography variant="body1">画像がありません</Typography>
        )}
      {/* プロフィール情報 */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="subtitle1" fontWeight="bold">ニックネーム:</Typography>
          <Typography variant="body1">{profile.nickName || "未入力"}</Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="subtitle1" fontWeight="bold">性別:</Typography>
          <Typography variant="body1">{profile.gender || "未入力"}</Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="subtitle1" fontWeight="bold">年齢:</Typography>
          <Typography variant="body1">{profile.age || "未入力"}</Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="subtitle1" fontWeight="bold">身長:</Typography>
          <Typography variant="body1">{profile.height || "未入力"}</Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="subtitle1" fontWeight="bold">出身:</Typography>
          <Typography variant="body1">{profile.origin || "未入力"}</Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="subtitle1" fontWeight="bold">趣味:</Typography>
          <Typography variant="body1">{profile.hobby || "未入力"}</Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="subtitle1" fontWeight="bold">年収:</Typography>
          <Typography variant="body1">{profile.annualIncome || "未入力"}</Typography>
        </Box>
      </Box>

      </Box>
    </Box>
  );
};

export default DisplayOther;
