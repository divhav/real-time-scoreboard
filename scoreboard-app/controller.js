const socket = io(), app = document.getElementById('app');
let state={};
socket.on('init', s=>{state=s; init(s);});
socket.on('state', s=>{state=s; init(s);});
function pad(n){return String(n).padStart(2,'0');}
function init(s){
  app.innerHTML = `
    <div class="controller-container">
      <div class="controller-grid">
        <div class="team-control">
          <label for="nameA">Όνομα Ομάδας A</label>
          <input id="nameA" type="text" value="${s.teams.A.name}" />
          <div class="score">${s.teams.A.score}</div>
          <div class="buttons">
            <button onclick="updateScore('A',1)">+1</button>
            <button onclick="updateScore('A',-1)">-1</button>
            <button onclick="resetScore('A')">0</button>
          </div>
        </div>
        <div class="team-control">
          <label for="nameB">Όνομα Ομάδας B</label>
          <input id="nameB" type="text" value="${s.teams.B.name}" />
          <div class="score">${s.teams.B.score}</div>
          <div class="buttons">
            <button onclick="updateScore('B',1)">+1</button>
            <button onclick="updateScore('B',-1)">-1</button>
            <button onclick="resetScore('B')">0</button>
          </div>
        </div>
      </div>
      <div class="time-control">
        <label>Διάρκεια Περιόδου:</label>
        <input id="duration" type="text" pattern="\d{2}:\d{2}" maxlength="5" value="${pad(s.time.minutes)}:${pad(s.time.seconds)}">
      </div>
      <div class="buttons-row">
        <button onclick="pauseTime()">Παύση</button>
        <button onclick="startTime()">Εκίνηση</button>
      </div>
      <div class="period-control">
        <span>ΠΕΡΙΟΔΟΣ</span>
        <span class="period-number">${s.period}</span>
        <div class="buttons">
          <button onclick="changePeriod(1)">+1</button>
          <button onclick="resetPeriod()">Επανεκκίνηση</button>
        </div>
      </div>
    </div>`;
  document.getElementById('nameA').onchange = e=>socket.emit('update',{teams:{A:{name:e.target.value}}});
  document.getElementById('nameB').onchange = e=>socket.emit('update',{teams:{B:{name:e.target.value}}});
  document.getElementById('duration').onchange = e=>changeDuration(e.target.value);
}
// expose functions
window.updateScore = function(t,d){socket.emit('update',{teams:{[t]:{score:state.teams[t].score+d}}});};
window.resetScore = function(t){socket.emit('update',{teams:{[t]:{score:0}}});};
window.changeDuration = function(v){const[m,s]=v.split(':').map(Number);if(!isNaN(m)&&!isNaN(s))socket.emit('update',{time:{minutes:m,seconds:s,running:false}});};
window.startTime = function(){socket.emit('update',{time:{running:true}});};
window.pauseTime = function(){socket.emit('update',{time:{running:false}});};
window.changePeriod = function(d){socket.emit('update',{period:state.period+d});};
window.resetPeriod = function(){socket.emit('update',{period:1});};