import React from 'react';
import socketClient from 'socket.io-client';
import { Box, Card, CardMedia, CardActions, Button, Typography } from '@mui/material';

const SERVER = "http://localhost:3001";  // サーバーURL
const socket = socketClient(SERVER);

const constraints = { video: true, audio: false };
const offerOptions: RTCOfferOptions = {
  offerToReceiveVideo: true,
};

export default function VideoConnect() {
  const localVideoRef = React.useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = React.useRef<HTMLVideoElement | null>(null);
  const [localStream, setLocalStream] = React.useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = React.useState<MediaStream | null>(null);
  const [canCall, setCanCall] = React.useState(false);
  const [room, setRoom] = React.useState<string>('');
  const [statusMessage, setStatusMessage] = React.useState<string>('');

  let peerConnection: RTCPeerConnection | null = null;

  // 接続状態を監視
  React.useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server with socket ID: ' + socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected from server: ' + reason);
    });

    // 部屋に参加した際
    socket.on('joined', (roomName: string, socketId: string) => {
      setStatusMessage(`Successfully joined room: ${roomName}`);
    });

    // 通話を許可された場合
    socket.on('allowed', () => {
      setStatusMessage('Connection allowed by the other participant');
    });

    // 通話オファーを受け取った際
    socket.on('offer', (description: RTCSessionDescriptionInit) => {
      setStatusMessage('Received an offer, establishing connection...');
      if (peerConnection) {
        peerConnection.setRemoteDescription(description);
        peerConnection.createAnswer()
          .then((answer) => {
            peerConnection!.setLocalDescription(answer);
            socket.emit('message', answer);
          })
          .catch((error) => console.error("Error creating answer", error));
      }
    });

    // ICE候補を受け取った際
    socket.on('candidate', (candidate: RTCIceCandidate) => {
      if (peerConnection) {
        peerConnection.addIceCandidate(candidate)
          .catch((error) => console.error("Error adding ICE candidate", error));
      }
    });

    return () => {
      // クリーンアップ
      socket.off('connect');
      socket.off('disconnect');
      socket.off('joined');
      socket.off('allowed');
      socket.off('offer');
      socket.off('candidate');
    };
  }, []);

  // メディアデバイスのアクセス
  React.useEffect(() => {
    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setCanCall(true);
      })
      .catch((error) => {
        console.error("Error accessing media devices", error);
        setStatusMessage("Failed to access media devices.");
      });
  }, []);

  // リモートの動画ストリームが設定されたら、ビデオに表示
  React.useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const createPeerConnection = () => {
    const config = {
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    };
    peerConnection = new RTCPeerConnection(config);

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('message', { type: 'candidate', candidate: event.candidate });
      }
    };

    peerConnection.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    if (localStream) {
      localStream.getTracks().forEach(track => peerConnection!.addTrack(track, localStream));
    }
  };

  const startCall = () => {
    if (!room) {
      setStatusMessage('Please create or join a room first.');
      return;
    }

    createPeerConnection();
    if (peerConnection) {
      peerConnection.createOffer(offerOptions)
        .then((offer) => {
          peerConnection!.setLocalDescription(offer);
          socket.emit('message', offer);
          setStatusMessage('Calling...');
        })
        .catch((error) => console.error("Error creating offer", error));
    }
  };

  const handleCreateRoom = () => {
    const roomName = prompt("Enter room name:");
    if (roomName) {
      setRoom(roomName);
      socket.emit('create', roomName);
      setStatusMessage(`Room ${roomName} created`);
    }
  };

  const handleJoinRoom = () => {
    const roomName = prompt("Enter room name to join:");
    if (roomName) {
      setRoom(roomName);
      socket.emit('join', roomName);
      setStatusMessage(`Joining room ${roomName}...`);
    }
  };

  return (
    <Box display="flex" flexDirection="row" justifyContent="center" gap={2} p={2}>
      <Box>
        <Card sx={{ width: 400, height: 280 }}>
          <CardMedia
            component="video"
            ref={localVideoRef}
            autoPlay
            playsInline
            sx={{ height: 225 }}
          />
          <CardActions>
            <Button onClick={handleCreateRoom}>Create Room</Button>
            <Button onClick={handleJoinRoom}>Join Room</Button>
            <Button onClick={startCall} disabled={!canCall}>
              Call
            </Button>
          </CardActions>
        </Card>
      </Box>

      <Box>
        <Card sx={{ width: 400, height: 280 }}>
          <CardMedia
            component="video"
            ref={remoteVideoRef}
            autoPlay
            playsInline
            sx={{ height: 225 }}
          />
          <CardActions>
            <Button disabled={true}>Room: {room}</Button>
            <Typography variant="body2" color="textSecondary">
              {statusMessage}
            </Typography>
          </CardActions>
        </Card>
      </Box>
    </Box>
  );
}
