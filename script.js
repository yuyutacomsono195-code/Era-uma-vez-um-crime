// Atributos do Pou
let hunger = 100;
let happy = 100;
let energy = 100;
let coins = 0;
let isSleeping = false;
let isPlayingGame = false;

// Posições e Mini-Game
let pouX = 110;
let coinX = 150;
let coinY = 0;
let gameInterval = null;

// Elementos HTML
const hungerBar = document.getElementById('hunger-bar');
const happyBar = document.getElementById('happy-bar');
const energyBar = document.getElementById('energy-bar');
const coinCount = document.getElementById('coin-count');

const btnFeed = document.getElementById('btn-feed');
const btnPlay = document.getElementById('btn-play');
const btnSleep = document.getElementById('btn-sleep');

const pouContainer = document.getElementById('pou-container');
const pouMouth = document.getElementById('pou-mouth');
const room = document.getElementById('room');
const actionEffect = document.getElementById('action-effect');
const fallingCoin = document.getElementById('falling-coin');
const minigameControls = document.getElementById('minigame-controls');

// --- SISTEMA DE ÁUDIO SINTETIZADO ---
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

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

function playCoinSound() {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(987.77, ctx.currentTime); // B5
  osc.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.08); // E6
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.25);
}

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

// --- ATUALIZAR INTERFACE ---
function updateUI() {
  hungerBar.style.width = `${hunger}%`;
  happyBar.style.width = `${happy}%`;
  energyBar.style.width = `${energy}%`;
  coinCount.innerText = coins;

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
  if (value > 60) element.style.backgroundColor = '#66bb6a';
  else if (value > 30) element.style.backgroundColor = '#ffa726';
  else element.style.backgroundColor = '#ef5350';
}

// --- MINI-GAME DE PEGAR MOEDAS ---
function startMiniGame() {
  isPlayingGame = true;
  fallingCoin.classList.remove('hidden');
  minigameControls.classList.remove('hidden');
  btnPlay.innerText = '❌ Sair';

  coinY = 0;
  coinX = Math.floor(Math.random() * 280);
  fallingCoin.style.left = `${coinX}px`;

  gameInterval = setInterval(() => {
    coinY += 6;
    fallingCoin.style.top = `${coinY}px`;

    // Checar Colisão com o Pou
    if (coinY >= 320 && coinY <= 380 && Math.abs(coinX - pouX) < 50) {
      coins += 5;
      happy = Math.min(100, happy + 10);
      playCoinSound();
      resetCoin();
      updateUI();
    }

    // Se a moeda cair no chão
    if (coinY > 380) {
      resetCoin();
    }
  }, 30);
}

function stopMiniGame() {
  isPlayingGame = false;
  clearInterval(gameInterval);
  fallingCoin.classList.add('hidden');
  minigameControls.classList.add('hidden');
  btnPlay.innerText = '🎮 Jogar';
  
  // Retorna o Pou pro centro
  pouX = 110;
  pouContainer.style.left = `${pouX}px`;
}

function resetCoin() {
  coinY = 0;
  coinX = Math.floor(Math.random() * 280);
  fallingCoin.style.left = `${coinX}px`;
}

function movePou(direction) {
  if (direction === 'left') {
    pouX = Math.max(10, pouX - 25);
  } else if (direction === 'right') {
    pouX = Math.min(210, pouX + 25);
  }
  pouContainer.style.left = `${pouX}px`;
}

// --- EVENTOS DE CONTROLE DO MINI-GAME ---
document.addEventListener('keydown', (e) => {
  if (!isPlayingGame) return;
  if (e.key === 'ArrowLeft') movePou('left');
  if (e.key === 'ArrowRight') movePou('right');
});

document.getElementById('btn-left').addEventListener('click', () => movePou('left'));
document.getElementById('btn-right').addEventListener('click', () => movePou('right'));

// --- BOTÕES PRINCIPAIS ---
btnFeed.addEventListener('click', () => {
  if (isSleeping || isPlayingGame) return;
  if (hunger < 100) {
    hunger = Math.min(100, hunger + 25);
    playEatSound();
    showEffect('🍎');
    updateUI();
  }
});

btnPlay.addEventListener('click', () => {
  if (isSleeping) return;

  if (isPlayingGame) {
    stopMiniGame();
  } else {
    if (energy > 15) {
      energy = Math.max(0, energy - 15);
      startMiniGame();
      updateUI();
    }
  }
});

btnSleep.addEventListener('click', () => {
  if (isPlayingGame) stopMiniGame();

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

function showEffect(emoji) {
  actionEffect.innerText = emoji;
  actionEffect.classList.remove('hidden');
  setTimeout(() => actionEffect.classList.add('hidden'), 800);
}

pouContainer.addEventListener('click', () => {
  if (!isSleeping && !isPlayingGame && happy < 100) {
    happy = Math.min(100, happy + 5);
    playPopSound();
    showEffect('❤️');
    updateUI();
  }
});

// Loop principal de necessidades
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
  } else if (!isPlayingGame) {
    hunger = Math.max(0, hunger - 2);
    happy = Math.max(0, happy - 2);
    energy = Math.max(0, energy - 1);
  }
  updateUI();
}, 2500);

updateUI();
