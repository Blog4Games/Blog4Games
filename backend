const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;
const COMMENTS_FILE = 'comments.json';

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// GET komentarze
app.get('/api/comments', (req, res) => {
  fs.readFile(COMMENTS_FILE, (err, data) => {
    if (err) return res.status(500).send('Błąd odczytu komentarzy');
    res.send(JSON.parse(data));
  });
});

// POST komentarz
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

app.listen(PORT, () => console.log(`Serwer działa na http://localhost:${PORT}`));
