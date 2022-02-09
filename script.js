
/* function buscarDados() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants ");
    promise.then(processarResposta);
} */

const promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");
promise.then(processarResposta);

function processarResposta(resposta) {
	console.log(resposta);
}

function infosParticipantes(botao){
    let modificarTelaPrincipal = document.querySelector("aside");
    modificarTelaPrincipal.classList.remove("escondida");
    modificarTelaPrincipal.classList.add("opacidade");
}

