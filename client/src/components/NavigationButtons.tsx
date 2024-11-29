import React from 'react';
import { Button, Box } from '@mui/material';
import useButtonNavigation from '../feature/useButtonNavigation';

const NavigationButtons: React.FC = () => {
  // useButtonNavigationフックを使用して、遷移機能を取得
  const navigateTo = useButtonNavigation();

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#96C78C",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#88b078",
          },
        }}
        onClick={() => navigateTo("/Home")}
      >
        ホーム
      </Button>
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#96C78C",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#88b078",
          },
        }}
        onClick={() => navigateTo("/ProfileDisplay")}
      >
        プロフィール
      </Button>
    </Box>
  );
};

export default NavigationButtons;
