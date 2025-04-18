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

function connectChat() {
  if (!socket) {
    socket = io();

    socket.on('chat message', ({ user, message }) => {
      const chatWindow = document.getElementById('chatWindow');
      const div = document.createElement('div');
      div.innerHTML = `<strong>${user}</strong>: ${message}`;
      chatWindow.appendChild(div);
      chatWindow.scrollTop = chatWindow.scrollHeight;
    });
  }
}

function sendMessage(event) {
  if (event.key === 'Enter') {
    const user = document.getElementById('chatUsername').value.trim();
    const msg = document.getElementById('chatMessage').value.trim();
    if (!user || !msg) return;

    socket.emit('chat message', { user, message: msg });
    document.getElementById('chatMessage').value = '';
  }
}

// Aktywuj czat przy przełączaniu zakładki
function showSection(id) {
  document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'discussion') connectChat();
}
