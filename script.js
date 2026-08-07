document.addEventListener('DOMContentLoaded', () => {
  // TELAS
  const loginScreen = document.getElementById('loginScreen');
  const mainScreen = document.getElementById('mainScreen');
  const settingsScreen = document.getElementById('settingsScreen');

  // ELEMENTOS
  const loginBtn = document.getElementById('loginBtn');
  const phoneInput = document.getElementById('phoneInput');
  const logoutBtn = document.getElementById('logoutBtn');
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
  // PERSONALIZAÇÃO (CORES E FONTES)
  // ==========================================
  const colorDots = document.querySelectorAll('.color-dot');
  const fontSelector = document.getElementById('fontSelector');

  // Carrega as configurações salvas ou usa o padrão
  const savedColor = localStorage.getItem('gb_theme_color') || '#00a884';
  const savedFont = localStorage.getItem('gb_theme_font') || "'Poppins', sans-serif";

  // Aplica as configurações salvas assim que a página abre
  document.documentElement.style.setProperty('--primary-color', savedColor);
  document.documentElement.style.setProperty('--app-font', savedFont);
  fontSelector.value = savedFont;

  // Muda a cor quando clica nas bolinhas coloridas
  colorDots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const selectedColor = e.target.getAttribute('data-color');
      document.documentElement.style.setProperty('--primary-color', selectedColor);
      localStorage.setItem('gb_theme_color', selectedColor); // Salva no navegador
    });
  });

  // Muda a fonte quando seleciona no menu
  fontSelector.addEventListener('change', (e) => {
    const selectedFont = e.target.value;
    document.documentElement.style.setProperty('--app-font', selectedFont);
    localStorage.setItem('gb_theme_font', selectedFont); // Salva no navegador
  });

  // ==========================================
  // LÓGICA DE LOGIN 
  // ==========================================
  const savedPhone = localStorage.getItem('gb_user_phone');
  if (savedPhone) {
    loginScreen.classList.remove('active');
    mainScreen.classList.add('active');
  }

  loginBtn.addEventListener('click', () => {
    const phoneNumber = phoneInput.value.trim();
    if(phoneNumber === '') {
      alert("Por favor, insira seu número para continuar.");
      return;
    }
    localStorage.setItem('gb_user_phone', phoneNumber);
    loginScreen.classList.remove('active');
    mainScreen.classList.add('active');
  });

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('gb_user_phone');
    settingsScreen.classList.remove('active');
    loginScreen.classList.add('active');
    phoneInput.value = '';
  });

  // ==========================================
  // LÓGICA DO MENU DE 3 PONTINHOS
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
  // LÓGICA DO CHAT (Envio e Resposta Automática)
  // ==========================================
  function addMessage(text, type) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', type);
    msgDiv.innerText = text;
    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    lastMessagePreview.innerText = text;
  }

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault(); 
    
    const text = msgInput.value.trim();
    if (!text) return; 

    addMessage(text, 'sent');
    msgInput.value = ''; 
    
    setTimeout(() => {
      chatStatus.innerText = "digitando...";
      // Usa a cor primária dinâmica para o status
      chatStatus.style.color = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
    }, 500);

    setTimeout(() => {
      addMessage("As configurações de personalização já estão funcionando!", 'received');
      chatStatus.innerText = "online";
      chatStatus.style.color = "#8696a0";
    }, 2500);
  });
});
