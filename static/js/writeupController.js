const rightScroll = document.getElementById('writeup-scroll-right');
const leftScroll = document.getElementById('writeup-scroll-left');
let backBtn = document.getElementById('writeup-mainmenu');
let writeupList = [];
let lwindow = 0;
let rwindow = 3;
let renderList = [];

async function fetchWriteups(){
	let writeupContainer = document.getElementById('writeup-section');

	await fetch("/fetch/writeup-list")
		.then(response =>{
			if(!response.ok){
				throw new Error('Failed to retrieve json file')
			}
			return response.json();
		})
		.then(jsonData => {
			writeupList = jsonData;
		})
		.catch(error => {
			console.log("No such data. please refresh and try again. Contact me if the error persists");
		})
	console.log('this worked?',writeupList);

	writeupList.forEach((item,index)=>{
		let ctfContainer = document.createElement('div');
		ctfContainer.className = "ctf-container flex-col";

		let ctfLogo = document.createElement('div');
		ctfLogo.className = "ctf-image-logo";
		let logoImage = document.createElement('img');
		logoImage.src = item["Event-logo"];
		logoImage.alt = "Logo of ctf";
		ctfLogo.appendChild(logoImage);

		let ctfHead = document.createElement('div');
		ctfHead.className = "ctf-heading flex-col";

		let ctfName = document.createElement('div');
		ctfName.className = "ctf-name";

		let name = document.createElement('div');
		name.textContent = item["Event-name"];
		ctfName.appendChild(name);

		let ctfDate = document.createElement('div');
		ctfDate.className = "ctf-date";
		ctfDate.textContent = item["Event-timeline"]["Start"].slice(0,5) + " - " + item["Event-timeline"]["End"].slice(0,5);

		ctfHead.appendChild(ctfName);
		ctfHead.appendChild(ctfDate);
		ctfContainer.appendChild(ctfLogo);
		ctfContainer.appendChild(ctfHead);

		ctfContainer.addEventListener('click',()=>{
			setsinglectf(item);
		});

		renderList.push(ctfContainer);
	})

	setctfList();
}

function setctfList(){
	let writeupContainer = document.getElementById('writeup-section');
	writeupContainer.textContent = "";

	for(let i=lwindow;i<rwindow;i++){
		writeupContainer.appendChild(renderList[i]);
	}

	backBtn.disabled = true;
}

function setsinglectf(ctf_item){
	leftScroll.disabled = true;
	rightScroll.disabled = true;
	backBtn.disabled = false;

	let writeupContainer = document.getElementById('writeup-section');
	writeupContainer.textContent = "";

	let logoContainer = document.createElement('div');
	logoContainer.setAttribute('id',"logo-container");
	let logoImg = document.createElement('img');
	logoImg.setAttribute('src',ctf_item["Event-logo"]);
	logoImg.setAttribute('alt',"Logo of the ctf");
	logoContainer.appendChild(logoImg);

	let singleCtfContent = document.createElement('div');
	singleCtfContent.setAttribute('id',"single-ctf-content");
	let singleCtfHead = document.createElement('div');
	singleCtfHead.setAttribute('id',"single-ctf-heading")
	singleCtfHead.textContent = ctf_item["Event-name"];

	let hrElement = document.createElement('hr');
	let outerList = document.createElement('ul');
	outerList.className = "category-list";

	for (let cat in ctf_item["Event-sections"]) {
		let headListElement = document.createElement('li');
		headListElement.textContent = cat;

		let innerList = document.createElement('ul');
		innerList.className = "challs-list";

		ctf_item["Event-sections"][cat].forEach((item,index)=>{
			let challListElement = document.createElement('li');
			challListElement.textContent = item["Chall-head"];
	        challListElement.addEventListener('click', function () {
                window.location.href = '/writeup/'+ctf_item["Event-name"]+"/"+cat+"/"+index;
            });
			innerList.appendChild(challListElement);
		})

		outerList.appendChild(headListElement);
		outerList.appendChild(innerList);
	}

	singleCtfContent.appendChild(singleCtfHead);
	singleCtfContent.appendChild(hrElement);
	singleCtfContent.appendChild(outerList);

	writeupContainer.appendChild(logoContainer);
	writeupContainer.appendChild(singleCtfContent);

}

function togglerRLscroll() {
	if(lwindow == 0){
		leftScroll.disabled = true;
	} else {
		leftScroll.disabled = false;
	}

	if(rwindow == writeupList.length){
		rightScroll.disabled = true;
	} else {
		rightScroll.disabled = false;
	}
}

backBtn.addEventListener('click',function(){
	togglerRLscroll();
	setctfList();
})
document.addEventListener('onload',fetchWriteups());
leftScroll.addEventListener('click',function(){
	if(lwindow == 0) {return;}
	lwindow -= 1;
	rwindow -= 1;
	togglerRLscroll();
	setctfList();
});
rightScroll.addEventListener('click',function(){
	if(rwindow == writeupList.length) {return;}
	lwindow += 1;
	rwindow += 1;
	togglerRLscroll();
	setctfList();
});