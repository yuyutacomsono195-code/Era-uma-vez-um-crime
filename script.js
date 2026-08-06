document.addEventListener('DOMContentLoaded', () => {
  // Efeito simples de clique nos itens da lista
  const items = document.querySelectorAll('.setting-item, .app-item');

  items.forEach(item => {
    item.addEventListener('click', () => {
      const title = item.querySelector('.title') ? item.querySelector('.title').textContent : 'Item';
      console.log(`Abrindo: ${title}`);
    });
  });

  // Botão de voltar
  const backBtn = document.querySelector('.back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      alert('Voltar para as conversas');
    });
  }
});
