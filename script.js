function verificar(resposta) {
    const resultado = document.getElementById('resultado-final');
    if(resposta === 'jardineiro') {
        resultado.className = 'resultado correto';
        resultado.innerHTML = "✅ Correto! Ninguém corta grama na chuva. Ele mentiu!";
    } else {
        resultado.className = 'resultado errado';
        resultado.innerHTML = "❌ Errado! Pense novamente na desculpa de cada um.";
    }
}

