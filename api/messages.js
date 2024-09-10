document.addEventListener('DOMContentLoaded', () => {
  const ws = new WebSocket(`ws://${window.location.host}`);

  ws.onmessage = (event) => {
    const messages = document.getElementById('messages');
    const message = document.createElement('div');
    message.className = 'message';
    message.textContent = event.data;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
  };

  document.getElementById('submit').addEventListener('click', () => {
    const input = document.getElementById('input');
    const message = input.value.trim();
    if (message) {
      ws.send(message);
      input.value = '';
    }
  });

  document.getElementById('input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      document.getElementById('submit').click();
    }
  });
});
