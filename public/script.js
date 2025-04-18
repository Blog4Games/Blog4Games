function showSection(id) {
  document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

async function loadComments() {
  const res = await fetch('/api/comments');
  const comments = await res.json();
  const list = document.getElementById('commentsList');
  list.innerHTML = '';
  comments.forEach(c => {
    const div = document.createElement('div');
    div.className = 'comment';
    div.innerHTML = `<strong>${c.username}</strong><p>${c.text}</p><small>${new Date(c.date).toLocaleString()}</small>`;
    list.appendChild(div);
  });
}

async function addComment(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const text = document.getElementById('commentText').value;

  await fetch('/api/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, text })
  });

  document.getElementById('username').value = '';
  document.getElementById('commentText').value = '';
  loadComments();
}

async function loadPosts() {
  const res = await fetch('posts.json');
  const posts = await res.json();
  const container = document.getElementById('posts');
  container.innerHTML = '';
  posts.forEach(post => {
    const div = document.createElement('div');
    div.className = 'post';
    div.innerHTML = `<h2>${post.title}</h2><p>${post.content}</p>`;
    container.appendChild(div);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadComments();
  loadPosts();
});
let socket;
const userColors = {}; // mapowanie nicków na kolory

function connectChat() {
  if (!socket) {
    socket = io();

    socket.on('chat message', ({ user, message }) => {
      const chatWindow = document.getElementById('chatWindow');
      const msgDiv = document.createElement('div');
      msgDiv.className = 'chat-message';

      if (!userColors[user]) {
        userColors[user] = getColorForUser(user);
      }

      msgDiv.innerHTML = `<span class="chat-user" style="color:${userColors[user]}">${user}</span>: ${message}`;
      chatWindow.appendChild(msgDiv);
      chatWindow.scrollTop = chatWindow.scrollHeight;
    });

    socket.on('clear', () => {
      document.getElementById('chatWindow').innerHTML = '';
    });
  }
}

function sendMessage(event) {
  if (event.key === 'Enter') {
    sendChatMessage();
  }
}

function sendChatMessage() {
  const user = document.getElementById('chatUsername').value.trim();
  const msg = document.getElementById('chatMessage').value.trim();
  if (!user || !msg) return;

  socket.emit('chat message', { user, message: msg });
  document.getElementById('chatMessage').value = '';
}

}

function clearChat() {
  socket.emit('clear');
}

function getColorForUser(username) {
  // Prostą funkcja hashująca nazwę do koloru
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 50%)`;
  return color;
}

