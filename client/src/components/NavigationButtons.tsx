import React from 'react';
import { IconButton, Box,Typography } from '@mui/material';
import useButtonNavigation from '../feature/useButtonNavigation';
import HomeIcon from '@mui/icons-material/Home';
import MessageIcon from '@mui/icons-material/Message';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const NavigationButtons: React.FC = () => {
  // useButtonNavigationフックを使用して、遷移機能を取得
  const navigateTo = useButtonNavigation();

  return (
    <Box
      sx={{
        display: 'flex',
        bottom: 0, // 下端に固定
        position: "absolute",
        width:"100%",
        left: 0,
        right: 0,
        backgroundColor: '#f8f8f8', // フッターバーの背景色
        justifyContent: 'space-around', // ボタンを均等に配置
        alignItems: 'center', // アイコンを中央に配置
        height: '8%', // 高さを調整
      }}
    >
      {/* Homeボタン */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <IconButton
          size="large"
          sx={{
            padding:0,
            color: '#96C78C', // アイコンの色
            '&:hover': {
              color: '#88b078', // ホバー時に色変更
            },
          }}
          onClick={() => navigateTo('/Home')}
        >
          <HomeIcon fontSize="inherit" />
        </IconButton>
        <Typography variant="caption" sx={{ color: '#96C78C' }}>
          ホーム
        </Typography>
      </Box>

      {/* Chatボタン */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <IconButton
          size="large"
          sx={{
            color: '#96C78C', // アイコンの色
            padding:0,
            '&:hover': {
              color: '#88b078', // ホバー時に色変更
            },
          }}
          onClick={() => navigateTo('/ChatList')}
        >
          <MessageIcon fontSize="inherit" />
        </IconButton>
        <Typography variant="caption" sx={{ color: '#96C78C' }}>
          やり取り
        </Typography>
      </Box>

      {/* Profileボタン */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <IconButton
          size="large"
          sx={{
            color: '#96C78C', // アイコンの色
            padding:0,
            '&:hover': {
              color: '#88b078', // ホバー時に色変更
            },
          }}
          onClick={() => navigateTo('/ProfileDisplay')}
        >
          <AccountCircleIcon fontSize="inherit" />
        </IconButton>
        <Typography variant="caption" sx={{ color: '#96C78C' }}>
          設定
        </Typography>
      </Box>
    </Box>
  );
};

export default NavigationButtons;
