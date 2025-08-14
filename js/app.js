let currentUser=null;

function register(){
  let u=document.getElementById('username').value;
  let p=document.getElementById('password').value;
  if(!u||!p){alert("Eksik bilgi");return;}
  let users=JSON.parse(localStorage.getItem('users')||"[]");
  if(users.find(x=>x.name===u)){alert("Zaten var");return;}
  users.push({name:u,pass:CryptoJS.SHA256(p).toString(),groups:[]});
  localStorage.setItem('users',JSON.stringify(users));
  alert("Kayıt başarılı");
}

function login(){
  let u=document.getElementById('username').value;
  let p=document.getElementById('password').value;
  let users=JSON.parse(localStorage.getItem('users')||"[]");
  let user=users.find(x=>x.name===u && x.pass===CryptoJS.SHA256(p).toString());
  if(!user){alert("Hatalı");return;}
  currentUser=user;
  document.getElementById('auth').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  updateGroupList();
  alert("Hoşgeldin "+u);
}

function createGroup(){
  let g=document.getElementById('groupName').value;
  if(!g){alert("Grup ismi gir");return;}
  let groups=JSON.parse(localStorage.getItem('groups')||"{}");
  if(groups[g]){alert("Zaten var");return;}
  groups[g]=[currentUser.name];
  localStorage.setItem('groups',JSON.stringify(groups));
  currentUser.groups.push(g);
  updateUser();
  updateGroupList();
  alert("Grup oluşturuldu");
}

function inviteUser(){
  let u=document.getElementById('inviteUser').value;
  let g=document.getElementById('groupName').value;
  if(!u||!g){alert("Eksik");return;}
  let users=JSON.parse(localStorage.getItem('users')||"[]");
  let user=users.find(x=>x.name===u);
  if(!user){alert("Böyle kullanıcı yok");return;}
  let groups=JSON.parse(localStorage.getItem('groups')||"{}");
  if(!groups[g]){alert("Grup yok");return;}
  if(!groups[g].includes(u)) groups[g].push(u);
  if(!user.groups.includes(g)) user.groups.push(g);
  localStorage.setItem('groups',JSON.stringify(groups));
  updateUser();
  alert(u+" davet edildi");
  updateGroupList();
}

function updateUser(){
  let users=JSON.parse(localStorage.getItem('users')||"[]");
  let idx=users.findIndex(x=>x.name===currentUser.name);
  if(idx>=0){users[idx]=currentUser;}
  localStorage.setItem('users',JSON.stringify(users));
}

function updateGroupList(){
  let list=document.getElementById('groupList');
  list.innerHTML='';
  currentUser.groups.forEach(g=>{
    let li=document.createElement('li');
    li.textContent=g;
    list.appendChild(li);
  });
}

function sendMessage(){
  let msg=document.getElementById('message').value;
  if(!msg) return;
  let chat=document.getElementById('chat');
  let div=document.createElement('div');
  div.classList.add('message','sent');
  div.textContent=msg;
  chat.appendChild(div);
  chat.scrollTop=chat.scrollHeight;
  document.getElementById('message').value='';
}

document.getElementById('fileInput').addEventListener('change',function(e){
  let file=e.target.files[0];
  if(!file) return;
  let reader=new FileReader();
  reader.onload=function(){
    let data=reader.result;
    let encrypted=CryptoJS.AES.encrypt(data,'anahtar123').toString();
    let chat=document.getElementById('chat');
    let div=document.createElement('div');
    div.classList.add('message','sent');
    div.textContent="Dosya gönderildi: "+file.name;
    chat.appendChild(div);
    chat.scrollTop=chat.scrollHeight;
  }
  reader.readAsDataURL(file);
});
