function set404block(){
	const t404 = document.getElementById('t404');
	for(let i=0;i<3;i++){
		let numEle = document.createElement('div');
		numEle.className = 'num-element';
		for(let j=0;j<5;j++){
			let outerCheck = document.createElement('div');
			outerCheck.className = 'outer-check';
			for(let k=0;k<3;k++){
				let innerCheck = document.createElement('div');
				innerCheck.className = 'inner-check'
				outerCheck.appendChild(innerCheck);
			}
			numEle.appendChild(outerCheck);
		}
		t404.appendChild(numEle);
	}

	arr = [0,2,3,5,6,7,8,11,14,15,16,17,18,20,21,23,24,26,27,28,29,30,32,33,35,36,37,38,41,44]

	let innerEle = document.getElementsByClassName('inner-check');
	arr.forEach((item,index)=>{
		innerEle[item].classList.add('set');
	})
}

document.addEventListener('onload',set404block());