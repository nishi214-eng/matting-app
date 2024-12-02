const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http');
const socketIo = require('socket.io');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// HTTPサーバー作成
const server = http.createServer(app);


const cors = require('cors');

// CORSの設定（Expressで使用）
app.use(cors());

// Socket.IOの設定
{/*
const io = socketIo(server, {
  cors: {
    origin: [
      'https://matting-app.onrender.com',  // 本番環境のURL
      'http://localhost:3000',             // ローカル開発環境（ポート3000）
      'http://localhost:3001',             // ローカル開発環境（ポート3001）
      'http://localhost:3002',             // ローカル開発環境（ポート3002）
      'http://0.0.0.0:3000', 
      'http://0.0.0.0:3001',
      'http://0.0.0.0:3002',               // 0.0.0.0（ローカル環境のIP）
      'http://127.0.0.1:3000',            // ローカルの127.0.0.1（ローカルテスト用）
      'http://127.0.0.1:3001',            // ローカルの127.0.0.1（ポート3001用）
      'http://127.0.0.1:3002',            // ローカルの127.0.0.1（ポート3002用）
    ],
    methods: ['GET', 'POST'],
  }
});
*/}
const io = socketIo(server,{
  cors: {},
});


// ミドルウェア設定
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,  'client/build')));

// ルートの設定
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Socket.IOによるリアルタイム通信設定
io.on('connection', (socket) => {
  console.log('A client connected: ' + socket.id);

  socket.on('knock', (room) => {
    console.log(socket.id + ' is knocking room [' + room + ']');
    var clientsInRoom = io.sockets.adapter.rooms.get(room);
    var numClients = (clientsInRoom === undefined) ? 0 : clientsInRoom.size;
    socket.emit('knocked response', numClients, room);

    socket.on('create', () => {
      console.log(socket.id + ' created room [' + room + ']');
      socket.join(room);
      socket.emit('created', room);
    });

    socket.on('join', () => {
      console.log(socket.id + ' joined room [' + room + ']');
      socket.join(room);
      io.sockets.in(room).emit('joined', room, socket.id);
    });

    socket.on('allow', () => {
      console.log('room host allowed joining');
      socket.in(room).emit('allowed');
      socket.emit('allowed');
    });

    socket.on('message', (description) => {
      if (description.type === 'offer') {
        console.log('offer');
        socket.to(room).emit('offer', description);
      } else if (description.type === 'answer') {
        console.log('answer');
        socket.to(room).emit('answer', description);
      } else if (description.type === 'candidate') {
        console.log('candidate');
        socket.to(room).emit('candidate', description);
      } else {
        console.log('[ERROR] We can not read this message.');
      }
    });
  });

  socket.on('disconnect', () => {
    console.log(socket.id + " disconnected");
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.options('*', (req, res) => {
  res.set('Access-Control-Allow-Origin', '<https://matting-app.onrender.com>');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.status(204).end();
});

module.exports = app;
