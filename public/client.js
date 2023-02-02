const socket=io();
var username;
var chats=document.querySelector(".chats");
var users_list=document.querySelector(".user-list");
var users_count=document.querySelector(".users-count");
var msg_send=document.querySelector("#user_send");
var user_msg=document.querySelector("#user_msg");

do{
    username=prompt("Enter your name :");
}while(!username);
//  It will be calledd when the user will join 
socket.emit("new-user-joined",username);

// Notifying that the user is joined 
socket.on('user-connected',(socket_name)=>{
    userJoinLeft(socket_name,' joined');
});

// Function to create jined left status 
function userJoinLeft(name,status){
    let div=document.createElement("div");
    div.classList.add('user-join');
    let content=`<p><b>${name }</b>${status} the chat</p>`;
    div.innerHTML=content;
    chats.appendChild(div);
    chats.scrollTop=chats.scrollHeight;
}
// Notifying that the user has left
socket.on('user-disconnected',(user)=>{
    userJoinLeft(user,' left');
});
// Updating users list and users counting 
socket.on('user-list',(users)=>{
    users_list.innerHTML="";
    users_arr=Object.values(users);
    for(i=0;i<users_arr.length;i++)
    {
        let p=document.createElement('p');
        p.innerText=users_arr[i];
        users_list.appendChild(p);
    }
    users_count.innerHTML=users_arr.length;
});

// For sending message 
msg_send.addEventListener('click',()=>{
    let data={
        user: username,
        msg: user_msg.value
    };
    if(user_msg.value!=''){
        appendMessage(data,'outgoing');
        socket.emit('message',data);
        user_msg.value='';
    }
});

function appendMessage(data,status){
    let div=document.createElement('div');
    div.classList.add('message',status);
    let content=`
    <h5>${data.user}</h5>
    <p>${data.msg}</p>
    `;
    div.innerHTML=content;
    chats.appendChild(div);
    chats.scrollTop=chats.scrollHeight;
}

socket.on('message',(data)=>{
    appendMessage(data,'incoming');
});