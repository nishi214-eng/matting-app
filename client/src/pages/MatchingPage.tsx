import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Card, CardMedia, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { db } from "../infra/firebase";
import { collection, getDocs, doc, getDoc, addDoc } from "firebase/firestore";
import { useAuthContext } from '../store/AuthContext';

// Candidate型を拡張
interface Candidate {
  id: string;
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

const MatchingPage: React.FC = () => {
    const { user } = useAuthContext(); // useAuthContextからユーザー情報を取得
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [matchedCandidate, setMatchedCandidate] = useState<Candidate | null>(null);
    const [userProfile, setUserProfile] = useState<Candidate | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [skippedCandidates, setSkippedCandidates] = useState<Candidate[]>([]); // スキップした候補者
    const [waitingCandidates, setWaitingCandidates] = useState<Candidate[]>([]); // マッチング待ちの候補者
    const [openSkipListDialog, setOpenSkipListDialog] = useState<boolean>(false); // スキップリストのダイアログの表示状態
    const [openMatchingListDialog, setOpenMatchingListDialog] = useState<boolean>(false); // マッチング待ちリストのダイアログの表示状態

  // ユーザーと候補者のデータを取得
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return; // ログインしていない場合、処理を終了
      try {
        const profileDocRef = doc(db, "profiles", user.uid, "profile", "data"); // user.uidを使ってユーザーのプロフィールを取得
        const profileDoc = await getDoc(profileDocRef);

        if (profileDoc.exists()) {
          const profileData = profileDoc.data();
          setUserProfile({
            id: user.uid,
            nickName: profileData.nickName,
            gender: profileData.gender || "",
            userImage: profileData.userImage || "",
            userImage2: profileData.userImage2 || "",
            age: profileData.age || "",
            height: profileData.height || "",
            origin: profileData.origin || "",
            hobby: profileData.hobby || "",
            drive: profileData.drive || "",
            annualIncome: profileData.annualIncome || "",
            smoking: profileData.smoking || "",
            drinking: profileData.drinking || "",
            marriageWant: profileData.marriageWant || "",
            firstSon: profileData.firstSon || "",
          });
        } else {
          console.error("User profile not found");
        }
      } catch (error) {
        console.error("Error fetching user profile: ", error);
      }
    };

    const fetchCandidates = async () => {
      if (!user) return; // ユーザーがいなければ終了
      try {
        const querySnapshot = await getDocs(collection(db, "profiles"));
        const fetchedCandidates: Candidate[] = [];
        const skippedList: Candidate[] = [];
        const waitingList: Candidate[] = [];

        for (const docSnapshot of querySnapshot.docs) {
          const candidateId = docSnapshot.id;

          if (candidateId !== user.uid) { // 自分自身はスキップ
            const profileDocRef = doc(db, "profiles", candidateId, "profile", "data");
            const profileDoc = await getDoc(profileDocRef);

            if (profileDoc.exists()) {
              const profileData = profileDoc.data();
              const candidate: Candidate = {
                id: candidateId,
                nickName: profileData.nickName,
                gender: profileData.gender || "",
                userImage: profileData.userImage || "",
                userImage2: profileData.userImage2 || "",
                age: profileData.age || "",
                height: profileData.height || "",
                origin: profileData.origin || "",
                hobby: profileData.hobby || "",
                drive: profileData.drive || "",
                annualIncome: profileData.annualIncome || "",
                smoking: profileData.smoking || "",
                drinking: profileData.drinking || "",
                marriageWant: profileData.marriageWant || "",
                firstSon: profileData.firstSon || "",
              };

              // マッチング済みまたはスキップした相手はリストに追加しない
              const matchedListSnapshot = await getDocs(collection(db, "profiles", candidateId, "mattingList"));
              const isMatched = matchedListSnapshot.docs.some(doc => doc.id === user.uid);

              if (isMatched) {
                setMatchedCandidate(candidate);
              } else {
                // スキップした候補者
                const skipListSnapshot = await getDocs(collection(db, "profiles", user.uid, "skipList"));
                const isSkipped = skipListSnapshot.docs.some(doc => doc.id === candidateId);
                if (isSkipped) {
                  skippedList.push(candidate);
                } else {
                  waitingList.push(candidate);
                }
              }
              fetchedCandidates.push(candidate);
            }
          }
        }

        setCandidates(waitingList);  // マッチング待ちの候補者リストを設定
        setSkippedCandidates(skippedList);  // スキップされた候補者リスト
        setWaitingCandidates(waitingList);  // マッチング待ち候補者
        setLoading(false); // ローディング完了
      } catch (error) {
        console.error("Error fetching candidates: ", error);
      }
    };

    fetchUserProfile();
    fetchCandidates();
  }, [user]); // userが変更された際に再取得

  const fetchNextCandidate = async () => {
    if (currentIndex + 1 < candidates.length) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    } else {
      alert("候補者がいません！");
    }
  };

  const handleMatch = async () => {
    if (!user || !userProfile || !candidates[currentIndex]) return;

    const matched = candidates[currentIndex];

    try {
      await addDoc(collection(db, "profiles", matched.id, "mattingList"), {
        id: user.uid,
        nickName: userProfile.nickName, // Only store nickName
      });

      await addDoc(collection(db, "profiles", user.uid, "mattingList"), {
        id: matched.id,
        nickName: matched.nickName, // Only store nickName
      });

      alert(`${matched.nickName}にいいねしました！`);

      setMatchedCandidate(matched);
      fetchNextCandidate();
    } catch (error) {
      console.error("Error adding to matching list: ", error);
      alert("マッチングリストへの追加中にエラーが発生しました。再試行してください。");
    }
  };

  const handleSkip = async () => {
    if (!user || !candidates[currentIndex]) return;

    const skipped = candidates[currentIndex];

    try {
      // スキップした候補者をスキップリストに追加
      await addDoc(collection(db, "profiles", user.uid, "skipList"), {
        id: skipped.id,
        nickName: skipped.nickName,
      });

      fetchNextCandidate();
    } catch (error) {
      console.error("Error skipping candidate: ", error);
      alert("候補者をスキップできませんでした。再試行してください。");
    }
  };

  const handleOpenSkipListDialog = () => setOpenSkipListDialog(true);
  const handleCloseSkipListDialog = () => setOpenSkipListDialog(false);

  const handleOpenMatchingListDialog = () => setOpenMatchingListDialog(true);
  const handleCloseMatchingListDialog = () => setOpenMatchingListDialog(false);

  return (
    <Box sx={{ maxWidth: "600px", margin: "0 auto", padding: "16px", textAlign: "center", position: "relative" }}>
      <Button
        variant="contained"
        color="primary"
        sx={{ position: "absolute", top: 16, left: 16 }}
        onClick={handleOpenSkipListDialog}
      >
        スキップリスト
      </Button>
      <Button
        variant="contained"
        color="primary"
        sx={{ position: "absolute", top: 16, right: 16 }}
        onClick={handleOpenMatchingListDialog}
      >
        マッチング待ちリスト
      </Button>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
          <CircularProgress />
        </Box>
      ) : candidates.length > 0 && candidates[currentIndex] ? (
        <Card sx={{ boxShadow: 3, marginBottom: 2 }}>
          <CardMedia
            component="img"
            height="300"
            image={candidates[currentIndex]?.userImage}
            alt={candidates[currentIndex]?.nickName}
            sx={{ objectFit: "cover" }}
          />
          <CardContent>
            <Typography variant="h5" sx={{ marginBottom: 1 }}>
              {candidates[currentIndex]?.nickName}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
              年齢: {candidates[currentIndex]?.age}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
              出身地: {candidates[currentIndex]?.origin}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button variant="contained" onClick={handleMatch}>いいね</Button>
              <Button variant="outlined" onClick={handleSkip}>スキップ</Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Typography variant="h6">候補者が見つかりませんでした</Typography>
      )}

      {/* スキップリストダイアログ */}
      <Dialog open={openSkipListDialog} onClose={handleCloseSkipListDialog}>
        <DialogTitle>スキップリスト</DialogTitle>
        <DialogContent>
          {skippedCandidates.length > 0 ? (
            skippedCandidates.map((candidate) => (
              <Typography key={candidate.id} variant="body1">
                {candidate.nickName}
              </Typography>
            ))
          ) : (
            <Typography variant="body1">スキップした候補者はいません。</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSkipListDialog}>閉じる</Button>
        </DialogActions>
      </Dialog>

      {/* マッチング待ちリストダイアログ */}
      <Dialog open={openMatchingListDialog} onClose={handleCloseMatchingListDialog}>
        <DialogTitle>マッチング待ちリスト</DialogTitle>
        <DialogContent>
          {waitingCandidates.length > 0 ? (
            waitingCandidates.map((candidate) => (
              <Typography key={candidate.id} variant="body1">
                {candidate.nickName}
              </Typography>
            ))
          ) : (
            <Typography variant="body1">マッチング待ちの候補者はいません。</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMatchingListDialog}>閉じる</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MatchingPage;
