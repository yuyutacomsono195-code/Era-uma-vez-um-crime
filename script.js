document.addEventListener('DOMContentLoaded', () => {
  // TELAS
  const loginScreen = document.getElementById('loginScreen');
  const mainScreen = document.getElementById('mainScreen');
  const settingsScreen = document.getElementById('settingsScreen');

  // ELEMENTOS DO LOGIN
  const loginBtn = document.getElementById('loginBtn');
  const phoneInput = document.getElementById('phoneInput');
  const logoutBtn = document.getElementById('logoutBtn');

  // ELEMENTOS DO CHAT E MENU
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const dropdownMenu = document.getElementById('dropdownMenu');
  const goToSettingsBtn = document.getElementById('goToSettingsBtn');
  const backToMainBtn = document.getElementById('backToMainBtn');
  const chatForm = document.getElementById('chatForm');
  const msgInput = document.getElementById('msgInput');
  const messagesContainer = document.getElementById('messagesContainer');
  const chatStatus = document.getElementById('chatStatus');
  const lastMessagePreview = document.getElementById('lastMessagePreview');

  // ==========================================
  // 1. LÓGICA DE LOGIN (Salva no LocalStorage)
  // ==========================================
  
  // Verifica se o usuário já fez login antes
  const savedPhone = localStorage.getItem('gb_user_phone');
  if (savedPhone) {
    loginScreen.classList.remove('active');
    mainScreen.classList.add('active');
  }

  // Fazer Login
  loginBtn.addEventListener('click', () => {
    const phoneNumber = phoneInput.value.trim();
    if(phoneNumber === '') {
      alert("Por favor, insira seu número para continuar.");
      return;
    }
    
    // Salva o número no navegador
    localStorage.setItem('gb_user_phone', phoneNumber);
    
    // Troca de tela
    loginScreen.classList.remove('active');
    mainScreen.classList.add('active');
  });

  // Fazer Logout (Botão adicionado nas configurações)
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('gb_user_phone');
    settingsScreen.classList.remove('active');
    loginScreen.classList.add('active');
    phoneInput.value = '';
  });

  // ==========================================
  // 2. LÓGICA DO MENU DE 3 PONTINHOS
  // ==========================================
  menuToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('show');
  });

  document.addEventListener('click', (e) => {
    if (!dropdownMenu.contains(e.target) && e.target !== menuToggleBtn) {
      dropdownMenu.classList.remove('show');
    }
  });

  goToSettingsBtn.addEventListener('click', () => {
    dropdownMenu.classList.remove('show');
    mainScreen.classList.remove('active');
    settingsScreen.classList.add('active');
  });

  backToMainBtn.addEventListener('click', () => {
    settingsScreen.classList.remove('active');
    mainScreen.classList.add('active');
  });

  // ==========================================
  // 3. LÓGICA DO CHAT (Envio e Resposta Automática)
  // ==========================================
  
  // Função para criar a bolha de mensagem na tela
  function addMessage(text, type) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', type);
    msgDiv.innerText = text;
    messagesContainer.appendChild(msgDiv);
    
    // Rola para a mensagem mais recente
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Atualiza o preview na barra lateral
    lastMessagePreview.innerText = text;
  }

  // Evento de envio do formulário
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Impede a página de recarregar
    
    const text = msgInput.value.trim();
    if (!text) return; // Não envia vazio

    // Adiciona a mensagem que o usuário enviou
    addMessage(text, 'sent');
    msgInput.value = ''; // Limpa o input
    
    // Simula a Equipe GB "Digitando..."
    setTimeout(() => {
      chatStatus.innerText = "digitando...";
      chatStatus.style.color = "#00a884";
    }, 500);

    // Simula a resposta da Equipe GB após 2 segundos
    setTimeout(() => {
      addMessage("Esta é uma resposta automática do sistema GB! Tudo funcionando perfeitamente.", 'received');
      chatStatus.innerText = "online";
      chatStatus.style.color = "#8696a0";
    }, 2500);
  });
});
                                   
