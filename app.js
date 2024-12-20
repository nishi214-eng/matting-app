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

// Socket.IOの設定
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:3000','https://localhost:3002','https://192.168.2.103:3002',`https://192.168.2.103:3002/Tel`],// アクセスを許可するURL
    methods: ['GET', 'POST'],
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// ミドルウェア設定
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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
  res.render('error');
});

// ポート設定
const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
