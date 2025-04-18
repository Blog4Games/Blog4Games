const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;
const COMMENTS_FILE = 'comments.json';

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Komentarze API
app.get('/api/comments', (req, res) => {
  fs.readFile(COMMENTS_FILE, (err, data) => {
    if (err) return res.status(500).send('Błąd odczytu komentarzy');
    res.send(JSON.parse(data));
  });
});

app.post('/api/comments', (req, res) => {
  const { username, text } = req.body;
  if (!username || !text) return res.status(400).send('Brak danych');

  fs.readFile(COMMENTS_FILE, (err, data) => {
    const comments = err ? [] : JSON.parse(data);
    comments.unshift({ username, text, date: new Date().toISOString() });

    fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 2), err => {
      if (err) return res.status(500).send('Błąd zapisu');
      res.status(201).send({ success: true });
    });
  });
});

// Socket.io czat
io.on('connection', socket => {
  console.log('Użytkownik połączony do czatu');
  socket.on('chat message', ({ user, message }) => {
    io.emit('chat message', { user, message }); // wysyłka do wszystkich
  });
});

server.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});
