import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Card, CardMedia, CardContent, CircularProgress } from "@mui/material";
import { db } from "../infra/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useAuthContext } from '../store/AuthContext';

interface Candidate {
    id: string;
    name: string;
    age: number;
    imageUrl: string;
}

const MatchingPage: React.FC = () => {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const { user } = useAuthContext();
    useEffect(() => {
        const fetchCandidates = async () => {
            const userName = '花山薫';
            const querySnapshot = await getDocs(collection(db, "profiles",userName,"mattingList"));
            const fetchedCandidates: Candidate[] = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Candidate[];
            setCandidates(fetchedCandidates);
        };
        fetchCandidates();
    }, []);

    const handleMatch = () => {
        alert(`${candidates[currentIndex]?.name}とマッチングしました！`);
        nextCandidate();
    };

    const handleSkip = () => {
        nextCandidate();
    };

    const nextCandidate = () => {
        if (currentIndex + 1 < candidates.length) {
            setCurrentIndex(currentIndex + 1); // 次の候補者へ
        } else {
            alert("候補者がいません！"); // 候補者リストが終了した場合
        }
    };

    return (
        <Box sx={{ maxWidth: "600px", margin: "0 auto", padding: "16px", textAlign: "center" }}>
            {candidates.length > 0 ? (
                currentIndex < candidates.length ? ( // 次の候補が存在する場合
                    <Card sx={{ boxShadow: 3, marginBottom: 2 }}>
                        <CardMedia
                            component="img"
                            height="300"
                            image={candidates[currentIndex]?.imageUrl}
                            alt={candidates[currentIndex]?.name}
                            sx={{ objectFit: "cover" }}
                        />
                        <CardContent>
                            <Typography variant="h5" sx={{ marginBottom: 1 }}>
                                {candidates[currentIndex]?.name}
                            </Typography>
                            <Typography variant="body1" sx={{ marginBottom: 2 }}>
                                年齢: {candidates[currentIndex]?.age}
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
        </Box>
    );
};

export default MatchingPage;
