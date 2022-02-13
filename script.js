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
setInterval(atualizarSite, 60000);

// Fiz uma função pq acho que vou ter que chamar outras... Analisando isso ainda
function atualizarSite(){
    buscarMensagens();
    pegarParticipantes();
}

// Iniciando a conexão com o servidor

function iniciarConexaoServidor(){

    // Entrada ainda com prompt
    let usuario = prompt("Digite seu nome de login:");
    
    // Se não receber vazio vai lá e posta o usuário depois tem que validar o Login entrando com os dados fornecidos pelo servidor
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

// Tem que conferir o status do usuário, enviando um post com o nome dele para o servidor conferir a atividade
function conferirUsuarioStatus(){
    axios.post("https://mock-api.driven.com.br/api/v4/uol/status", login).then();
    
}

// Iniciando a busca de mensagens pegando elas do servidor... Quando receber a promessa vai processar

function buscarMensagens() {
    let conversa = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    conversa.then(processarMensagens)
    .catch(function usuarioDeslogado(){
        window.location.reload();
    });
}

// Recebendo os dados do get enviados pelo servidor

function processarMensagens(mensagem) {
	/* console.log(mensagem.data); */
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
// tipos de mensagem - 1) mensagem de entrada ou saída (conferir status) OK
// - 2) Mensagem para todos - Conferir o type = message (OK)
// - 3) Mensagem privada - Nesse caso muda o type e o to -- Tem que analisar isso pq só acontece se as pessoas selecionarem isso
function criarMensagem(mensagemBatePapo,toMessage, userUsuario){

    userUsuario = login.name;
    toMessage = incluirMensagem.to;
    let conteudoMensagem = "";
    console.log(userUsuario);
    console.log(toMessage);

    if(mensagemBatePapo.type === "status"){
        conteudoMensagem = `<div class="entraSaiColor mensagensBatePapo font"><p> <span class="timeColor">(${mensagemBatePapo.time})</span> <span class="negrito">${mensagemBatePapo.from}</span> ${mensagemBatePapo.text}</p></div>`
    }

    if(mensagemBatePapo.type === "message"){
        conteudoMensagem = `<div class="font mensagensBatePapo"><p><span class="timeColor">(${mensagemBatePapo.time})</span> <span class="negrito">${mensagemBatePapo.from}</span> para <span class="negrito">${mensagemBatePapo.to}</span>: <span class="quebrarPalavra"> ${mensagemBatePapo.text} </span></p></div>`
    }

    if(mensagemBatePapo.type == "private_message" && mensagemBatePapo.to === toMessage && mensagemBatePapo.from === userUsuario){
        conteudoMensagem = `<div class="cvReservada font mensagensBatePapo"><p><span class="timeColor">(${mensagemBatePapo.time})</span> <span class="negrito">${mensagemBatePapo.from}</span> reservadamente para <span class="negrito">${mensagemBatePapo.to}</span>: ${mensagemBatePapo.text}</p></div>`
    }

    // Colocando dentro da div criada
        return conteudoMensagem;

}
// O aside bar também tem que ser criado com os dados dos usuários
// pegar participantes
function pegarParticipantes(){
    let participantesBatePapo = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");
    participantesBatePapo.then(processarInfosUsuarios);
}

function processarInfosUsuarios(usuarios) {
	console.log(usuarios.data);
    infosUsuarios = usuarios.data;
    asideBar();
}

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
                                            <p>${infosUsuarios[i].name}</p>
                                            <ion-icon class="check" name="checkmark-circle"></ion-icon>
                                        </div>`
    }
}

// Escolher visibilidade da mensagem no aside Bar
function escolherVisibilidadeMensagem(div,tipo){
    
    desmarcarVisibilidade('escolhaVisibilidade', 'selecionado');

    div.classList.add("selecionado");
    
    incluirMensagem.type = tipo;
}


function desmarcarVisibilidade(publicoPrivado, marcado){
    const tipoMensagemSelecionada = document.querySelector(`.${publicoPrivado} .${marcado}`);
    if(tipoMensagemSelecionada !== null) {
        tipoMensagemSelecionada.classList.remove("selecionado");
    }
}

// Escolher o usuário que vai mandar a mensagem pelo aside Bar

function escolherUsuarioMensagem(div,para){
    
    desmarcarVisibilidade('infosUsuariosOn', 'selecionado');

    div.classList.add("selecionado");
    incluirMensagem.to = para;
}

console.log(incluirMensagem);

function desmarcarVisibilidade(loginUsuario, marcado){
    const tipoMensagemSelecionada = document.querySelector(`.${loginUsuario} .${marcado}`);
    if(tipoMensagemSelecionada !== null) {
        tipoMensagemSelecionada.classList.remove("selecionado");
    }
}

// Enviar mensagem (Postar mensagem.. Preciso de infos do usuário que está querendo postar)
// onclick
// Inicializar com para todos e mudar caso seja privado?
// Manda mensagem infinitamente... Precisava de um comando...
function enviarMensagem(){

    let usuarioMensagem = document.querySelector(".escreverMensagem").value;
        
    /*if(tipoVisibilidade !== null && usuarioLogin !== null){
        para = usuarioLogin;
        tipo = tipoVisibilidade;
    } */
    console.log(respostaMensagens);
    incluirMensagem.text = usuarioMensagem;
    incluirMensagem.from = login.name;

    
    
/*         {
            from: login.name,
            to: para,
            text: usuarioMensagem,
            type: tipo
        }
    ; */

    let mensagemEnviada = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", incluirMensagem).then(buscarMensagens);
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

iniciarConexaoServidor();
/* verificarStatus(); */
/* buscarMensagens(); */

