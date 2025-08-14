let currentUser=null;
let pc=new RTCPeerConnection();
let dataChannel;

function login(){
  let u=document.getElementById('username').value;
  if(!u){alert("Kullanıcı adı girin");return;}
  currentUser=u;
  document.getElementById('auth').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  initDataChannel();
}

function initDataChannel(){
  dataChannel=pc.createDataChannel("chat");
  dataChannel.onmessage=(e)=>receiveMessage(e.data);
  pc.ondatachannel=(e)=>{dataChannel=e.channel;dataChannel.onmessage=(ev)=>receiveMessage(ev.data);}
}

function sendMessage(){
  let msg=document.getElementById('message').value;
  if(!msg) return;
  let encrypted=CryptoJS.AES.encrypt(msg,'anahtar123').toString();
  if(dataChannel) dataChannel.send(encrypted);
  addMessage(msg,true);
  document.getElementById('message').value='';
}

function receiveMessage(data){
  let decrypted=CryptoJS.AES.decrypt(data,'anahtar123').toString(CryptoJS.enc.Utf8);
  addMessage(decrypted,false);
}

function addMessage(msg,isSent){
  let chat=document.getElementById('chat');
  let div=document.createElement('div');
  div.classList.add('message',isSent?'sent':'received');
  div.textContent=msg;
  chat.appendChild(div);
  chat.scrollTop=chat.scrollHeight;
}

// Dosya gönderme
document.getElementById('fileInput').addEventListener('change',function(e){
  let file=e.target.files[0];
  if(!file) return;
  let reader=new FileReader();
  reader.onload=function(){
    let encrypted=CryptoJS.AES.encrypt(reader.result,'anahtar123').toString();
    if(dataChannel) dataChannel.send(encrypted);
    addMessage("Dosya gönderildi: "+file.name,true);
  }
  reader.readAsDataURL(file);
});
