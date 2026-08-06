let fome = 50;
let energia = 50;
let felicidade = 50;

function atualizar() {
    document.getElementById('barraFome').style.width = fome + '%';
    document.getElementById('barraEnergia').style.width = energia + '%';
    document.getElementById('barraFeliz').style.width = felicidade + '%';
}

function aviso(texto) {
    document.getElementById('aviso').textContent = texto;
}

function comer() {
    if(fome < 100) {
        fome += 15;
        if(fome > 100) fome = 100;
        felicidade += 5;
        aviso("Estou comendo! 😋");
        document.getElementById('bichinho').style.transform = 'scale(1.1)';
        setTimeout(() => document.getElementById('bichinho').style.transform = 'scale(1)', 200);
    } else {
        aviso("Já estou cheio! 😩");
    }
    atualizar();
}

function dormir() {
    if(energia < 100) {
        energia += 20;
        if(energia > 100) energia = 100;
        fome -= 5;
        aviso("Boa noite! 💤");
    } else {
        aviso("Não estou com sono! 😁");
    }
    atualizar();
}

function brincar() {
    if(energia > 10) {
        felicidade += 15;
        energia -= 10;
        fome -= 8;
        if(felicidade > 100) felicidade = 100;
        aviso("Que legal! 🎉");
        document.getElementById('bichinho').style.transform = 'rotate(8deg)';
        setTimeout(() => document.getElementById('bichinho').style.transform = 'rotate(-8deg)', 200);
        setTimeout(() => document.getElementById('bichinho').style.transform = 'rotate(0)', 400);
    } else {
        aviso("Estou muito cansado! 😴");
    }
    atualizar();
}

// Diminui os status sozinhos com o tempo
setInterval(() => {
    if(fome > 0) fome--;
    if(energia > 0) energia--;
    if(felicidade > 0) felicidade--;
    atualizar();
}, 3000);

atualizar();
