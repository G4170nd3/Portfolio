var typeInst = new TypeIt("#home-content div #my-name span", {
	speed: 75,
	startDelay: 1000,
	waitUntilVisible: false,
	loop: false,
	lifeLike: true,
	deleteSpeed: 75
}).go();

function loadAkaText(){
	var afterTextDiv = document.getElementById('aka-text');
	var scrollDiv = document.getElementById('main-home-scroll');
	afterTextDiv.classList.remove('hidden-div');
	scrollDiv.classList.remove('hidden-div');
	clearTimeout(t);
}

function typing(){
	let textarea = document.getElementById('message');
	let wordCount = document.getElementById('words');
	let submitButton = document.getElementById('submit');

	wordCount.textContent = textarea.value.length;
	if (!submitButton.disabled && textarea.value.length == 0){
		submitButton.disabled = true;
	} else if (submitButton.disabled && textarea.value.length > 0) {
		submitButton.disabled = false;
	}
}

function submitAnon(userInput){
	let resElement = document.getElementById('response');

	if (resElement.classList.contains('rb')) {
		resElement.classList.remove('rb');
	} else if (resElement.classList.contains('gb')) {
		resElement.classList.remove('gb');
	}
	
	fetch("/anonfeedback", {
		method: "POST",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify({ userInput })
	})
	.then(response => response.json())
	.then(data => {
		resElement.classList.remove('hidden-div');
		document.getElementById('message').value = "";
		typing()
		if (data.success == false){
			resElement.classList.add('rb');
			resElement.children[0].textContent = data.Error;
		} else if (data.success == true) {
			resElement.classList.add('gb');
			resElement.children[0].textContent = data.message;
		}
		setTimeout(()=>{
			if (resElement.classList.contains('rb')) {
				resElement.classList.remove('rb');
			} else if (resElement.classList.contains('gb')) {
				resElement.classList.remove('gb');
			}
			resElement.children[0].textContent = "";
			resElement.classList.add('hidden-div');
		},2000)
	})
}

const t = setTimeout(loadAkaText,2000);
const feedbackform = document.forms['feedbackform'];
feedbackform.addEventListener('submit', function(e){
	e.preventDefault();
	const userInput = document.getElementById('message').value;
	submitAnon(userInput)
})
