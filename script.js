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
    'Equipe WhatsApp': {
      phone: '+55 11 99999-9999',
      messages: [{ text: 'Bem-vindo ao WhatsApp! Suas conversas estão protegidas com criptografia de ponta a ponta.', type: 'received' }]
    }
  };
  let currentChat = localStorage.getItem('gb_current_chat') || 'Equipe WhatsApp';

  function saveChats() {
    localStorage.setItem('gb_chats_data', JSON.stringify(chatsData));
  }

  function renderChatList() {
    chatListEl.innerHTML = '';
    for (let contact in chatsData) {
      let chatObj = chatsData[contact];
      let msgs = chatObj.messages || [];
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

  // ==========================================
  // ADICIONAR NOVO CONTATO
  // ==========================================
  const newChatBtn = document.getElementById('newChatBtn');
  const addContactModal = document.getElementById('addContactModal');
  const cancelAddContact = document.getElementById('cancelAddContact');
  const confirmAddContact = document.getElementById('confirmAddContact');
  const newContactName = document.getElementById('newContactName');
  const newContactPhone = document.getElementById('newContactPhone');

  if(newChatBtn) {
    newChatBtn.addEventListener('click', () => { 
      addContactModal.classList.add('active'); 
      if(newContactName) newContactName.focus();
    });
  }

  if(cancelAddContact) {
    cancelAddContact.addEventListener('click', () => { 
      addContactModal.classList.remove('active'); 
      if(newContactName) newContactName.value = ''; 
      if(newContactPhone) newContactPhone.value = '';
    });
  }
  
  if(confirmAddContact) {
    confirmAddContact.addEventListener('click', () => {
      let name = newContactName ? newContactName.value.trim() : '';
      let phone = newContactPhone ? newContactPhone.value.trim() : '';

      if (name) {
        if (!chatsData[name]) {
          chatsData[name] = {
            phone: phone || 'Número não informado',
            messages: [{ text: `Conversa iniciada com ${name}.`, type: 'received' }]
          };
        }
        currentChat = name;
        localStorage.setItem('gb_current_chat', currentChat);
        saveChats();
        renderChatList();
        renderMessages();
        addContactModal.classList.remove('active');
        if(newContactName) newContactName.value = '';
        if(newContactPhone) newContactPhone.value = '';
      } else {
        alert('Por favor, digite o nome do contato.');
      }
    });
  }

  // ==========================================
  // ENVIAR MENSAGENS DE TEXTO
  // ==========================================
  if(chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = msgInput.value.trim();
      if (!text) return;

      if (!chatsData[currentChat]) {
        chatsData[currentChat] = { phone: 'Desconhecido', messages: [] };
      }

      chatsData[currentChat].messages.push({ text: text, type: 'sent' });
      msgInput.value = '';
      saveChats();
      renderMessages();
      renderChatList();

      setTimeout(() => {
        chatStatus.innerText = "digitando...";
      }, 500);

      setTimeout(() => {
        chatsData[currentChat].messages.push({ text: `Recebido: "${text}"`, type: 'received' });
        chatStatus.innerText = "online";
        saveChats();
        renderMessages();
        renderChatList();
      }, 2000);
    });
  }

  // ==========================================
  // RECURSOS DE MÍDIA (ÁUDIO E CÂMERA)
  // ==========================================
  let mediaRecorder;
  let audioChunks = [];

  // Função para enviar Áudio (Microfone)
  window.toggleAudioRecord = async function() {
    try {
      if (!mediaRecorder || mediaRecorder.state === "inactive") {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = event => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
          const audioUrl = URL.createObjectURL(audioBlob);
          
          if (!chatsData[currentChat]) chatsData[currentChat] = { messages: [] };
          
          chatsData[currentChat].messages.push({ 
            html: `<audio controls src="${audioUrl}"></audio>`, 
            type: 'sent' 
          });
          saveChats();
            renderMessages();
            renderChatList();
          };

          mediaRecorder.start();
          alert("Gravando áudio... Clique novamente no microfone para parar e enviar.");
        } else {
          mediaRecorder.stop();
          alert("Áudio enviado com sucesso!");
        }
      } catch (err) {
        alert("Permissão de microfone negada ou indisponível.");
      }
    };

    // Função para tirar Foto (Câmera)
    window.takeCameraPhoto = async function() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        
        // Cria elemento de vídeo temporário para captura
        const video = document.createElement('video');
        video.srcObject = stream;
        await video.play();

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 320;
        canvas.height = video.videoHeight || 240;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Para a câmera
        stream.getTracks().forEach(track => track.stop());

        const photoUrl = canvas.toDataURL('image/png');

        if (!chatsData[currentChat]) chatsData[currentChat] = { messages: [] };
        chatsData[currentChat].messages.push({ 
          html: `<img src="${photoUrl}" style="max-width:100%; border-radius:8px;" />`, 
          type: 'sent' 
        });
        
        saveChats();
        renderMessages();
        renderChatList();
      } catch (err) {
        alert("Permissão de câmera negada ou indisponível.");
      }
    };

    // ==========================================
    // CHAMADAS DE VOZ E VÍDEO REAIS
    // ==========================================
    const audioCallBtn = document.getElementById('audioCallBtn');
    const videoCallBtn = document.getElementById('videoCallBtn');

    async function makeCall(isVideo) {
      try {
        const constraints = { audio: true, video: isVideo };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        let callWindow = window.open("", "CallWindow", "width=400,height=500");
        callWindow.document.write(`
          <body style="background:#111; color:#fff; text-align:center; font-family:sans-serif; padding-top:50px;">
            <h2>Chamada ${isVideo ? 'de Vídeo' : 'de Voz'} com ${currentChat}</h2>
            ${isVideo ? '<video id="localVideo" autoplay playsinline style="width:80%; border-radius:10px; margin-top:20px;"></video>' : '<p>Conectado...</p>'}
            <br><br>
            <button onclick="window.close()" style="background:red; color:#fff; border:none; padding:12px 25px; border-radius:20px; cursor:pointer; font-weight:bold;">Encerrar Chamada</button>
          </body>
        `);
        
        if (isVideo) {
          setTimeout(() => {
            let vEl = callWindow.document.getElementById('localVideo');
            if(vEl) vEl.srcObject = stream;
          }, 500);
        }

        callWindow.onunload = () => {
          stream.getTracks().forEach(t => t.stop());
        };
      } catch (err) {
        alert("Não foi possível iniciar a chamada. Verifique sua câmera/microfone.");
      }
    }

    if(audioCallBtn) audioCallBtn.addEventListener('click', () => makeCall(false));
    if(videoCallBtn) videoCallBtn.addEventListener('click', () => makeCall(true));

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
      
