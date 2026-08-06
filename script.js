// Estado inicial do Pou (0 a 100)
let statusPou = {
  fome: 100,
  energia: 100,
  diversao: 100,
  higiene: 100
};

// Atualiza a tela ao carregar
document.addEventListener("DOMContentLoaded", () => {
  atualizarTela();
  
  // Reduz os atributos automaticamente a cada 3 segundos
  setInterval(() => {
    statusPou.fome = Math.max(0, statusPou.fome - 3);
    statusPou.energia = Math.max(0, statusPou.energia - 2);
    statusPou.diversao = Math.max(0, statusPou.diversao - 4);
    statusPou.higiene = Math.max(0, statusPou.higiene - 2);
    
    atualizarTela();
  }, 3000);
});

// Ações do jogo
function alimentar() {
  statusPou.fome = Math.min(100, statusPou.fome + 25);
  statusPou.higiene = Math.max(0, statusPou.higiene - 5);
  animarPou();
  atualizarTela();
}

function dormir() {
  statusPou.energia = Math.min(100, statusPou.energia + 40);
  statusPou.fome = Math.max(0, statusPou.fome - 10);
  animarPou();
  atualizarTela();
}

function brincar() {
  statusPou.diversao = Math.min(100, statusPou.diversao + 30);
  statusPou.energia = Math.max(0, statusPou.energia - 15);
  statusPou.higiene = Math.max(0, statusPou.higiene - 10);
  animarPou();
  atualizarTela();
}

function limpar() {
  statusPou.higiene = 100;
  animarPou();
  atualizarTela();
}

// Pequeno efeito visual de pulo ao interagir
function animarPou() {
  const pou = document.getElementById("pou");
  pou.style.transform = "scale(1.1)";
  setTimeout(() => {
    pou.style.transform = "scale(1)";
  }, 150);
}

// Atualiza barras de vida e expressão do Pou
function atualizarTela() {
  const tipos = ['fome', 'energia', 'diversao', 'higiene'];
  
  tipos.forEach(tipo => {
    const valor = statusPou[tipo];
    const barra = document.getElementById(`bar-${tipo}`);
    barra.style.width = valor + "%";

    // Mudar cor da barra de acordo com a porcentagem
    if (valor > 60) barra.style.backgroundColor = "#2ed573";
    else if (valor > 25) barra.style.backgroundColor = "#ffa502";
    else barra.style.backgroundColor = "#ff4757";
  });

  // Expressão facial e sujeira
  const mouth = document.getElementById("mouth");
  const dirty = document.getElementById("dirty-spots");
  const statusText = document.getElementById("status-text");

  const mediaGeral = (statusPou.fome + statusPou.energia + statusPou.diversao) / 3;

  if (mediaGeral < 35) {
    mouth.classList.add("sad");
    statusText.innerText = "O Pou está triste/cansado!";
  } else {
    mouth.classList.remove("sad");
    statusText.innerText = "O Pou está feliz!";
  }

  // Exibir sujeira se higiene estiver baixa
  if (statusPou.higiene < 40) {
    dirty.classList.remove("hidden");
  } else {
    dirty.classList.add("hidden");
  }
}
    
