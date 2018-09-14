const token = localStorage.getItem('token');
if (!token) {
	window.location.href='login.html';
} 
const socket = io('http://localhost:3030?token=' + token);

const urlString = window.location.href;
const url = new URL(urlString);
const roomName = url.searchParams.get('room');
$('#roomName').append(roomName);


socket.on('rooms', function (responseData) {
	switch(responseData.action) {
		case 'userDisconnect':
			appendUsernameToChat(responseData.data.members);
			break;
		case 'join':
			appendUsernameToChat(responseData.data.members);
			break;
	}
});

socket.on('messages', function (responseData) {
	switch (responseData.action) {
		case 'create':
			alert('New message');
			appendMessageToBox( responseData, false);
			break;
	}
});

socket.emit('rooms', {
	action: 'join',
	data: {
		roomName
	}
}, function(error, responseData) {
	if (error) {
		console.log(error);
	} else {
		console.log(responseData);
		appendUsernameToChat(responseData);
	}
});
var send = document.getElementById("btn-send");
send.addEventListener("click", function () {
const body = document.getElementById("message-to-send").value;
const type = 'text';
socket.emit('messages', {
	action: 'create',
	data: {

		type,
		body,
        groupId: 'c097413e-9994-478b-ae36-3e62a660d926'
	}
}, function(error, responseData ){
	if (error) {
		return alert("Error")
	}
	appendMessageToBox(responseData, true);
	alert("new ")// sender
});
});

var messageToSend = document.getElementById("message-to-send");
messageToSend.addEventListener('click', function () {
	
})
$('#btn-sign-out').click(function () {
	localStorage.removeItem('token');
	window.location.href='login.html';
});

function appendUsernameToChat(usernameArray) {
	$('#list-user').empty();
	for (const username of usernameArray) {
		$('#list-user').append(`
			<li class="clearfix">
	          <div class="about">
	            <div class="name">${username}</div>
	            <div class="status">
	              <i class="fa fa-circle online"></i> online
	            </div>
	          </div>
	        </li>
		`);
	}
}

function appendMessageToBox (responseData, isOtherMessage) {
	let wrapMessageClassName = 'message-data align-right';
	let messageClassName = 'message other-message float-right';
    if (!isOtherMessage) {
    	wrapMessageClassName = 'message-data';
    	messageClassName = 'message my';
    }
    const messageTemplate = `
		<li class="clearfix">
	        <div class="${wrapMessageClassName}">
	          <span class="message-data-time" >10:10 AM, Today</span> &nbsp; &nbsp;
	          <span class="message-data-name" >${responseData.data.username}</span> <i class="fa fa-circle me"></i>
	          
	        </div>
	        <div class="${messageClassName}">
	          ${responseData.data.body}
	        </div>
      	</li>
    `;
	return $('.chat-history ul').append(messageTemplate);

}