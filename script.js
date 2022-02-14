/* Nome do usuário */
let login  = {name: ""};
let usuarios = {name: "João",
                name:"Maria"};

// Inicializar as variaveis para comparar e mudar para enviar mensagem

let para = "Todos";
let tipo = "message";

// Formato da resposta recebida

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

// Objeto para incluir mensagens
let incluirMensagem = 
	{
		from: "",
		to: para,
		text: "",
		type: tipo
	}
;

// Manter tudo atualizado a cada 3 segundos
atualizarSite();
pegarParticipantes();
setInterval(atualizarSite, 3000);

// Manter tudo atualizado a cada 10 segundos
setInterval(pegarParticipantes, 10000);

// Função para atualizar site
function atualizarSite(){
    buscarMensagens();
}

// Iniciando a conexão com o servidor

function iniciarConexaoServidor(){

    // Entrada com prompt
    let usuario = prompt("Digite seu nome de login:");
    
    if(login !== ""){
        let respostaLogin = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", {
    name: usuario
})
    respostaLogin.then(function validarLogin(usuarioStatus) {
        if(usuarioStatus.status == 200){
            login.name = usuario;
        }
        setInterval(conferirUsuarioStatus, 5000);
    })
    .catch(function repetirLogin() {

        iniciarConexaoServidor();

    });
    }
    
    
} 

// Função para conferir o status do usuário
function conferirUsuarioStatus(){
    axios.post("https://mock-api.driven.com.br/api/v4/uol/status", login).then();
    
}

// Iniciando a busca de mensagens 
function buscarMensagens() {
    let conversa = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    conversa.then(processarMensagens)
    .catch(function usuarioDeslogado(){
        window.location.reload();
    });
}

// Recebendo os dados do get enviados pelo servidor
function processarMensagens(mensagem) {
	respostaMensagens = mensagem.data;
    atualizandoMensagens();
}

// Colocando as mensagens no HTML
function atualizandoMensagens(){
    
    let blocoMensagens = document.querySelector(".blocoMensagens");
    
    for(let i = 0; i < respostaMensagens.length; i++){
        blocoMensagens.innerHTML += criarMensagem(respostaMensagens[i]);
    }

    blocoMensagens.children[blocoMensagens.children.length - 1].scrollIntoView();
}

// Criando as mensagens
function criarMensagem(mensagemBatePapo,toMessage, userUsuario){

    userUsuario = login.name;
    toMessage = incluirMensagem.to;
    let conteudoMensagem = "";
    let idMensagem = document.querySelector("footer p");

    if(mensagemBatePapo.type === "status"){
        conteudoMensagem = `<div class="entraSaiColor mensagensBatePapo font" data-identifier="message"><p> <span class="timeColor">(${mensagemBatePapo.time})</span> <span class="negrito">${mensagemBatePapo.from}</span> ${mensagemBatePapo.text}</p></div>`
    }

    if(mensagemBatePapo.type === "message"){
        conteudoMensagem = `<div class="font mensagensBatePapo"><p><span class="timeColor" data-identifier="message">(${mensagemBatePapo.time})</span> <span class="negrito">${mensagemBatePapo.from}</span> para <span class="negrito">${mensagemBatePapo.to}</span>: <span class="quebrarPalavra"> ${mensagemBatePapo.text} </span></p></div>`
        idMensagem.innerHTML = `<p> Enviando para <span>${toMessage}</span> <b>(público)</b> </p>`;
    }

    if(mensagemBatePapo.type == "private_message" && (mensagemBatePapo.to === userUsuario || mensagemBatePapo.from === userUsuario || mensagemBatePapo.to === "Todos")){
        conteudoMensagem = `<div class="cvReservada font mensagensBatePapo" data-identifier="message"><p><span class="timeColor">(${mensagemBatePapo.time})</span> <span class="negrito">${mensagemBatePapo.from}</span> reservadamente para <span class="negrito">${mensagemBatePapo.to}</span>: ${mensagemBatePapo.text}</p></div>`
        idMensagem.innerHTML = `<p> Enviando para <span>${toMessage}</span> <b>(reservado)</b> </p>`;
    }

    // Colocando dentro da div criada
        return conteudoMensagem;

}

// Função para pegar os participantes
function pegarParticipantes(){
    let participantesBatePapo = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");
    participantesBatePapo.then(processarInfosUsuarios);
}

// Processando as informações dos usuários
function processarInfosUsuarios(usuarios) {
	infosUsuarios = usuarios.data;
    asideBar();
}

// Colocando infos dos usuários na barra lateral
function asideBar(){
    let infosBarraLateral = document.querySelector(".infosUsuariosOn");

    infosBarraLateral.innerHTML = "";

    infosBarraLateral.innerHTML = `<div class="infosBarrraLateral" onclick="escolherUsuarioMensagem(this,'Todos')">
                                    <img src="imagens/Vector.png" alt="">
                                    <p>Todos</p>
                                    <ion-icon class="check" name="checkmark-circle"></ion-icon>
                                    </div>`

    for(let i = 0; i < infosUsuarios.length; i++){

        infosBarraLateral.innerHTML += `<div class="infosBarrraLateral" onclick="escolherUsuarioMensagem(this,'${infosUsuarios[i].name}')">
                                            <img src="imagens/participante.png" alt="">
                                            <p data-identifier="participant">${infosUsuarios[i].name}</p>
                                            <ion-icon class="check" name="checkmark-circle"></ion-icon>
                                        </div>`
    }
}

// Escolher visibilidade da mensagem na barra lateral
function escolherVisibilidadeMensagem(div,tipo){
    
    desmarcarVisibilidade('escolhaVisibilidade', 'selecionado');

    div.classList.add("selecionado");
    
    incluirMensagem.type = tipo;
}

// Desmarcar a visibilidade da mensagem na barra lateral - para não selecionar duas em simultâneo
function desmarcarVisibilidade(publicoPrivado, marcado){
    const tipoMensagemSelecionada = document.querySelector(`.${publicoPrivado} .${marcado}`);
    if(tipoMensagemSelecionada !== null) {
        tipoMensagemSelecionada.classList.remove("selecionado");
    }
}

// Escolher o usuário para enviar a mensagem pela barra lateral
function escolherUsuarioMensagem(div,para){
    
    desmarcarVisibilidade('infosUsuariosOn', 'selecionado');

    div.classList.add("selecionado");
    incluirMensagem.to = para;
}


// Desmarcar a seleção do usuário na barra lateral - para não selecionar duas em simultâneo
function desmarcarVisibilidade(loginUsuario, marcado){
    const tipoMensagemSelecionada = document.querySelector(`.${loginUsuario} .${marcado}`);
    if(tipoMensagemSelecionada !== null) {
        tipoMensagemSelecionada.classList.remove("selecionado");
    }
}

// Para habilitar funcionalidades da barra lateral ao clicar no icone
function infosParticipantes(){
    let modificarTelaPrincipal = document.querySelector("aside");
    modificarTelaPrincipal.classList.remove("escondida");
}

// Fechar a barra lateral
function fecharAsideBar(){
    let fecharBarraLateral = document.querySelector("aside");
    fecharBarraLateral.classList.add("escondida");
}

// Função para enviar mensagem ao servidor e postar no chat
function enviarMensagem(){

    let usuarioMensagem = document.querySelector(".escreverMensagem").value;
    let inputUsuarioMensagem = document.querySelector("input");    
    incluirMensagem.text = usuarioMensagem;
    incluirMensagem.from = login.name;
    let mensagemEnviada = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", incluirMensagem).then(buscarMensagens);
    
    // Limpar o input automaticamente quando envia a mensagem
    inputUsuarioMensagem.value = "";
}

iniciarConexaoServidor();


