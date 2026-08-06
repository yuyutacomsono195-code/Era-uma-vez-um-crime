// Atributos do Pou
let hunger = 100;
let happy = 100;
let energy = 100;
let isSleeping = false;

// Elementos HTML
const hungerBar = document.getElementById('hunger-bar');
const happyBar = document.getElementById('happy-bar');
const energyBar = document.getElementById('energy-bar');

const btnFeed = document.getElementById('btn-feed');
const btnPlay = document.getElementById('btn-play');
const btnSleep = document.getElementById('btn-sleep');

const pouContainer = document.getElementById('pou-container');
const pouMouth = document.getElementById('pou-mouth');
const room = document.getElementById('room');
const actionEffect = document.getElementById('action-effect');

// --- SISTEMA DE ÁUDIO SINTETIZADO ---
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

// Som ao Comer (Nhac)
function playEatSound() {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(300, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.15);

  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.15);
}

// Som de Pulo / Brincar (Boing)
function playJumpSound() {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(200, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.25);

  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.25);
}

// Som do Apagar/Acender a Luz
function playSwitchSound() {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'square';
  osc.frequency.setValueAtTime(120, ctx.currentTime);

  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.08);
}

// Som de Carinho (Pop)
function playPopSound() {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);

  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.1);
}

// --- LÓGICA DO JOGO ---

function updateUI() {
  hungerBar.style.width = `${hunger}%`;
  happyBar.style.width = `${happy}%`;
  energyBar.style.width = `${energy}%`;

  updateBarColor(hungerBar, hunger);
  updateBarColor(happyBar, happy);
  updateBarColor(energyBar, energy);

  if (isSleeping) {
    pouMouth.setAttribute('d', 'M 85 150 Q 100 150 115 150');
  } else if (hunger < 30 || happy < 30) {
    pouMouth.setAttribute('d', 'M 80 155 Q 100 135 120 155');
  } else {
    pouMouth.setAttribute('d', 'M 80 145 Q 100 160 120 145');
  }
}

function updateBarColor(element, value) {
  if (value > 60) {
    element.style.backgroundColor = '#66bb6a';
  } else if (value > 30) {
    element.style.backgroundColor = '#ffa726';
  } else {
    element.style.backgroundColor = '#ef5350';
  }
}

// Botão Alimentar
btnFeed.addEventListener('click', () => {
  if (isSleeping) return;

  if (hunger < 100) {
    hunger = Math.min(100, hunger + 25);
    playEatSound();
    showEffect('🍎');
    updateUI();
  }
});

// Botão Brincar
btnPlay.addEventListener('click', () => {
  if (isSleeping) return;

  if (happy < 100 && energy > 10) {
    happy = Math.min(100, happy + 20);
    energy = Math.max(0, energy - 10);
    
    playJumpSound();

    pouContainer.classList.remove('happy-jump');
    void pouContainer.offsetWidth; 
    pouContainer.classList.add('happy-jump');
    
    showEffect('⚽');
    updateUI();
  }
});

// Botão Dormir
btnSleep.addEventListener('click', () => {
  isSleeping = !isSleeping;
  playSwitchSound();

  if (isSleeping) {
    room.classList.add('night');
    btnSleep.innerText = '☀️ Acordar';
  } else {
    room.classList.remove('night');
    btnSleep.innerText = '💤 Dormir';
  }
  updateUI();
});

// Efeito Visual
function showEffect(emoji) {
  actionEffect.innerText = emoji;
  actionEffect.classList.remove('hidden');
  setTimeout(() => {
    actionEffect.classList.add('hidden');
  }, 800);
}

// Carinho no Pou
pouContainer.addEventListener('click', () => {
  if (!isSleeping && happy < 100) {
    happy = Math.min(100, happy + 5);
    playPopSound();
    showEffect('❤️');
    updateUI();
  }
});

// Loop principal do jogo
setInterval(() => {
  if (isSleeping) {
    if (energy < 100) {
      energy = Math.min(100, energy + 8);
    } else {
      isSleeping = false;
      room.classList.remove('night');
      btnSleep.innerText = '💤 Dormir';
      playSwitchSound();
    }
  } else {
    hunger = Math.max(0, hunger - 2);
    happy = Math.max(0, happy - 2);
    energy = Math.max(0, energy - 1);
  }
  updateUI();
}, 2500);

updateUI();
    
