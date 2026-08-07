// Seleção das Telas
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const btnStart = document.getElementById('btn-start');

// Seleção dos elementos da Fazenda
const farmLevelDisplay = document.getElementById('farm-level');
const catCountDisplay = document.getElementById('cat-count');
const farmArea = document.getElementById('farm-area');
const btnAdopt = document.getElementById('btn-adopt');
const btnCare = document.getElementById('btn-care');
const gameMessage = document.getElementById('game-message');

// Variáveis de controle do jogo
let nivelFazenda = 1;
let quantidadeGatos = 0;
let experiencia (xp) = 0;

// Emojis sortidos para os gatos da fazenda
const emojisGatos = ['🐱', '🐈', '😹', '😻', '😼', '😽'];

// 1. Lógica para INICIAR O JOGO (Trocar de tela)
btnStart.addEventListener('click', function() {
  startScreen.classList.add('hidden');    // Esconde tela 1
  gameScreen.classList.remove('hidden');  // Mostra tela 2
});

// 2. Lógica para ADOTAR GATOS
btnAdopt.addEventListener('click', function() {
  quantidadeGatos++;
  catCountDisplay.innerText = quantidadeGatos;
  
  // Cria um novo elemento de texto para o gatinho
  const novoGato = document.createElement('div');
  novoGato.classList.add('farm-cat');
  
  // Escolhe um emoji aleatório da nossa lista
  let gatoAleatorio = emojisGatos[Math.floor(Math.random() * emojisGatos.length)];
  novoGato.innerText = gatoAleatorio;
  
  // Coloca o gatinho na fazenda (no HTML)
  farmArea.appendChild(novoGato);

  gameMessage.style.color = "#ff4757";
  gameMessage.innerText = "Você adotou um novo gatinho! ❤️";
});

// 3. Lógica para CUIDAR e EVOLUIR A FAZENDA
btnCare.addEventListener('click', function() {
  // Se não tiver gatos, não dá pra cuidar
  if (quantidadeGatos === 0) {
    gameMessage.style.color = "orange";
    gameMessage.innerText = "Adote um gatinho primeiro!";
    return;
  }

  // Ganha XP (10 pontos para cada gato que você tem)
  xp += quantidadeGatos * 10;
  gameMessage.style.color = "#2ed573";
  gameMessage.innerText = `Você cuidou dos gatos e ganhou ${quantidadeGatos * 10} XP! ✨`;

  // Verifica se tem XP suficiente para evoluir de nível (A cada 50 XP)
  if (xp >= 50) {
    nivelFazenda++;
    xp = 0; // Zera o XP para buscar o próximo nível
    farmLevelDisplay.innerText = nivelFazenda;
    
    gameMessage.innerText = `🎉 Parabéns! Sua fazenda subiu para o nível ${nivelFazenda}! 🎉`;
    
    // Melhora o visual da fazenda a cada nível
    if (nivelFazenda === 2) {
      farmArea.style.backgroundColor = "#7bed9f"; // Fica verde grama
    } else if (nivelFazenda === 3) {
      farmArea.style.backgroundColor = "#70a1ff"; // Ganha um lago (azul)
    } else if (nivelFazenda >= 4) {
      farmArea.style.backgroundColor = "#ffd32a"; // Vira uma fazenda dourada
    }
  }
});
