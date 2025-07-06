const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const srv = http.createServer(app);
const io = new Server(srv);

app.use(express.static(__dirname));

let state = {
  teams: {
    A: { name: 'Team A', score: 0 },
    B: { name: 'Team B', score: 0 }
  },
  time: { minutes: 10, seconds: 0, running: false },
  period: 1
};

let timerInterval = null;
function startTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    if (!state.time.running) return;
    if (state.time.seconds === 0) {
      if (state.time.minutes === 0) {
        state.time.running = false;
        clearInterval(timerInterval);
        timerInterval = null;
      } else {
        state.time.minutes--;
        state.time.seconds = 59;
      }
    } else {
      state.time.seconds--;
    }
    io.emit('state', state);
  }, 1000);
}

io.on('connection', socket => {
  socket.emit('init', state);
  socket.on('update', delta => {
    if (delta.teams) {
      for (const t in delta.teams) Object.assign(state.teams[t], delta.teams[t]);
    }
    if (delta.time) {
      Object.assign(state.time, delta.time);
      if (delta.time.running) {
        startTimer();
      } else {
        if (timerInterval) {
          clearInterval(timerInterval);
          timerInterval = null;
        }
      }
    }
    if (delta.period !== undefined) state.period = delta.period;
    io.emit('state', state);
  });
});

srv.listen(3000, () => console.log('Server running at http://localhost:3000'));