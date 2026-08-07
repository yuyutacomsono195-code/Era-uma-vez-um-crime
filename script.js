document.addEventListener('DOMContentLoaded', () => {
  // Dados de conversas iniciais
  const contacts = [
    { id: '1', name: 'Maria Silva', avatar: 'MS', messages: [{ text: 'Oi! Conseguiu abrir o app?', type: 'received' }] },
    { id: '2', name: 'Lucas Dev', avatar: 'LD', messages: [{ text: 'Testando a setinha de voltar!', type: 'received' }] }
  ];

  let activeChatId = contacts[0].id;

  // Elementos do DOM
  const mainScreen = document.getElementById('mainScreen');
  const settingsScreen = document.getElementById('settingsScreen');
  const openSettingsBtn = document.getElementById('openSettingsBtn');
  const backToChatsBtn = document.getElementById('backToChatsBtn');

  const chatList = document.getElementById('chatList');
  const messagesContainer = document.getElementById('messagesContainer');
  const activeName = document.getElementById('activeName');
  const activeAvatar = document.getElementById('activeAvatar');
  const chatForm = document.getElementById('chatForm');
  const messageInput = document.getElementById('messageInput');

  // --- NAVEGAÇÃO DE TELAS ---
  // ABRIR CONFIGURAÇÕES
  openSettingsBtn.addEventListener('click', () => {
    settingsScreen.classList.add('active');
  });

  // CLIQUE NA SETINHA: VOLTAR PARA A TELA INICIAL DE CONVERSAS
  backToChatsBtn.addEventListener('click', () => {
    settingsScreen.classList.remove('active');
  });

  // --- LÓGICA DAS CONVERSAS ---
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
    messagesContainer.innerHTML = '';

    contact.messages.forEach(msg => {
      const msgDiv = document.createElement('div');
      msgDiv.className = `message ${msg.type}`;
      msgDiv.textContent = msg.text;
      messagesContainer.appendChild(msgDiv);
    });

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = messageInput.value.trim();
    if (!text) return;

    const contact = contacts.find(c => c.id === activeChatId);
    contact.messages.push({ text: text, type: 'sent' });
    messageInput.value = '';

    renderMessages();

    setTimeout(() => {
      contact.messages.push({ text: 'Mensagem recebida!', type: 'received' });
      renderMessages();
    }, 1000);
  });

  // Inicialização
  renderChatList();
  renderMessages();
});
