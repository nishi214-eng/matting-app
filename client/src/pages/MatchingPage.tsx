import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Card, CardMedia, CardContent, CircularProgress } from "@mui/material";
import { db } from "../infra/firebase";
import { collection, getDocs, doc, getDoc, addDoc } from "firebase/firestore";

interface Candidate {
    id: string;
    nickName: string;
    age: number;
    userImage: string;
    origin: string;
}

const MatchingPage: React.FC = () => {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [matchedCandidate, setMatchedCandidate] = useState<Candidate | null>(null);
    const [userProfile, setUserProfile] = useState<Candidate | null>(null);
    const user = "もも";  // ユーザーの名前やID（ここはログイン状態に合わせて変更）

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!user) return;
            try {
                // 自分のプロフィール情報を取得
                const profileDocRef = doc(db, "profiles", user, "profile", "data");
                const profileDoc = await getDoc(profileDocRef);

                if (profileDoc.exists()) {
                    const profileData = profileDoc.data();
                    setUserProfile({
                        id: user,
                        nickName: profileData.nickName,
                        age: profileData.age,
                        userImage: profileData.userImage,
                        origin: profileData.origin
                    });
                } else {
                    console.error("User profile not found");
                }
            } catch (error) {
                console.error("Error fetching user profile: ", error);
            }
        };

        const fetchCandidates = async () => {
            if (!user) return;
            try {
                const querySnapshot = await getDocs(collection(db, "profiles"));
                const fetchedCandidates: Candidate[] = [];

                for (const docSnapshot of querySnapshot.docs) {
                    if (docSnapshot.id !== user) {
                        const profileDocRef = doc(db, "profiles", docSnapshot.id, "profile", "data");//dataに変える
                        const profileDoc = await getDoc(profileDocRef);

                        if (profileDoc.exists()) {
                            const profileData = profileDoc.data();
                            fetchedCandidates.push({
                                id: docSnapshot.id,
                                nickName: profileData.nickName,
                                age: profileData.age,
                                userImage: profileData.userImage,
                                origin: profileData.origin
                            });
                        } else {
                            console.error("Candidate profile not found for: ", docSnapshot.id);
                        }
                    }
                }

                setCandidates(fetchedCandidates);
            } catch (error) {
                console.error("Error fetching candidates: ", error);
            }
        };

        fetchUserProfile(); // ユーザー情報を取得
        fetchCandidates();  // 候補者情報を取得
    }, [user]);

    // 候補者が表示されるたびに、自分とnickNameが一致する場合は次の候補者に進む
    useEffect(() => {
        if (candidates.length > 0 && userProfile) {
            // 自分のnickNameと一致しない候補者を表示
            while (candidates[currentIndex]?.nickName === userProfile.nickName) {
                nextCandidate();
            }
        }
    }, [candidates, currentIndex, userProfile]);

    const handleMatch = async () => {
        if (!user || !userProfile || !candidates[currentIndex]) return;

        const matched = candidates[currentIndex];

        if (!userProfile.nickName || !userProfile.userImage || !userProfile.age || !userProfile.origin) {
            console.error("User profile is incomplete.");
            alert("プロフィール情報が不完全です。再試行してください。");
            return;
        }

        try {
            // 自分のnickNameを相手のマッチングリストに追加
            await addDoc(collection(db, "profiles", matched.id, "mattingList"), {
                id: user,
                nickName: userProfile.nickName, // Only store nickName
            });

            // 相手のnickNameを自分のマッチングリストに追加
            await addDoc(collection(db, "profiles", user, "mattingList"), {
                id: matched.id,
                nickName: matched.nickName, // Only store nickName
            });

            alert(`${matched.nickName}とマッチングしました！`);

            // マッチした相手情報をstateに保存
            setMatchedCandidate(matched);

            nextCandidate();
        } catch (error) {
            console.error("Error adding to matching list: ", error);
            alert("マッチングリストへの追加中にエラーが発生しました。再試行してください。");
        }
    };

    const handleSkip = () => {
        nextCandidate();
    };

    const nextCandidate = () => {
        if (currentIndex + 1 < candidates.length) {
            setCurrentIndex(currentIndex + 1); // 次の候補者へ
        } else {
            alert("候補者がいません！");
            setMatchedCandidate(null); // 候補者がいない場合はマッチング情報を非表示に
        }
    };

    return (
        <Box sx={{ maxWidth: "600px", margin: "0 auto", padding: "16px", textAlign: "center" }}>
            {candidates.length > 0 ? (
                currentIndex < candidates.length ? (
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
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{ marginRight: 1 }}
                                    onClick={handleMatch}
                                >
                                    マッチする
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    fullWidth
                                    sx={{ marginLeft: 1 }}
                                    onClick={handleSkip}
                                >
                                    スキップ
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                ) : (
                    <Typography variant="h6" sx={{ color: "#999" }}>
                        候補者がいません！
                    </Typography>
                )
            ) : (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
                    <CircularProgress />
                </Box>
            )}

            {matchedCandidate && candidates.length > 0 && (
                <Box sx={{ marginTop: 3 }}>
                    <Typography variant="h6" sx={{ marginBottom: 1 }}>
                        マッチングした相手:
                    </Typography>
                    <Typography variant="h5">{matchedCandidate.nickName}</Typography>
                    <Typography variant="body1">年齢: {matchedCandidate.age}</Typography>
                    <Typography variant="body1">出身地: {matchedCandidate.origin}</Typography>
                </Box>
            )}
        </Box>
    );
};

export default MatchingPage;
