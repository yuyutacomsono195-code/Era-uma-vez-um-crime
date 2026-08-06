const defaultContacts = [
  {
    id: '1',
    name: 'Maria Silva',
    phone: '+55 (83) 98877-6655',
    avatar: 'MS',
    messages: [{ text: 'Oi! Vi que você está usando o WhatsApp GB!', type: 'received', time: '10:14' }],
    autoReply: 'Show! As funções personalizadas ficaram demais.'
  },
  {
    id: '2',
    name: 'Lucas Dev',
    phone: '+55 (83) 99911-2233',
    avatar: 'LD',
    messages: [{ text: 'Testando as cores do GB Mods...', type: 'received', time: '09:30' }],
    autoReply: 'Tudo rodando 100% liso!'
  }
];

let contacts = JSON.parse(localStorage.getItem('gb_contacts')) || defaultContacts;
let activeChatId = contacts[0].id;
let gbSettings = JSON.parse(localStorage.getItem('gb_settings')) || {
  name: 'Meu Nome',
  phone: '+55 (83) 99999-8888',
  bio: 'Usando WhatsApp GB!',
  note: 'Status GB ativado 🔥',
  avatarImg: '',
  primaryColor: '#00a884',
  bubbleRadius: '8px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
};

// Elementos DOM
const chatList = document.getElementById('chatList');
const messagesContainer = document.getElementById('messagesContainer');
const activeName = document.getElementById('activeName');
const activeAvatar = document.getElementById('activeAvatar');
const activePhoneDisplay = document.getElementById('activePhoneDisplay');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');

const profilePanel = document.getElementById('profilePanel');
const gbModsPanel = document.getElementById('gbModsPanel');
const contactInfoPanel = document.getElementById('contactInfoPanel');

const openProfileBtn = document.getElementById('openProfileBtn');
const closeProfileBtn = document.getElementById('closeProfileBtn');
const openGbModsBtn = document.getElementById('openGbModsBtn');
const closeGbModsBtn = document.getElementById('closeGbModsBtn');

const inputProfileName = document.getElementById('inputProfileName');
const inputProfilePhone = document.getElementById('inputProfilePhone');
const inputProfileBio = document.getElementById('inputProfileBio');
const inputProfileNote = document.getElementById('inputProfileNote');
const avatarFileInput = document.getElementById('avatarFileInput');

const gbColorPicker = document.getElementById('gbColorPicker');
const bubbleStyleSelect = document.getElementById('bubbleStyleSelect');
const fontStyleSelect = document.getElementById('fontStyleSelect');

const myName = document.getElementById('myName');
const myAvatar = document.getElementById('myAvatar');
const myBigAvatar = document.getElementById('myBigAvatar');
const sidebarNoteText = document.getElementById('sidebarNoteText');

const chatHeader = document.getElementById('chatHeader');
const closeContactInfoBtn = document.getElementById('closeContactInfoBtn');
const contactNameInput = document.getElementById('contactNameInput');
const contactPhoneInput = document.getElementById('contactPhoneInput');

function applyGbSettings() {
  document.documentElement.style.setProperty('--gb-primary', gbSettings.primaryColor);
  document.documentElement.style.setProperty('--gb-bubble-radius', gbSettings.bubbleRadius);
  document.documentElement.style.setProperty('--gb-font-family', gbSettings.fontFamily);

  myName.textContent = gbSettings.name;
  inputProfileName.value = gbSettings.name;
  inputProfilePhone.value = gbSettings.phone || '';
  inputProfileBio.value = gbSettings.bio || '';
  inputProfileNote.value = gbSettings.note || '';

  gbColorPicker.value = gbSettings.primaryColor;
  bubbleStyleSelect.value = gbSettings.bubbleRadius;
  fontStyleSelect.value = gbSettings.fontFamily;

  if (gbSettings.note && gbSettings.note.trim() !== '') {
    sidebarNoteText.innerHTML = `<strong>Nota:</strong> ${gbSettings.note}`;
  } else {
    sidebarNoteText.innerHTML = `<em>Nenhuma nota publicada...</em>`;
  }

  if (gbSettings.avatarImg) {
    myAvatar.style.backgroundImage = `url(${gbSettings.avatarImg})`;
    myAvatar.textContent = '';
    myBigAvatar.style.backgroundImage = `url(${gbSettings.avatarImg})`;
    myBigAvatar.textContent = '';
  } else {
    const initials = gbSettings.name.substring(0, 2).toUpperCase() || 'EU';
    myAvatar.style.backgroundImage = 'none';
    myAvatar.textContent = initials;
    myBigAvatar.style.backgroundImage = 'none';
    myBigAvatar.textContent = initials;
  }

  localStorage.setItem('gb_settings', JSON.stringify(gbSettings));
}

function saveContacts() {
  localStorage.setItem('gb_contacts', JSON.stringify(contacts));
}

function getCurrentTime() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

function renderChatList() {
  chatList.innerHTML = '';
  contacts.forEach(contact => {
    const lastMsg = contact.messages[contact.messages.length - 1];
    const lastText = lastMsg ? lastMsg.text : 'Nenhuma mensagem';
    const lastTime = lastMsg ? lastMsg.time : '';

    const item = document.createElement('div');
    item.className = `chat-item ${contact.id === activeChatId ? 'active' : ''}`;
    item.onclick = () => selectChat(contact.id);

    item.innerHTML = `
      <div class="avatar">${contact.avatar}</div>
      <div class="chat-info">
        <div class="chat-title">
          <h4>${contact.name}</h4>
          <span class="time">${lastTime}</span>
        </div>
        <p class="last-message">${lastText}</p>
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
  activePhoneDisplay.textContent = contact.phone || 'Sem número';

  contactNameInput.value = contact.name;
  contactPhoneInput.value = contact.phone || '';

  messagesContainer.innerHTML = '';

  contact.messages.forEach(msg => {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${msg.type}`;
    msgDiv.innerHTML = `
      <p>${msg.text}</p>
      <span class="message-time">${msg.time}</span>
    `;
    messagesContainer.appendChild(msgDiv);
  });

  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();
  if (!text) return;

  const contact = contacts.find(c => c.id === activeChatId);
  const currentTime = getCurrentTime();

  contact.messages.push({
    text: text,
    type: 'sent',
    time: currentTime
  });

  messageInput.value = '';
  saveContacts();
  renderChatList();
  renderMessages();

  setTimeout(() => {
    contact.messages.push({
      text: contact.autoReply,
      type: 'received',
      time: getCurrentTime()
    });
    saveContacts();
    renderChatList();
    if (activeChatId === contact.id) {
      renderMessages();
    }
  }, 1000);
});

// Painéis Eventos
openProfileBtn.addEventListener('click', () => {
  profilePanel.classList.add('active');
  gbModsPanel.classList.remove('active');
});
closeProfileBtn.addEventListener('click', () => profilePanel.classList.remove('active'));

openGbModsBtn.addEventListener('click', () => {
  gbModsPanel.classList.add('active');
  profilePanel.classList.remove('active');
});
closeGbModsBtn.addEventListener('click', () => gbModsPanel.classList.remove('active'));

chatHeader.addEventListener('click', () => contactInfoPanel.classList.toggle('active'));
closeContactInfoBtn.addEventListener('click', () => contactInfoPanel.classList.remove('active'));

// Edição do Contato Ativo
contactNameInput.addEventListener('change', (e) => {
  const contact = contacts.find(c => c.id === activeChatId);
  if (contact) {
    contact.name = e.target.value;
    saveContacts();
    renderChatList();
    renderMessages();
  }
});

contactPhoneInput.addEventListener('change', (e) => {
  const contact = contacts.find(c => c.id === activeChatId);
  if (contact) {
    contact.phone = e.target.value;
    saveContacts();
    renderMessages();
  }
});

// Edição do Perfil Pessoal
inputProfileName.addEventListener('change', (e) => {
  gbSettings.name = e.target.value || 'Meu Nome';
  applyGbSettings();
});

inputProfilePhone.addEventListener('change', (e) => {
  gbSettings.phone = e.target.value;
  applyGbSettings();
});

inputProfileBio.addEventListener('change', (e) => {
  gbSettings.bio = e.target.value;
  applyGbSettings();
});

inputProfileNote.addEventListener('change', (e) => {
  gbSettings.note = e.target.value;
  applyGbSettings();
});

avatarFileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      gbSettings.avatarImg = event.target.result;
      applyGbSettings();
    };
    reader.readAsDataURL(file);
  }
});

// Opções do GB Mods
gbColorPicker.addEventListener('input', (e) => {
  gbSettings.primaryColor = e.target.value;
  applyGbSettings();
});

bubbleStyleSelect.addEventListener('change', (e) => {
  gbSettings.bubbleRadius = e.target.value;
  applyGbSettings();
});

fontStyleSelect.addEventListener('change', (e) => {
  gbSettings.fontFamily = e.target.value;
  applyGbSettings();
});

// Inicialização
applyGbSettings();
renderChatList();
renderMessages();
