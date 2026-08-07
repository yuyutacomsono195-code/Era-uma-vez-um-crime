document.addEventListener('DOMContentLoaded', () => {
  // Lista inicial de contatos
  const contacts = [
    { 
      id: '1', 
      name: 'Maria Silva', 
      phone: '+55 (83) 98877-6655',
      avatar: 'MS', 
      messages: [{ text: 'Oi! Conseguiu abrir o app?', type: 'received' }] 
    },
    { 
      id: '2', 
      name: 'Lucas Dev', 
      phone: '+55 (83) 99911-2233',
      avatar: 'LD', 
      messages: [{ text: 'Testando a setinha de voltar!', type: 'received' }] 
    }
  ];

  let activeChatId = contacts[0].id;

  // Seletores do DOM
  const settingsScreen = document.getElementById('settingsScreen');
  const openSettingsBtn = document.getElementById('openSettingsBtn');
  const backToChatsBtn = document.getElementById('backToChatsBtn');

  const chatList = document.getElementById('chatList');
  const messagesContainer = document.getElementById('messagesContainer');
  const activeName = document.getElementById('activeName');
  const activeAvatar = document.getElementById('activeAvatar');
  const activePhoneDisplay = document.getElementById('activePhoneDisplay');
  const chatForm = document.getElementById('chatForm');
  const messageInput = document.getElementById('messageInput');

  // --- CONTROLE DE TELAS (ABRIR / VOLTAR) ---
  openSettingsBtn.addEventListener('click', () => {
    settingsScreen.classList.add('active');
  });

  backToChatsBtn.addEventListener('click', () => {
    settingsScreen.classList.remove('active');
  });

  // --- GERENCIAMENTO DE CONVERSAS ---
  function renderChatList() {
    chatList.innerHTML = '';
    contacts.forEach(contact => {
      const item = document.createElement('div');
      item.className = `chat-item ${contact.id === activeChatId ? 'active' : ''}`;
      item.onclick = () => selectChat(contact.id);
      item.innerHTML = `
        <div class="avatar">${contact.avatar}</div>
        <div>
          <h4>${contact.name}</h4>
        </div>
      `;
      chatList.appendChild(item);
    });
  }

  function selectChat(id) {
    activeChatId = id;
    renderChatList();
    renderMessages();
  }

  function renderMessages() {
    const contact = contacts.find(c => c.id === activeChatId);
    if (!contact) return;

    activeName.textContent = contact.name;
    activeAvatar.textContent = contact.avatar;
    activePhoneDisplay.textContent = contact.phone;
    messagesContainer.innerHTML = '';

    contact.messages.forEach(msg => {
      const msgDiv = document.createElement('div');
      msgDiv.className = `message ${msg.type}`;
      msgDiv.textContent = msg.text;
      messagesContainer.appendChild(msgDiv);
    });

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // --- ENVIO E RESPOSTA AUTOMÁTICA ---
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = messageInput.value.trim();
    if (!text) return;

    const contact = contacts.find(c => c.id === activeChatId);
    contact.messages.push({ text: text, type: 'sent' });
    messageInput.value = '';

    renderMessages();

    // Simulação de resposta recebida após 1 segundo
    setTimeout(() => {
      contact.messages.push({ text: 'Mensagem recebida com sucesso!', type: 'received' });
      renderMessages();
    }, 1000);
  });

  // Inicialização do aplicativo
  renderChatList();
  renderMessages();
});
      
