// Atributos Principais
let hunger = 100;
let happy = 100;
let energy = 100;
let coins = 50;
let isDirty = false;
let isSleeping = false;

// Estado dos Cômodos
const rooms = ['quarto', 'cozinha', 'banheiro', 'jogos', 'conversa', 'closet', 'laboratorio'];
const roomNames = {
  quarto: 'Quarto',
  cozinha: 'Cozinha',
  banheiro: 'Banheiro',
  jogos: 'Sala de Jogos',
  conversa: 'Chat com Amigo',
  closet: 'Guarda-Roupa',
  laboratorio: 'Laboratório'
};
let currentRoomIndex = 0;

// Mini-Game Vars
let isPlayingGame = false;
let pouX = 105;
let coinX = 150;
let coinY = 0;
let gameInterval = null;

// Elementos HTML
const roomEl = document.getElementById('room');
const roomTitleEl = document.getElementById('room-title');
const roomActionsEl = document.getElementById('room-actions');
const pouContainer = document.getElementById('pou-container');
const pouBody = document.getElementById('pou-body');
const pouMouth = document.getElementById('pou-mouth');
const pouDirt = document.getElementById('pou-dirt');

const accGlasses = document.getElementById('acc-glasses');
const accBow = document.getElementById('acc-bow');

const chatBox = document.getElementById('chat-box');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const btnSendChat = document.getElementById('btn-send-chat');

const fallingCoin = document.getElementById('falling-coin');
const minigameControls = document.getElementById('minigame-controls');
const actionEffect = document.getElementById('action-effect');

// --- ÁUDIO SINTETIZADO ---
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playSound(freqStart, freqEnd, type = 'sine', duration = 0.15) {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freqStart, ctx.currentTime);
  if (freqEnd) osc.frequency.exponentialRampToValueAtTime(freqEnd, ctx.currentTime + duration);
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

// --- NAVEGAÇÃO DE SALAS ---
document.getElementById('btn-prev-room').addEventListener('click', () => changeRoom(-1));
document.getElementById('btn-next-room').addEventListener('click', () => changeRoom(1));

function changeRoom(dir) {
  if (isPlayingGame) stopMiniGame();
  
  playSound(400, 300, 'sine', 0.08);
  currentRoomIndex = (currentRoomIndex + dir + rooms.length) % rooms.length;
  updateRoomView();
}

function updateRoomView() {
  const currentRoom = rooms[currentRoomIndex];
  
  // Reseta classe da sala
  roomEl.className = `room ${currentRoom}`;
  if (isSleeping && currentRoom === 'quarto') roomEl.classList.add('night');
  roomTitleEl.innerText = roomNames[currentRoom];

  // Esconde elementos específicos
  chatBox.classList.add('hidden');
  pouDirt.classList.toggle('hidden', !isDirty || currentRoom !== 'banheiro');

  // Atualiza Botões do Rodapé conforme a Sala
  roomActionsEl.innerHTML = '';
  
  if (currentRoom === 'quarto') {
    addActionButton(isSleeping ? '☀️ Acordar' : '💤 Dormir', toggleSleep);
  } else if (currentRoom === 'cozinha') {
    addActionButton('🍎 Maçã (Grátis)', () => feedPou('🍎', 15));
    addActionButton('🍕 Pizza (10 🪙)', () => feedPou('🍕', 35, 10));
  } else if (currentRoom === 'banheiro') {
    addActionButton('🧼 Limpar Pou', cleanPou);
  } else if (currentRoom === 'jogos') {
    addActionButton(isPlayingGame ? '❌ Sair' : '🎮 Pegar Moedas', toggleMiniGame);
  } else if (currentRoom === 'conversa') {
    chatBox.classList.remove('hidden');
  } else if (currentRoom === 'closet') {
    addActionButton('👓 Óculos', () => toggleAccessory(accGlasses));
    addActionButton('🎀 Gravata', () => toggleAccessory(accBow));
    addActionButton('🎨 Cor Rosa', () => changePouColor('#ec407a'));
    addActionButton('🎨 Cor Clássica', () => changePouColor('#b08d57'));
  } else if (currentRoom === 'laboratorio') {
    addActionButton('🧪 Poção Saúde (15 🪙)', () => buyPotion('health'));
    addActionButton('⚡ Energia Max (20 🪙)', () => buyPotion('energy'));
  }
}

function addActionButton(text, callback) {
  const btn = document.createElement('button');
  btn.className = 'btn';
  btn.innerText = text;
  btn.onclick = callback;
  roomActionsEl.appendChild(btn);
}

// --- LÓGICA DE AÇÕES ---
function feedPou(emoji, amount, cost = 0) {
  if (isSleeping) return;
  if (cost > 0 && coins < cost) return alert('Moedas insuficientes!');
  
  if (hunger < 100) {
    coins -= cost;
    hunger = Math.min(100, hunger + amount);
    playSound(300, 150, 'triangle', 0.15);
    showEffect(emoji);
    updateUI();
  }
}

function cleanPou() {
  if (isDirty) {
    isDirty = false;
    happy = Math.min(100, happy + 20);
    playSound(500, 800, 'sine', 0.2);
    showEffect('✨');
    updateRoomView();
    updateUI();
  }
}

function toggleSleep() {
  isSleeping = !isSleeping;
  playSound(120, null, 'square', 0.08);
  updateRoomView();
  updateUI();
}

function toggleAccessory(el) {
  el.classList.toggle('hidden');
  playSound(600, 700, 'sine', 0.1);
}

function changePouColor(color) {
  pouBody.setAttribute('fill', color);
  playSound(500, 600, 'sine', 0.1);
}

function buyPotion(type) {
  if (type === 'health' && coins >= 15) {
    coins -= 15;
    hunger = 100;
    happy = 100;
    showEffect('🧪');
    playSound(300, 900, 'sine', 0.3);
  } else if (type === 'energy' && coins >= 20) {
    coins -= 20;
    energy = 100;
    showEffect('⚡');
    playSound(300, 900, 'sine', 0.3);
  }
  updateUI();
}

// --- SIMULAÇÃO DE CHAT ---
btnSendChat.addEventListener('click', sendChatMessage);
chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendChatMessage(); });

function sendChatMessage() {
  const txt = chatInput.value.trim();
  if (!txt) return;

  appendMsg('user', `Você: ${txt}`);
  chatInput.value = '';
  playSound(400, 500, 'sine', 0.05);

  setTimeout(() => {
    const replies = ["Que legal!", "O Pou está muito fofo hoje!", "Vamos jogar?", "Haha verdade!"];
    const randReply = replies[Math.floor(Math.random() * replies.length)];
    appendMsg('friend', `Amigo: ${randReply}`);
    playSound(600, 400, 'sine', 0.1);
  }, 1000);
}

function appendMsg(cls, text) {
  const d = document.createElement('div');
  d.className = `msg ${cls}`;
  d.innerText = text;
  chatMessages.appendChild(d);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// --- MINI-GAME ---
function toggleMiniGame() {
  if (isPlayingGame) stopMiniGame();
  else if (energy > 10) startMiniGame();
}

function startMiniGame() {
  isPlayingGame = true;
  fallingCoin.classList.remove('hidden');
  minigameControls.classList.remove('hidden');
  updateRoomView();

  coinY = 0;
  coinX = Math.floor(Math.random() * 260);
  fallingCoin.style.left = `${coinX}px`;

  gameInterval = setInterval(() => {
    coinY += 6;
    fallingCoin.style.top = `${coinY}px`;

    if (coinY >= 320 && coinY <= 380 && Math.abs(coinX - pouX) < 45) {
      coins += 5;
      happy = Math.min(100, happy + 5);
      playSound(987, 1318, 'sine', 0.2);
      resetCoin();
      updateUI();
    }

    if (coinY > 380) resetCoin();
  }, 30);
}

function stopMiniGame() {
  isPlayingGame = false;
  clearInterval(gameInterval);
  fallingCoin.classList.add('hidden');
  minigameControls.classList.add('hidden');
  pouX = 105;
  pouContainer.style.left = `${pouX}px`;
  updateRoomView();
}

function resetCoin() {
  coinY = 0;
  coinX = Math.floor(Math.random() * 260);
  fallingCoin.style.left = `${coinX}px`;
}

function movePou(dir) {
  pouX = dir === 'left' ? Math.max(10, pouX - 25) : Math.min(210, pouX + 25);
  pouContainer.style.left = `${pouX}px`;
}

document.addEventListener('keydown', (e) => {
  if (!isPlayingGame) return;
  if (e.key === 'ArrowLeft') movePou('left');
  if (e.key === 'ArrowRight') movePou('right');
});

document.getElementById('btn-left').addEventListener('click', () => movePou('left'));
document.getElementById('btn-right').addEventListener('click', () => movePou('right'));

// --- INTERFACE E CICLO ---
function updateUI() {
  document.getElementById('hunger-bar').style.width = `${hunger}%`;
  document.getElementById('happy-bar').style.width = `${happy}%`;
  document.getElementById('energy-bar').style.width = `${energy}%`;
  document.getElementById('coin-count').innerText = coins;

  if (isSleeping) pouMouth.setAttribute('d', 'M 85 150 Q 100 150 115 150');
  else if (hunger < 30 || happy < 30) pouMouth.setAttribute('d', 'M 80 155 Q 100 135 120 155');
  else pouMouth.setAttribute('d', 'M 80 145 Q 100 160 120 145');
}

function showEffect(emoji) {
  actionEffect.innerText = emoji;
  actionEffect.classList.remove('hidden');
  setTimeout(() => actionEffect.classList.add('hidden'), 800);
}

// Loop Principal do Jogo
setInterval(() => {
  if (isSleeping) {
    if (energy < 100) energy = Math.min(100, energy + 8);
    else toggleSleep();
  } else if (!isPlayingGame) {
    hunger = Math.max(0, hunger - 2);
    happy = Math.max(0, happy - 2);
    energy = Math.max(0, energy - 1);
    
    // Chance de o Pou ficar sujo com o tempo
    if (Math.random() < 0.1 && !isDirty) {
      isDirty = true;
      if (rooms[currentRoomIndex] === 'banheiro') updateRoomView();
    }
  }
  updateUI();
}, 3000);

// Inicializar
updateRoomView();
updateUI();
  
