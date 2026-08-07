document.addEventListener('DOMContentLoaded', () => {
  // TELAS E ELEMENTOS
  const loginScreen = document.getElementById('loginScreen');
  const mainScreen = document.getElementById('mainScreen');
  const settingsScreen = document.getElementById('settingsScreen');
  
  const chatListEl = document.getElementById('chatList');
  const messagesContainer = document.getElementById('messagesContainer');
  const activeChatName = document.getElementById('activeChatName');
  const activeChatAvatar = document.getElementById('activeChatAvatar');
  const chatStatus = document.getElementById('chatStatus');
  const msgInput = document.getElementById('msgInput');
  const chatForm = document.getElementById('chatForm');

  // ==========================================
  // BANCO DE DADOS (CONTATOS E MENSAGENS)
  // ==========================================
  let chatsData = JSON.parse(localStorage.getItem('gb_chats_data')) || {
    'Equipe GB': [
      { text: 'Seja bem-vindo ao WhatsApp GB! Clique no botão + para adicionar uma nova conversa.', type: 'received' }
    ]
  };
  let currentChat = localStorage.getItem('gb_current_chat') || 'Equipe GB';

  function saveChats() {
    localStorage.setItem('gb_chats_data', JSON.stringify(chatsData));
  }

  function renderChatList() {
    chatListEl.innerHTML = '';
    for (let contact in chatsData) {
      let msgs = chatsData[contact];
      let lastMsg = msgs.length > 0 ? msgs[msgs.length - 1].text : 'Nenhuma mensagem';
      let initials = contact.substring(0, 2).toUpperCase();

      const item = document.createElement('div');
      item.className = `chat-item ${contact === currentChat ? 'active' : ''}`;
      item.innerHTML = `
        <div class="avatar">${initials}</div>
        <div class="chat-info">
          <h4>${contact}</h4>
          <p>${lastMsg}</p>
        </div>
      `;
      // Clica para trocar de conversa
      item.addEventListener('click', () => {
        currentChat = contact;
        localStorage.setItem('gb_current_chat', currentChat);
        renderChatList();
        renderMessages();
      });
      chatListEl.appendChild(item);
    }
  }

  function renderMessages() {
    messagesContainer.innerHTML = '';
    activeChatName.innerText = currentChat;
    activeChatAvatar.innerText = currentChat.substring(0, 2).toUpperCase();
    
    let msgs = chatsData[currentChat] || [];
    msgs.forEach(msg => {
      const div = document.createElement('div');
      div.className = `message ${msg.type}`;
      div.innerText = msg.text;
      messagesContainer.appendChild(div);
    });
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // ==========================================
  // ADICIONAR NOVA CONVERSA (MODAL)
  // ==========================================
  const newChatBtn = document.getElementById('newChatBtn');
  const addContactModal = document.getElementById('addContactModal');
  const cancelAddContact = document.getElementById('cancelAddContact');
  const confirmAddContact = document.getElementById('confirmAddContact');
  const newContactName = document.getElementById('newContactName');

  newChatBtn.addEventListener('click', () => { 
    addContactModal.classList.add('active'); 
    newContactName.focus();
  });

  cancelAddContact.addEventListener('click', () => { 
    addContactModal.classList.remove('active'); 
    newContactName.value = ''; 
  });
  
  confirmAddContact.addEventListener('click', () => {
    let name = newContactName.value.trim();
    if (name) {
      if (!chatsData[name]) {
        chatsData[name] = [
          { text: `Conversa iniciada com ${name}. Diga olá!`, type: 'received' }
        ];
      }
      currentChat = name;
      localStorage.setItem('gb_current_chat', currentChat);
      saveChats();
      renderChatList();
      renderMessages();
      addContactModal.classList.remove('active');
      newContactName.value = '';
    } else {
      alert('Por favor, digite um nome válido.');
    }
  });

  // Permitir salvar apertando a tecla "Enter" no input do modal
  newContactName.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      confirmAddContact.click();
    }
  });

  // ==========================================
  // ENVIAR MENSAGENS
  // ==========================================
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = msgInput.value.trim();
    if (!text) return;

    if (!chatsData[currentChat]) {
      chatsData[currentChat] = [];
    }

    // Salva a msg enviada
    chatsData[currentChat].push({ text: text, type: 'sent' });
    msgInput.value = '';
    saveChats();
    renderMessages();
    renderChatList(); // Atualiza a prévia na barra lateral

    // Simula resposta automática após alguns segundos
    setTimeout(() => {
      chatStatus.innerText = "digitando...";
      chatStatus.style.color = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
    }, 500);

    setTimeout(() => {
      chatsData[currentChat].push({ text: `Mensagem recebida de ${currentChat}: "${text}"`, type: 'received' });
      chatStatus.innerText = "online";
      chatStatus.style.color = "#8696a0";
      saveChats();
      renderMessages();
      renderChatList();
    }, 2000);
  });

  // ==========================================
  // PERSONALIZAÇÃO (CORES, FONTES, PAPEL DE PAREDE, BALÕES)
  // ==========================================
  const colorDots = document.querySelectorAll('.color-dot');
  const fontSelector = document.getElementById('fontSelector');
  const wallpaperSelector = document.getElementById('wallpaperSelector');
  const bubbleSelector = document.getElementById('bubbleSelector');

  const savedColor = localStorage.getItem('gb_theme_color') || '#00a884';
  const savedFont = localStorage.getItem('gb_theme_font') || "'Poppins', sans-serif";
  const savedBg = localStorage.getItem('gb_theme_bg') || '#0b141a';
  const savedBubble = localStorage.getItem('gb_theme_bubble') || '8px';

  document.documentElement.style.setProperty('--primary-color', savedColor);
  document.documentElement.style.setProperty('--app-font', savedFont);
  document.documentElement.style.setProperty('--chat-bg', savedBg);
  document.documentElement.style.setProperty('--bubble-radius', savedBubble);
  
  if(fontSelector) fontSelector.value = savedFont;
  if(wallpaperSelector) wallpaperSelector.value = savedBg;
  if(bubbleSelector) bubbleSelector.value = savedBubble;

  colorDots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const c = e.target.getAttribute('data-color');
      document.documentElement.style.setProperty('--primary-color', c);
      localStorage.setItem('gb_theme_color', c);
    });
  });

  if(fontSelector) {
    fontSelector.addEventListener('change', (e) => {
      document.documentElement.style.setProperty('--app-font', e.target.value);
      localStorage.setItem('gb_theme_font', e.target.value);
    });
  }

  if(wallpaperSelector) {
    wallpaperSelector.addEventListener('change', (e) => {
      document.documentElement.style.setProperty('--chat-bg', e.target.value);
      localStorage.setItem('gb_theme_bg', e.target.value);
    });
  }

  if(bubbleSelector) {
    bubbleSelector.addEventListener('change', (e) => {
      document.documentElement.style.setProperty('--bubble-radius', e.target.value);
      localStorage.setItem('gb_theme_bubble', e.target.value);
    });
  }

  // ==========================================
  // NAVEGAÇÃO E LOGIN 
  // ==========================================
  if (localStorage.getItem('gb_user_phone')) {
    loginScreen.classList.remove('active'); 
    mainScreen.classList.add('active');
    renderChatList(); 
    renderMessages();
  }

  const loginBtn = document.getElementById('loginBtn');
  const phoneInput = document.getElementById('phoneInput');
  const logoutBtn = document.getElementById('logoutBtn');

  if(loginBtn) {
    loginBtn.addEventListener('click', () => {
      if(phoneInput && phoneInput.value.trim() === '') return alert("Insira o número.");
      localStorage.setItem('gb_user_phone', phoneInput ? phoneInput.value : 'logged');
      loginScreen.classList.remove('active'); 
      mainScreen.classList.add('active');
      renderChatList(); 
      renderMessages();
    });
  }

  if(logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('gb_user_phone');
      settingsScreen.classList.remove('active'); 
      loginScreen.classList.add('active');
    });
  }

  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const dropdownMenu = document.getElementById('dropdownMenu');
  
  if(menuToggleBtn && dropdownMenu) {
    menuToggleBtn.addEventListener('click', (e) => { 
      e.stopPropagation(); 
      dropdownMenu.classList.toggle('show'); 
    });
    document.addEventListener('click', (e) => { 
      if (!dropdownMenu.contains(e.target) && e.target !== menuToggleBtn) {
        dropdownMenu.classList.remove('show');
      } 
    });
  }

  const goToSettingsBtn = document.getElementById('goToSettingsBtn');
  const backToMainBtn = document.getElementById('backToMainBtn');

  if(goToSettingsBtn) {
    goToSettingsBtn.addEventListener('click', () => {
      dropdownMenu.classList.remove('show'); 
      mainScreen.classList.remove('active'); 
      settingsScreen.classList.add('active');
    });
  }
  
  if(backToMainBtn) {
    backToMainBtn.addEventListener('click', () => {
      settingsScreen.classList.remove('active'); 
      mainScreen.classList.add('active');
    });
  }
});
                          
