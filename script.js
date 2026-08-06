* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: sans-serif;
}

body {
    background: url('imagens/fundo.png') center/cover no-repeat fixed;
    min-height: 100vh;
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.container {
    background: rgba(255,255,255,0.92);
    padding: 25px;
    border-radius: 20px;
    width: 100%;
    max-width: 420px;
    text-align: center;
}

h1 {
    margin-bottom: 20px;
    color: #222;
}

.status {
    margin-bottom: 25px;
    text-align: left;
}

.linha {
    margin-bottom: 10px;
}

.linha span {
    display: block;
    margin-bottom: 3px;
    font-weight: bold;
}

.barra-fundo {
    width: 100%;
    height: 18px;
    background: #ddd;
    border-radius: 9px;
    overflow: hidden;
}

.barra {
    height: 100%;
    width: 50%;
    transition: width 0.3s;
}

#barraFome { background: #e74c3c; }
#barraEnergia { background: #f39c12; }
#barraFeliz { background: #27ae60; }

.bichinho {
    width: 140px;
    height: 160px;
    margin: 0 auto 20px;
    position: relative;
    transition: transform 0.2s;
}

.corpo {
    width: 100%;
    height: 100%;
    background: #badc58;
    border-radius: 50% 50% 40% 40%;
}

.olhos {
    position: absolute;
    top: 35px;
    left: 20px;
    right: 20px;
    display: flex;
    justify-content: space-between;
}

.olho {
    width: 22px;
    height: 26px;
    background: white;
    border-radius: 50%;
    position: relative;
}

.olho::after {
    content: '';
    width: 10px;
    height: 10px;
    background: black;
    border-radius: 50%;
    position: absolute;
    top: 8px;
    left: 6px;
}

.boca {
    width: 35px;
    height: 18px;
    border: 3px solid black;
    border-top: none;
    border-radius: 0 0 20px 20px;
    position: absolute;
    bottom: 30px;
    left: 52px;
}

#aviso {
    font-weight: bold;
    margin-bottom: 20px;
    color: #333;
    min-height: 20px;
}

.botoes {
    display: flex;
    gap: 8px;
    justify-content: center;
    flex-wrap: wrap;
}

.botoes button {
    padding: 10px 16px;
    border: none;
    border-radius: 8px;
    background: #3498db;
    color: white;
    font-weight: bold;
    cursor: pointer;
    font-size: 15px;
    transition: 0.2s;
}

.botoes button:hover {
    background: #2980b9;
    transform: scale(1.05);
}
