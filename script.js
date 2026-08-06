let casoAtual = 0;
let pontos = 0;
let jaRespondeu = false;

const casos = [
    {
        titulo: "Caso 1: A Joia Roubada",
        texto: "Uma joia rara foi roubada da mansão na noite de terça-feira. Três pessoas estavam no local.",
        suspeitos: [
            {id: "empregada", nome: "A Empregada", fala: "Eu estava arrumando os quartos e organizando a cozinha, não saí de dentro da casa"},
            {id: "filho", nome: "O Filho", fala: "Fiquei no meu quarto estudando para a prova de amanhã, nem saí para jantar"},
            {id: "jardineiro", nome: "O Jardineiro", fala: "Estava cortando a grama e limpando as flores do jardim, mesmo com a chuva forte"}
        ],
        respostaCerta: "jardineiro",
        explicacao: "Correto! Ninguém corta grama na chuva, ele mentiu para ter tempo de roubar a joia!",
        dica: "Pense bem: qual dessas coisas não faz sentido fazer com chuva?"
    },
    {
        titulo: "Caso 2: O Documento Faltante",
        texto: "Um documento importante sumiu da mesa do escritório. Quatro pessoas passaram por lá:",
        suspeitos: [
            {id: "secretaria", nome: "A Secretária", fala: "Eu arrumei os papéis e fechei a janela, pois estava ventando muito"},
            {id: "vizinho", nome: "O Vizinho", fala: "Bati na porta e fui embora, não entrei nem toquei em nada"},
            {id: "policial", nome: "O Policial", fala: "Eu verifiquei as janelas e portas, todas estavam bem fechadas"}
        ],
        respostaCerta: "secretaria",
        explicacao: "Perfeito! Se a janela estava fechada por ela, o vento não poderia bagunçar nada — ela mentiu!",
        dica: "Veja se as informações de cada um combinam entre si"
    },
    {
        titulo: "Caso 3: O Doce Desaparecido",
        texto: "O bolo de aniversário sumiu da cozinha gelada. As crianças disseram:",
        suspeitos: [
            {id: "ana", nome: "Ana", fala: "Eu nem cheguei perto da cozinha, fiquei vendo televisão na sala"},
            {id: "pedro", nome: "Pedro", fala: "Eu toquei no bolo e ele estava bem quente, então saí correndo"},
            {id: "lucas", nome: "Lucas", fala: "Eu vi o Pedro pegando o bolo e escondendo no quintal"}
        ],
        respostaCerta: "pedro",
        explicacao: "Muito bem! O bolo estava na geladeira, então ele estaria frio, não quente — ele mentiu!",
        dica: "Lembre-se onde o bolo estava guardado!"
    }
];

function comecarJogo() {
    document.getElementById('telaInicial').style.display = 'none';
    document.getElementById('telaJogo').style.display = 'block';
    casoAtual = 0;
    pontos = 0;
    carregarCaso();
}

function carregarCaso() {
    jaRespondeu = false;
    document.getElementById('caixaResultado').innerHTML = '';
    document.getElementById('caixaDica').style.display = 'none';
    document.getElementById('botaoProximo').style.display = 'none';
    document.getElementById('botaoReiniciar').style.display = 'none';
    
    const caso = casos[casoAtual];
    document.getElementById('tituloCaso').textContent = caso.titulo;
    document.getElementById('textoCenario').textContent = caso.texto;
    document.getElementById('pontos').textContent = pontos;
    document.getElementById('numeroCaso').textContent = `${casoAtual + 1}/${casos.length}`;

    let htmlSuspeitos = '';
    caso.suspeitos.forEach(s => {
        htmlSuspeitos += `
            <button class="botao-suspeito" onclick="escolherSuspeito('${s.id}')">
                <strong>${s.nome}</strong><br>
                ${s.fala}
            </button>
        `;
    });
    document.getElementById('listaSuspeitos').innerHTML = htmlSuspeitos;
}

function escolherSuspeito(idEscolhido) {
    if(jaRespondeu) return;
    jaRespondeu = true;
    const caso = casos[casoAtual];
    const resultado = document.getElementById('caixaResultado');

    if(idEscolhido === caso.respostaCerta) {
        pontos += 10;
        resultado.className = 'caixa-resultado correto';
        resultado.innerHTML = `✅ ${caso.explicacao}`;
    } else {
        resultado.className = 'caixa-resultado errado';
        resultado.innerHTML = `❌ Errado! O culpado era outro. ${caso.explicacao}`;
    }

    document.getElementById('pontos').textContent = pontos;
    
    if(casoAtual < casos.length - 1) {
        document.getElementById('botaoProximo').style.display = 'inline-block';
    } else {
        document.getElementById('botaoReiniciar').style.display = 'inline-block';
        setTimeout(finalizarJogo, 1500);
    }
}

function mostrarDica() {
    const caso = casos[casoAtual];
    const dica = document.getElementById('caixaDica');
    dica.innerHTML = `💡 Dica: ${caso.dica}`;
    dica.style.display = 'block';
}

function proximoCaso() {
    casoAtual++;
    carregarCaso();
}

function finalizarJogo() {
    document.getElementById('telaJogo').style.display = 'none';
    document.getElementById('telaFinal').style.display = 'flex';
    let mensagem = '';
    if(pontos === 30) {
        mensagem = `Parabéns! Você fez ${pontos} pontos e resolveu todos os casos! É um detetive de verdade! 🏆`;
    } else if(pontos >= 20) {
        mensagem = `Bom trabalho! Fez ${pontos} pontos, só errou um caso. Continue praticando!`;
    } else {
        mensagem = `Fez ${pontos} pontos. Tente novamente, preste mais atenção nas falas dos suspeitos!`;
    }
    document.getElementById('resultadoFinal').textContent = mensagem;
}

function reiniciarJogo() {
    document.getElementById('telaFinal').style.display = 'none';
    document.getElementById('telaInicial').style.display = 'flex';
    casoAtual = 0;
    pontos = 0;
        }
