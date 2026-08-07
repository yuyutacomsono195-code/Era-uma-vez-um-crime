document.addEventListener('DOMContentLoaded', () => {
  // TELAS
  const loginScreen = document.getElementById('loginScreen');
  const mainScreen = document.getElementById('mainScreen');
  const settingsScreen = document.getElementById('settingsScreen');

  // BOTÕES E ELEMENTOS
  const loginBtn = document.getElementById('loginBtn');
  const phoneInput = document.getElementById('phoneInput');
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const dropdownMenu = document.getElementById('dropdownMenu');
  const goToSettingsBtn = document.getElementById('goToSettingsBtn');
  const backToMainBtn = document.getElementById('backToMainBtn');

  // 1. LÓGICA DE LOGIN (Muda da tela de login para a principal)
  loginBtn.addEventListener('click', () => {
    if(phoneInput.value.trim() === '') {
      alert("Por favor, insira seu número para continuar.");
      return;
    }
    // Esconde Login, Mostra Main Screen
    loginScreen.classList.remove('active');
    mainScreen.classList.add('active');
  });

  // 2. LÓGICA DO MENU DE 3 PONTINHOS
  menuToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Evita que o clique feche o menu imediatamente
    dropdownMenu.classList.toggle('show');
  });

  // Fechar o menu ao clicar fora dele
  document.addEventListener('click', (e) => {
    if (!dropdownMenu.contains(e.target) && e.target !== menuToggleBtn) {
      dropdownMenu.classList.remove('show');
    }
  });

  // 3. NAVEGAÇÃO PARA CONFIGURAÇÕES (Via menu de 3 pontos)
  goToSettingsBtn.addEventListener('click', () => {
    dropdownMenu.classList.remove('show'); // fecha o menu
    mainScreen.classList.remove('active'); // esconde a tela principal
    settingsScreen.classList.add('active'); // mostra as configurações
  });

  // 4. VOLTAR DAS CONFIGURAÇÕES PARA A TELA INICIAL
  backToMainBtn.addEventListener('click', () => {
    settingsScreen.classList.remove('active'); // esconde as configurações
    mainScreen.classList.add('active'); // volta pra tela principal
  });
});
