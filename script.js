document.addEventListener('DOMContentLoaded', () => {
  const chatForm = document.getElementById('chatForm');
  const messageInput = document.getElementById('messageInput');
  const messagesContainer = document.getElementById('messagesContainer');

  // Função para pegar o horário atual em formato 00:00
  function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  // Função para criar o elemento da mensagem na tela
  function createMessageElement(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', type);

    const messageText = document.createElement('p');
    messageText.textContent = text;

    const timeSpan = document.createElement('span');
    timeSpan.classList.add('message-time');
    timeSpan.textContent = getCurrentTime();

    messageDiv.appendChild(messageText);
    messageDiv.appendChild(timeSpan);

    return messageDiv;
  }

  // Evento de envio da mensagem
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const text = messageInput.value.trim();
    if (text === '') return;

    // 1. Adiciona a mensagem enviada
    const sentMessage = createMessageElement(text, 'sent');
    messagesContainer.appendChild(sentMessage);

    // Limpa o input
    messageInput.value = '';

    // Rola para o final da conversa
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // 2. Simula uma resposta automática após 1 segundo
    setTimeout(() => {
      const replyMessage = createMessageElement('Mensagem recebida com sucesso! 👍', 'received');
      messagesContainer.appendChild(replyMessage);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1000);
  });
});
                            
