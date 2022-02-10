/* Nome do usuário */
let login  = {name: ""};
let respostaMensagens = [
	{
		from: "João",
		to: "Todos",
		text: "entra na sala...",
		type: "status",
		time: "08:01:17"
	},
	{
		from: "João",
		to: "Todos",
		text: "Bom dia",
		type: "message",
		time: "08:02:50"
	},
];

let para = "Todos";
let tipo = "message";
// Manter tudo atualizado a cada 3 segundos
atualizarSite();
setInterval(atualizarSite, 3000);

function atualizarSite(){
    buscarMensagens();
}

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
        setInterval(conferirUsuarioStatus, 5000);
    })
    .catch(function repetirLogin() {

        iniciarConexaoServidor();

    });
    }
    
    
} 

function conferirUsuarioStatus(){
    axios.post("https://mock-api.driven.com.br/api/v4/uol/status", login).then(console.log("usuarioStatus"));
    
}


function buscarMensagens() {
    let conversa = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    conversa.then(processarMensagens);
}


function processarMensagens(mensagem) {
	console.log(mensagem.data);
    respostaMensagens = mensagem.data;
    atualizandoMensagens();
}

function atualizandoMensagens(){
    
    let blocoMensagens = document.querySelector(".blocoMensagens");
    console.log("Dentro de AtualizandoMensagens");
    for(let i = 0; i < respostaMensagens.length; i++){
        blocoMensagens.innerHTML += criarMensagem(respostaMensagens[i]);
    }

   /*  const elementoQueQueroQueApareca = document.querySelector('.blocoMensagens'); */
    /* blocoMensagens.children.scrollIntoView(); */
    blocoMensagens.children[blocoMensagens.children.length - 1].scrollIntoView();
}

// tipos de mensagem - 1) mensagem de entrada ou saída - 2) Mensagem para todos - 3) Mensagem privada - Qual o tipo dessa mensagem??
function criarMensagem(mensagemBatePapo){
    
    let conteudoMensagem = "";
    /* console.log("criarMensagem"); */

    if(mensagemBatePapo.type === "status"){
        conteudoMensagem = `<div><p>(${mensagemBatePapo.time}) ${mensagemBatePapo.from} ${mensagemBatePapo.text}</p></div>`
    }

    if(mensagemBatePapo.type === "message"){
        conteudoMensagem = `<div><p>(${mensagemBatePapo.time}) ${mensagemBatePapo.from} para ${mensagemBatePapo.to}: ${mensagemBatePapo.text}</p></div>`
    }

    if(mensagemBatePapo.type == "private_message"){
        conteudoMensagem = `<div><p>(${mensagemBatePapo.time}) ${mensagemBatePapo.from} reservadamente para ${mensagemBatePapo.to}: ${mensagemBatePapo.text}</p></div>`
    }
    
    // Colocando dentro da div criada
        return conteudoMensagem;;

}

// Enviar mensagem (Postar mensagem.. Preciso de infos do usuário que está querendo postar)
// onclick
// Inicializar com para todos e mudar caso seja privado?
// Manda mensagem infinitamente... Precisava de um comando...
function enviarMensagem(){

    let usuarioMensagem = document.querySelector(".escreverMensagem").value;
    let estiloEnvio = 
        {
            from: login.name,
            to: para,
            text: usuarioMensagem,
            type: tipo
        }
    ;

    let mensagemEnviada = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", estiloEnvio).then(buscarMensagens);

}


    

// Para habilitar funcionalidades da barra lateral ao clicar no icone
function infosParticipantes(botao){
    let modificarTelaPrincipal = document.querySelector("aside");
    modificarTelaPrincipal.classList.remove("escondida");
    modificarTelaPrincipal.classList.add("opacidade");
}

iniciarConexaoServidor();
/* verificarStatus(); */
/* buscarMensagens(); */

