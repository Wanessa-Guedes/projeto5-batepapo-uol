/* Nome do usuário */
let login  = {name: ""};

function iniciarConexaoServidor(){

    let usuario = prompt("Digite seu nome de login:");
    
    if(login !== ""){
        let respostaLogin = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", {
    name: usuario
})
    

    respostaLogin.then(function validarLogin(usuarioStatus) {
        if(usuarioStatus.status == 200){
            login.name = usuario;
            console.log(login)
            console.log(usuarioStatus)
            
        }
    })
    .catch(function repetirLogin() {

        let login = prompt("Usuário já cadastrado, por favor escolha outro:");

    });
    }
    
    setInterval(usuarioStatus, 5000);
} 


function usuarioStatus(){
    axios.post("https://mock-api.driven.com.br/api/v4/uol/status", login).then();
}

/* 
function buscarMensagens() {
    let conversa = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    conversa.then(processarMensagens);
}

function processarMensagens(mensagem) {
	console.log(mensagem.data);
    mensagensBatePapo = mensagem.data;
} */

/* function processarStatus(statusParticipante) {
	console.log(statusParticipante.data);
    respostaStatus = statusParticipante.data;
} */

// Para habilitar funcionalidades da barra lateral ao clicar no icone
function infosParticipantes(botao){
    let modificarTelaPrincipal = document.querySelector("aside");
    modificarTelaPrincipal.classList.remove("escondida");
    modificarTelaPrincipal.classList.add("opacidade");
}

iniciarConexaoServidor();
/* verificarStatus(); */
/* buscarMensagens(); */

