
import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Card, CardMedia, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { db } from "../infra/firebase";
import { collection, getDocs, doc, getDoc, addDoc } from "firebase/firestore";
import { useAuthContext } from '../store/AuthContext';
import NaviButtons from '../components/NavigationButtons';
import { AlertContext } from '../store/useSnackber';
import { useContext } from 'react';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ReplyIcon from '@mui/icons-material/Reply';

interface Candidate {
  id: string;
  nickName: string;
  gender: string | "";
  userImage: string | "";
  age: string | "";
  origin: string | "";
}

const MatchingPage: React.FC = () => {
  const { user } = useAuthContext();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  //const [matchedCandidate, setMatchedCandidate] = useState<Candidate | null>(null);
  const [userProfile, setUserProfile] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [skippedCandidates, setSkippedCandidates] = useState<Candidate[]>([]);
  const [waitingCandidates, setWaitingCandidates] = useState<Candidate[]>([]);
  const [openSkipListDialog, setOpenSkipListDialog] = useState<boolean>(false);
  const [openMatchingListDialog, setOpenMatchingListDialog] = useState<boolean>(false);
  const userNickName = user?.displayName as string;
  const [userGender, setUserGender] = useState<string | "">("");
  const { showAlert } = useContext(AlertContext);

  // ユーザーと候補者のデータを取得
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
  
      try {
        const profileDocRef = doc(db, "profiles", userNickName, "profile", "data");
        const profileDoc = await getDoc(profileDocRef);
  
        if (profileDoc.exists()) {
          const profileData = profileDoc.data();
          setUserProfile({
            id: userNickName,
            nickName: profileData.nickName,
            gender: profileData.gender || "",
            userImage: profileData.userImage || "",
            age: profileData.age || "",
            origin: profileData.origin || "",
          });
          setUserGender(profileData.gender || "");
        } else {
          console.error("User profile not found");
        }
      } catch (error) {
        console.error("Error fetching user profile: ", error);
      }
    };
  
    fetchUserProfile();
  }, [user]);
  
  useEffect(() => {
    const fetchCandidates = async () => {
      if (!user) return;
  
      try {
        const querySnapshot = await getDocs(collection(db, "profiles"));
        const fetchedCandidates: Candidate[] = [];
        const skippedList: Candidate[] = [];
        const waitingList: Candidate[] = [];
  
        const skipListSnapshot = await getDocs(collection(db, "profiles", userNickName, "skipList"));
        const skippedCandidates = skipListSnapshot.docs.map((doc) => {
          const data = doc.data(); // ドキュメントのフィールドデータを取得
          return data.nickName || ""; // nickNameのみを返す
        });
        const matchedListSnapshot = await getDocs(collection(db, "profiles", userNickName, "mattingList"));
        const matchedCandidates = matchedListSnapshot.docs.map((doc) => {
          const data = doc.data(); // ドキュメントのフィールドデータを取得
          return data.nickName || ""; // nickNameのみを返す
        });
        for (const docSnapshot of querySnapshot.docs) {
          const candidateId = docSnapshot.id;
      
          if (
            candidateId !== userNickName &&
            !matchedCandidates.includes(candidateId) &&
            !skippedCandidates.includes(candidateId)
          ) {
            const profileDocRef = doc(db, "profiles", candidateId, "profile", "data");
            const profileDoc = await getDoc(profileDocRef);
            if (profileDoc.exists()) {
              const profileData = profileDoc.data();
              const candidate: Candidate = {
                id: candidateId,
                nickName: profileData.nickName,
                gender: profileData.gender || "",
                userImage: profileData.userImage || "",
                age: profileData.age || "",
                origin: profileData.origin || "",
              };
              if (skippedCandidates) {
                skippedList.push(candidate);
              }else if ((userGender === "男" && candidate.gender === "女") || (userGender === "女" && candidate.gender === "男")) {
                waitingList.push(candidate);
                fetchedCandidates.push(candidate);
              }
            }
          }
        }
  
        setCandidates(fetchedCandidates);
        setSkippedCandidates(skippedList);
        setWaitingCandidates(waitingList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching candidates: ", error);
      }
    };
  
    fetchCandidates();
  }, [user, userGender]);
  

  const fetchNextCandidate = async () => {
    if (currentIndex + 1 < candidates.length) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    } else {
      showAlert(`候補者がいません！`, "error");
    }
  };

  const handleMatch = async () => {
    if (!user || !userProfile || !candidates[currentIndex]) return;
    const matched = candidates[currentIndex];

    try {
      await addDoc(collection(db, "profiles", matched.id, "mattingList"), {
        id: userNickName,
        nickName: userProfile.nickName, // Only store nickName
      });

      await addDoc(collection(db, "profiles", userNickName, "mattingList"), {
        id: matched.id,
        nickName: matched.nickName,
      });
      
      showAlert(`${matched.nickName}にいいねしました！`, "success");
      //setMatchedCandidate(matched);
      setCandidates(prevCandidates =>
        prevCandidates.filter(candidate => candidate.id !== matched.id)
      );
      fetchNextCandidate();
    } catch (error) {
      console.error("Error adding to matching list: ", error);
      showAlert(`マッチングリストへの追加中にエラーが発生しました。再試行してください。`, "error");
    }
  };

  const handleSkip = async () => {
    if (!user || !candidates[currentIndex]) return;
    const skipped = candidates[currentIndex];

    try {
      await addDoc(collection(db, "profiles", userNickName, "skipList"), {
        id: skipped.id,
        nickName: skipped.nickName,
      });

      // ローカルのスキップリストを更新
      setSkippedCandidates((prev) => [...prev, skipped]);
      fetchNextCandidate();
    } catch (error) {
      showAlert(`候補者をスキップできませんでした。再試行してください。`, "error");
    }
  };

  const handleOpenSkipListDialog = () => setOpenSkipListDialog(true);
  const handleCloseSkipListDialog = () => setOpenSkipListDialog(false);

  const handleOpenMatchingListDialog = () => setOpenMatchingListDialog(true);
  const handleCloseMatchingListDialog = () => setOpenMatchingListDialog(false);


  return (
    <Box sx={{ maxWidth: "800px", margin: "0 auto", padding: "16px", textAlign: "center"}}>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
          <CircularProgress />
        </Box>
      ) : candidates.length > 0 && candidates[currentIndex] ? (
        <Card sx={{ boxShadow: 3, marginBottom: 2 }}>
          <CardMedia
            component="img"
            height="300"
            image={candidates[currentIndex].userImage  || "/images/noimage.png"}
            alt={candidates[currentIndex].nickName}
          />
          <CardContent>
            <Typography variant="h5">{candidates[currentIndex].nickName}</Typography>
            <Typography variant="body2">{candidates[currentIndex].age}歳</Typography>
            <Typography variant="body2">{candidates[currentIndex].origin}</Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <IconButton
                size="large"
                sx={{
                  color: '#FF6F6F', // サムズアップアイコンの色を淡い赤に変更
                  '&:hover': {
                    color: '#FF3D3D', // ホバー時の色をもう少し濃い赤に変更
                  },
                }}
                onClick={handleMatch}
              >
                <ThumbUpAltIcon fontSize="inherit"/>
              </IconButton>

              <IconButton
                size="large"
                sx={{
                  color: '#6EC1E4', // スキップアイコンの色を淡い青に変更
                  '&:hover': {
                    color: '#4DA9D7', // ホバー時の色を少し濃い青に変更
                  },
                }}
                onClick={handleSkip}
              >

                  <ReplyIcon fontSize="inherit"/>
                </IconButton>
              </Box>
          </CardContent>
        </Card>
      ) : (
        <Typography variant="h6">候補者が見つかりませんでした。</Typography>
      )}
      <Box sx={{ width:"100%",marginBottom: "16px",display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <Button
              variant="contained"
              type="submit"
              sx={{
                width: "100%",
                borderRadius: "1%",
                backgroundColor: "#96C78C",
                boxShadow: "none",
                '&:hover': {
                  backgroundColor: "98C78C",
                },
              }}
              onClick={handleOpenSkipListDialog}
          >
            スキップリスト
          </Button>
          <Button 
            variant="contained"
            type="submit"
            sx={{
              width: "100%",
              borderRadius: "1%",
              backgroundColor: "#96C78C",
              boxShadow: "none",
              '&:hover': {
                backgroundColor: "98C78C",
              },
            }}
            onClick={handleOpenMatchingListDialog}
          >
            マッチング待ちリスト
          </Button>
        </Box>


      <Dialog open={openSkipListDialog} onClose={handleCloseSkipListDialog} maxWidth="sm" fullWidth>
        <DialogTitle>スキップリスト</DialogTitle>
        <DialogContent>
          {skippedCandidates.length > 0 ? (
            skippedCandidates.map((candidate) => (
              <Box key={candidate.id} sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                <Card sx={{ display: "flex", width: "100%" }}>
                  <CardMedia
                    component="img"
                    image={candidate.userImage || "/images/default-profile.png"}
                    alt={candidate.nickName}
                    sx={{ width: 80, height: 80 }}
                  />
                  <CardContent>
                    <Typography variant="body1">{candidate.nickName}</Typography>
                  </CardContent>
                </Card>
              </Box>
            ))
          ) : (
            <Typography variant="body2">スキップした候補者はありません。</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSkipListDialog} color="primary">
            閉じる
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openMatchingListDialog} onClose={handleCloseMatchingListDialog} maxWidth="sm" fullWidth>
        <DialogTitle>マッチング待ちリスト</DialogTitle>
        <DialogContent>
          {waitingCandidates.length > 0 ? (
            waitingCandidates.map((candidate) => (
              <Box key={candidate.id} sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                <Card sx={{ display: "flex", width: "100%" }}>
                  <CardMedia
                    component="img"
                    image={candidate.userImage || "/images/default-profile.png"}
                    alt={candidate.nickName}
                    sx={{ width: 80, height: 80 }}
                  />
                  <CardContent>
                    <Typography variant="body1">{candidate.nickName}</Typography>
                  </CardContent>
                </Card>
              </Box>
            ))
          ) : (
            <Typography variant="body2">マッチング待ち候補者はありません。</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMatchingListDialog} color="primary">
            閉じる
          </Button>
        </DialogActions>
      </Dialog>
      <NaviButtons/>
    </Box>
  );
};

export default MatchingPage;


