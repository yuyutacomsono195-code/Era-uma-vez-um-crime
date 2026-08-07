document.addEventListener('DOMContentLoaded', () => {
  const loginScreen = document.getElementById('loginScreen');
  const verifyScreen = document.getElementById('verifyScreen');
  const mainScreen = document.getElementById('mainScreen');
  const settingsScreen = document.getElementById('settingsScreen');
  
  const chatListEl = document.getElementById('chatList');
  const messagesContainer = document.getElementById('messagesContainer');
  const activeChatName = document.getElementById('activeChatName');
  const activeChatAvatar = document.getElementById('activeChatAvatar');
  const chatStatus = document.getElementById('chatStatus');
  const msgInput = document.getElementById('msgInput');
  const chatForm = document.getElementById('chatForm');

  let chatsData = JSON.parse(localStorage.getItem('whatsapp_chats')) || {
    'Equipe WhatsApp': {
      phone: '+55 11 99999-9999',
      messages: [{ text: 'Bem-vindo ao WhatsApp! Suas conversas estão protegidas.', type: 'received' }]
    }
  };
  let currentChat = localStorage.getItem('whatsapp_current_chat') || 'Equipe WhatsApp';

  function saveChats() {
    localStorage.setItem('whatsapp_chats', JSON.stringify(chatsData));
  }

  function renderChatList() {
    chatListEl.innerHTML = '';
    for (let contact in chatsData) {
      let chatObj = chatsData[contact];
      let msgs = chatObj.messages || [];
      let lastMsg = msgs.length > 0 ? (msgs[msgs.length - 1].text || 'Mídia enviada') : 'Nenhuma mensagem';
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
      item.addEventListener('click', () => {
        currentChat = contact;
        localStorage.setItem('whatsapp_current_chat', currentChat);
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
    
    let chatObj = chatsData[currentChat];
    let msgs = chatObj ? chatObj.messages : [];
    
    msgs.forEach(msg => {
      const div = document.createElement('div');
      div.className = `message ${msg.type}`;
      div.innerHTML = msg.html || msg.text;
      messagesContainer.appendChild(div);
    });
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Abas (Conversas, Status, Chamadas)
  const tabs = document.querySelectorAll('.whatsapp-tabs .tab');
  const statusTabContent = document.getElementById('statusTabContent');
  const callsTabContent = document.getElementById('callsTabContent');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const tabName = tab.getAttribute('data-tab');
      chatListEl.style.display = 'none';
      if(statusTabContent) statusTabContent.style.display = 'none';
      if(callsTabContent) callsTabContent.style.display = 'none';
      
      if(tabName === 'chats') chatListEl.style.display = 'block';
      if(tabName === 'status' && statusTabContent) statusTabContent.style.display = 'block';
      if(tabName === 'calls' && callsTabContent) callsTabContent.style.display = 'block';
    });
  });

  // Novo Contato Modal
  const newChatBtn = document.getElementById('newChatBtn');
  const addContactModal = document.getElementById('addContactModal');
  const cancelAddContact = document.getElementById('cancelAddContact');
  const confirmAddContact = document.getElementById('confirmAddContact');
  const newContactName = document.getElementById('newContactName');
  const newContactPhone = document.getElementById('newContactPhone');

  if(newChatBtn) newChatBtn.addEventListener('click', () => addContactModal.classList.add('active'));
  if(cancelAddContact) cancelAddContact.addEventListener('click', () => addContactModal.classList.remove('active'));
  
  if(confirmAddContact) {
    confirmAddContact.addEventListener('click', () => {
      let name = newContactName ? newContactName.value.trim() : '';
      let phone = newContactPhone ? newContactPhone.value.trim() : '';

      if (name) {
        if (!chatsData[name]) {
          chatsData[name] = { phone: phone || '', messages: [{ text: `Conversa iniciada com ${name}.`, type: 'received' }] };
        }
        currentChat = name;
        localStorage.setItem('whatsapp_current_chat', currentChat);
        saveChats();
        renderChatList();
        renderMessages();
        addContactModal.classList.remove('active');
        newContactName.value = '';
        if(newContactPhone) newContactPhone.value = '';
      } else {
        alert('Digite o nome do contato.');
      }
    });
  }

  // Enviar Mensagem
  if(chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = msgInput.value.trim();
      if (!text) return;

      if (!chatsData[currentChat]) chatsData[currentChat] = { messages: [] };

      chatsData[currentChat].messages.push({ text: text, type: 'sent' });
      msgInput.value = '';
      saveChats();
      renderMessages();
      renderChatList();

      setTimeout(() => { chatStatus.innerText = "digitando..."; }, 500);
      setTimeout(() => {
        chatsData[currentChat].messages.push({ text: `Echo: ${text}`, type: 'received' });
        chatStatus.innerText = "online";
        saveChats();
        renderMessages();
        renderChatList();
      }, 1500);
    });
  }

  // Câmera e Microfone
  let mediaRecorder;
  let audioChunks = [];

  window.toggleAudioRecord = async function() {
    try {
      if (!mediaRecorder || mediaRecorder.state === "inactive") {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = event => audioChunks.push(event.data);
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
          const audioUrl = URL.createObjectURL(audioBlob);
          if (!chatsData[currentChat]) chatsData[currentChat] = { messages: [] };
          chatsData[currentChat].messages.push({ html: `<audio controls src="${audioUrl}"></audio>`, type: 'sent' });
          saveChats();
          renderMessages();
          renderChatList();
        };

        mediaRecorder.start();
        alert("Gravando áudio... Clique novamente para enviar.");
      } else {
        mediaRecorder.stop();
        alert("Áudio enviado!");
      }
    } catch (err) {
      alert("Erro ao acessar microfone.");
    }
  };

  window.takeCameraPhoto = async function() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 240;
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      stream.getTracks().forEach(track => track.stop());

      const photoUrl = canvas.toDataURL('image/png');
      if (!chatsData[currentChat]) chatsData[currentChat] = { messages: [] };
      chatsData[currentChat].messages.push({ html: `<img src="${photoUrl}" style="max-width:100%; border-radius:8px;" />`, type: 'sent' });
      saveChats();
      renderMessages();
      renderChatList();
    } catch (err) {
      alert("Erro ao acessar câmera.");
    }
  };

  // Chamadas
  const audioCallBtn = document.getElementById('audioCallBtn');
  const videoCallBtn = document.getElementById('videoCallBtn');

  async function makeCall(isVideo) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: isVideo });
      let callWindow = window.open("", "CallWindow", "width=400,height=500");
      callWindow.document.write(`
        <body style="background:#111; color:#fff; text-align:center; font-family:sans-serif; padding-top:40px;">
          <h2>Ligação com ${currentChat}</h2>
          ${isVideo ? '<video id="localVideo" autoplay playsinline style="width:80%; border-radius:10px; margin-top:20px;"></video>' : '<p>Conectado...</p>'}
          <br><br>
          <button onclick="window.close()" style="background:red; color:#fff; border:none; padding:12px 25px; border-radius:20px; cursor:pointer;">Encerrar</button>
        </body>
      `);
      if (isVideo) {
        setTimeout(() => {
          let vEl = callWindow.document.getElementById('localVideo');
          if(vEl) vEl.srcObject = stream;
        }, 500);
      }
      callWindow.onunload = () => stream.getTracks().forEach(t => t.stop());
    } catch (err) {
      alert("Erro ao iniciar chamada.");
    }
  }

  if(audioCallBtn) audioCallBtn.addEventListener('click', () => makeCall(false));
  if(videoCallBtn) videoCallBtn.addEventListener('click', () => makeCall(true));

  // Fluxo de Login com Verificação de Código
  if (localStorage.getItem('whatsapp_phone')) {
    loginScreen.classList.remove('active'); 
    verifyScreen.classList.remove('active');
    mainScreen.classList.add('active');
    renderChatList(); 
    renderMessages();
  }

  const loginBtn = document.getElementById('loginBtn');
  const phoneInput = document.getElementById('phoneInput');
  const verifyBtn = document.getElementById('verifyBtn');
  const verifyCodeInput = document.getElementById('verifyCodeInput');
  const logoutBtn = document.getElementById('logoutBtn');

  if(loginBtn) {
    loginBtn.addEventListener('click', () => {
      if(phoneInput && !phoneInput.value.trim()) return alert("Insira o número de telefone.");
      // Vai para a tela de verificação de código
      loginScreen.classList.remove('active');
      verifyScreen.classList.add('active');
      if(verifyCodeInput) verifyCodeInput.focus();
    });
  }

  if(verifyBtn) {
    verifyBtn.addEventListener('click', () => {
      const code = verifyCodeInput ? verifyCodeInput.value.trim() : '';
      if(code.length < 4) return alert("Insira um código válido.");

      localStorage.setItem('whatsapp_phone', phoneInput ? phoneInput.value : 'active');
      verifyScreen.classList.remove('active'); 
      mainScreen.classList.add('active');
      renderChatList(); 
      renderMessages();
    });
  }

  if(logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('whatsapp_phone');
      settingsScreen.classList.remove('active'); 
      loginScreen.classList.add('active');
      if(phoneInput) phoneInput.value = '';
      if(verifyCodeInput) verifyCodeInput.value = '';
    });
  }

  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const dropdownMenu = document.getElementById('dropdownMenu');
  if(menuToggleBtn && dropdownMenu) {
    menuToggleBtn.addEventListener('click', (e) => { 
      e.stopPropagation(); 
      dropdownMenu.classList.toggle('show'); 
    });
    document.addEventListener('click', () => dropdownMenu.classList.remove('show'));
  }

  const goToSettingsBtn = document.getElementById('goToSettingsBtn');
  const backToMainBtn = document.getElementById('backToMainBtn');
  if(goToSettingsBtn) {
    goToSettingsBtn.addEventListener('click', () => {
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
  
  function renderMessages() {
    messagesContainer.innerHTML = '';
    activeChatName.innerText = currentChat;
    activeChatAvatar.innerText = currentChat.substring(0, 2).toUpperCase();
    
    let chatObj = chatsData[currentChat];
    let msgs = chatObj ? chatObj.messages : [];
    
    msgs.forEach((msg, index) => {
      const div = document.createElement('div');
      div.className = `message ${msg.type}`;
      
      let contentHtml = msg.html || msg.text;
      
      // Adiciona o menu flutuante em cada mensagem
      div.innerHTML = `
        ${contentHtml}
        <div class="msg-menu">
          <button class="msg-menu-item" onclick="deleteMessage(${index}, 'me')">Apagar para mim</button>
          ${msg.type === 'sent' ? `<button class="msg-menu-item delete-for-everyone" onclick="deleteMessage(${index}, 'everyone')">Apagar para todos</button>` : ''}
        </div>
      `;
      
      messagesContainer.appendChild(div);
    });
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Função global para apagar a mensagem
  window.deleteMessage = function(index, type) {
    if (!chatsData[currentChat]) return;

    if (type === 'everyone') {
      chatsData[currentChat].messages[index] = { text: 'Esta mensagem foi apagada.', type: chatsData[currentChat].messages[index].type };
    } else {
      // Apaga totalmente do array se for para mim
      chatsData[currentChat].messages.splice(index, 1);
    }

    saveChats();
    renderMessages();
    renderChatList();
  };
