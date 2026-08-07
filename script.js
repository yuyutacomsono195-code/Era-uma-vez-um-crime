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
  let chatsData = {
    'Equipe GB': [
      { text: 'Seja bem-vindo ao WhatsApp GB! Teste os novos temas e adicione contatos.', type: 'received' }
    ]
  };
  let currentChat = 'Equipe GB';

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
      // Clica para trocar de chat
      item.addEventListener('click', () => {
        currentChat = contact;
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
  // ADICIONAR NOVO CONTATO
  // ==========================================
  const newChatBtn = document.getElementById('newChatBtn');
  const addContactModal = document.getElementById('addContactModal');
  const cancelAddContact = document.getElementById('cancelAddContact');
  const confirmAddContact = document.getElementById('confirmAddContact');
  const newContactName = document.getElementById('newContactName');

  newChatBtn.addEventListener('click', () => { addContactModal.classList.add('active'); });
  cancelAddContact.addEventListener('click', () => { addContactModal.classList.remove('active'); newContactName.value = ''; });
  
  confirmAddContact.addEventListener('click', () => {
    let name = newContactName.value.trim();
    if (name && !chatsData[name]) {
      chatsData[name] = []; // Cria a conversa vazia
      currentChat = name; // Muda pra ela
      renderChatList();
      renderMessages();
      addContactModal.classList.remove('active');
      newContactName.value = '';
    } else if (chatsData[name]) {
      alert('Esse contato já existe!');
    }
  });

  // ==========================================
  // ENVIAR MENSAGENS
  // ==========================================
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = msgInput.value.trim();
    if (!text) return;

    // Salva a msg enviada
    chatsData[currentChat].push({ text: text, type: 'sent' });
    msgInput.value = '';
    renderMessages();
    renderChatList(); // Atualiza a prévia na barra lateral

    // Simula resposta após 1.5s
    setTimeout(() => {
      chatStatus.innerText = "digitando...";
      chatStatus.style.color = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
    }, 500);

    setTimeout(() => {
      chatsData[currentChat].push({ text: `Oi! Você enviou: "${text}"`, type: 'received' });
      chatStatus.innerText = "online";
      chatStatus.style.color = "#8696a0";
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

  // Load Saved
  const savedColor = localStorage.getItem('gb_theme_color') || '#00a884';
  const savedFont = localStorage.getItem('gb_theme_font') || "'Poppins', sans-serif";
  const savedBg = localStorage.getItem('gb_theme_bg') || '#0b141a';
  const savedBubble = localStorage.getItem('gb_theme_bubble') || '8px';

  document.documentElement.style.setProperty('--primary-color', savedColor);
  document.documentElement.style.setProperty('--app-font', savedFont);
  document.documentElement.style.setProperty('--chat-bg', savedBg);
  document.documentElement.style.setProperty('--bubble-radius', savedBubble);
  
  fontSelector.value = savedFont;
  wallpaperSelector.value = savedBg;
  bubbleSelector.value = savedBubble;

  colorDots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const c = e.target.getAttribute('data-color');
      document.documentElement.style.setProperty('--primary-color', c);
      localStorage.setItem('gb_theme_color', c);
    });
  });

  fontSelector.addEventListener('change', (e) => {
    document.documentElement.style.setProperty('--app-font', e.target.value);
    localStorage.setItem('gb_theme_font', e.target.value);
  });

  wallpaperSelector.addEventListener('change', (e) => {
    document.documentElement.style.setProperty('--chat-bg', e.target.value);
    localStorage.setItem('gb_theme_bg', e.target.value);
  });

  bubbleSelector.addEventListener('change', (e) => {
    document.documentElement.style.setProperty('--bubble-radius', e.target.value);
    localStorage.setItem('gb_theme_bubble', e.target.value);
  });

  // ==========================================
  // NAVEGAÇÃO E LOGIN 
  // ==========================================
  if (localStorage.getItem('gb_user_phone')) {
    loginScreen.classList.remove('active'); mainScreen.classList.add('active');
    renderChatList(); renderMessages();
  }

  document.getElementById('loginBtn').addEventListener('click', () => {
    if(document.getElementById('phoneInput').value.trim() === '') return alert("Insira o número.");
    localStorage.setItem('gb_user_phone', 'logged');
    loginScreen.classList.remove('active'); mainScreen.classList.add('active');
    renderChatList(); renderMessages();
  });

  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('gb_user_phone');
    settingsScreen.classList.remove('active'); loginScreen.classList.add('active');
  });

  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const dropdownMenu = document.getElementById('dropdownMenu');
  menuToggleBtn.addEventListener('click', (e) => { e.stopPropagation(); dropdownMenu.classList.toggle('show'); });
  document.addEventListener('click', (e) => { if (!dropdownMenu.contains(e.target) && e.target !== menuToggleBtn) dropdownMenu.classList.remove('show'); });

  document.getElementById('goToSettingsBtn').addEventListener('click', () => {
    dropdownMenu.classList.remove('show'); mainScreen.classList.remove('active'); settingsScreen.classList.add('active');
  });
  document.getElementById('backToMainBtn').addEventListener('click', () => {
    settingsScreen.classList.remove('active'); mainScreen.classList.add('active');
  });

});
        
