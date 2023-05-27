const socketClient = io(); //instancia del socket del lado del cliente

const chatbox = document.getElementById('chatbox');
const emailBox = document.getElementById('emailBox');
const sendBtn = document.getElementById('sendButton');
const msgContainer = document.getElementById('msgContainer');

const sendMessage = ()=>{
    socketClient.emit('message', {user:emailBox.value, message:chatbox.value});
    chatbox.value='';
};

chatbox.addEventListener('keydown',(e)=>{
    if(e.key === 'Enter'){
        sendMessage();
    }
});

sendBtn.addEventListener('click',(e)=>{
    sendMessage();
});

//recibimos los mensajes del server.
socketClient.on("msgHistory",(data)=>{
    // console.log("data", data);
    //vaciamos el contenido de div
    msgContainer.innerHTML='';
    data.forEach(element => {
        //creamos un párrafo con para mensaje
        const parrafo = document.createElement('p');
        //le agregamos el mensaje al párrafo
        parrafo.innerHTML=`user: ${element.user} - message: ${element.message}`;
        //vamos agregando al div cada párrafo que creamos
        msgContainer.appendChild(parrafo);
    });
});
