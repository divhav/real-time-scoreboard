const socket = io(), app = document.getElementById('app');
function pad(n){ return String(n).padStart(2,'0'); }
socket.on('init', render);
socket.on('state', render);
let prev = {A:0,B:0};
function render(s){
  app.innerHTML = `
    <div class="scoreboard">
      <div class="period-title">ΠΕΡΙΟΔΟΣ</div>
      <div class="period-number">${s.period}</div>
      <div class="grid">
        <div class="team">
          <div class="team-name">${s.teams.A.name}</div>
          <div id="scoreA" class="team-score">${s.teams.A.score}</div>
        </div>
        <div>
          <div id="timer" class="timer${s.time.running?'':' time-paused'}">${pad(s.time.minutes)}:${pad(s.time.seconds)}</div>
        </div>
        <div class="team">
          <div class="team-name">${s.teams.B.name}</div>
          <div id="scoreB" class="team-score">${s.teams.B.score}</div>
        </div>
      </div>
    </div>`;
  const sA = document.getElementById('scoreA'), sB = document.getElementById('scoreB');
  if(sA){
    const curA = +sA.textContent, curB = +sB.textContent;
    if(curA>prev.A) sA.classList.add('blink-green');
    if(curA<prev.A) sA.classList.add('blink-red');
    if(curB>prev.B) sB.classList.add('blink-green');
    if(curB<prev.B) sB.classList.add('blink-red');
    prev = {A:curA, B:curB};
    setTimeout(()=>{ sA.classList.remove('blink-green','blink-red'); sB.classList.remove('blink-green','blink-red'); },1000);
  }
}