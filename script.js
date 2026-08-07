// script.js

// Seleciona o botão de curtir na tela
const likeButton = document.getElementById('likeButton');

// Adiciona um "ouvinte" que espera você clicar no botão
likeButton.addEventListener('click', function() {
  
  // Alterna a classe 'liked' do CSS
  this.classList.toggle('liked');
  
  // Verifica se a classe 'liked' está ativa para mudar o texto/ícone
  if (this.classList.contains('liked')) {
    this.innerText = '❤️ Curtiu!';
  } else {
    this.innerText = '🤍 Curtir';
  }
});
