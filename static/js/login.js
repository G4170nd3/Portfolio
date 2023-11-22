var adminForm = document.getElementById('loginForm');

adminForm.addEventListener('submit', async (event) => {
	event.preventDefault();
	var user = document.getElementById('username')
	var pass = document.getElementById('password')
	var loginData = {
		user: user.value,
		pass: pass.value
	}

	const response = await fetch('/adminlogin', {
		method: "POST",
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(loginData)
	});
	let data = await response.text()
	if (data == "Incorrect credentials!") {
		window.alert(data);
	} else {
		window.location.href = '/managefeedback'
	}
})
