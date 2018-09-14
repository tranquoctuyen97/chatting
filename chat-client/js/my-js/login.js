
if (localStorage.getItem('token')) {
	window.location.href='room.html';
}

$('#btn-login').click(function () {
	const username = $('#input-username').val();
	const password = $('#input-password').val();
	const room = $('#input-room-name').val();
	callAPI('users/login', 'POST', {
		'content-type': 'json/application'
	}, {
		username,
		password,
		groupId: 'c097413e-9994-478b-ae36-3e62a660d926'
	})
	.then(responseData => {
		localStorage.setItem('token', responseData.data.token);
		window.location.href='room.html?room=' + room;
	})
	.catch(e => {
		$('#error-message').text(e.responseJSON.error);
	})
});

// btnLogin = document.getElementById("btn-login");
// btnLogin.addEventListener("click", function () {
// 	const username = document.getElementById("input-username").value;
// 	const password = document.getElementById("input-password").value;
// 	const  room = document.getElementById("input-room-name").value;
// 	callAPI('login', 'post', {
//         'content-type': 'json/application'
// 	}, {
// 		username,
// 		password,
// 		room
// 	}).then(responseData => {
// 		localStorage.setItem('token', responseData.data.token);
// 		window.location.href = 'room.html';
// 	}).catch(e => {
// 		document.getElementById("error-message").innerText = e.responseJSON.error;
// 	});

// });