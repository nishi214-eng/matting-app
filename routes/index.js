var express = require('express');
var http = require('http');
var socketIo = require('socket.io');
var path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

var app = express();
var server = http.createServer(app);
var io = socketIo(server, {
  cors: {
    origin: '*', // すべてのオリジンを許可
    methods: ['GET', 'POST'],
    pingTimeout: 60000,
    pingInterval: 25000   
  }
});

// エラーハンドリング
process.on('uncaughtException', (err) => console.error('Unhandled Exception:', err));
process.on('unhandledRejection', (reason) => console.error('Unhandled Rejection:', reason));

// 静的ファイル
app.use(express.static(path.join(__dirname, 'build')));

// プロキシ設定: Reactの開発サーバー
app.use(
  '/',
  createProxyMiddleware({
    target: 'http://localhost:3000', // Reactの開発サーバー
    changeOrigin: true,
  })
);

// ルーティング
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// WebSocket
io.on('connection', (socket) => {
  console.log('A client connected: ' + socket.id);  // 接続時のログ

  let currentRoom = null;  // 参加したルームを保存する変数

  // ルームの状態を確認（ルームの人数と参加者を確認）
  socket.on('knock', (room) => {
    const clientsInRoom = io.sockets.adapter.rooms.get(room);
    const numClients = clientsInRoom ? clientsInRoom.size : 0;
    socket.emit('knocked response', numClients, room);
  });

  // ルームの作成
  socket.on('create', (room) => {
    console.log(`Create event received with room name: ${room}`);
    const existingRoom = io.sockets.adapter.rooms.get(room);
    if (existingRoom && existingRoom.size > 0) {
      console.log("Room already exists");
      socket.emit('error', 'Room already exists');
      return;
    }
    console.log("Room created");
    socket.join(room); // ルームに参加
    currentRoom = room; // 作成したルームをcurrentRoomに保存
    socket.emit('created', room);
    console.log(`${socket.id} created room: ${room}`);
  });

  // ルームに参加
  socket.on('join', (room) => {
    console.log("Join event received for room: " + room);
    const existingRoom = io.sockets.adapter.rooms.get(room);
    if (!existingRoom) {
      socket.emit('error', 'Room does not exist');
      return;
    }
    if (existingRoom.size >= 2) {  // 例: ルームには最大2人まで参加可能
      socket.emit('error', 'Room is full');
      return;
    }
    socket.join(room); // ルームに参加
    currentRoom = room; // 参加したルームをcurrentRoomに保存
    io.to(room).emit('joined', room, socket.id);
    console.log(`${socket.id} joined room: ${room}`);
  });

  // 通話を許可する（相手に接続を許可）
  socket.on('allow', (room) => {
    io.to(room).emit('allowed');
    console.log(`${socket.id} allowed connection in room: ${room}`);
  });

  // メッセージ（オファー、アンサー、ICE候補の処理）
  socket.on('message', (description) => {
    if (!description || typeof description !== 'object') {
      console.warn('Invalid message:', description);
      return;
    }

    // currentRoomが設定されていない場合は処理しない
    if (!currentRoom) {
      console.warn('No room specified for message.');
      return;
    }

    // オファーをルームの他のユーザーに送信
    if (description.type === 'offer') {
      socket.to(currentRoom).emit('offer', description);
      console.log(`Offer sent from ${socket.id} to room: ${currentRoom}`);
    } 
    // アンサーをルームの他のユーザーに送信
    else if (description.type === 'answer') {
      socket.to(currentRoom).emit('answer', description);
      console.log(`Answer sent from ${socket.id} to room: ${currentRoom}`);
    } 
    // ICE候補をルームの他のユーザーに送信
    else if (description.type === 'candidate') {
      socket.to(currentRoom).emit('candidate', description);
      console.log(`Candidate sent from ${socket.id} to room: ${currentRoom}`);
    } else {
      console.log('[ERROR] Unknown message type.');
    }
  });

  // エラーハンドリング
  socket.on('error', (err) => console.error('Socket error:', err));

  // 切断時のログ
  socket.on('disconnect', (reason) => {
    console.log(`${socket.id} disconnected: ${reason}`);
  });
});

// 定期的に作成されたルームの一覧を表示
setInterval(() => {
  const rooms = io.sockets.adapter.rooms;
  const roomList = [];
  
  rooms.forEach((room, roomName) => {
    if (!room.has('socket.io')) {  // socket.ioの管理用の特殊なルームは除外
      roomList.push({ roomName, numClients: room.size });
    }
  });

  console.log('Current rooms:', roomList);
}, 5000);  // 5秒ごとにルーム情報を表示

// サーバー起動
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log('Server running on port ' + PORT));
