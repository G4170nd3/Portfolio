function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function titleAnimation(element,str){
    var text = str;
    var charString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&1234567890"

    element.innerText = charString[Math.floor(Math.random()*charString.length)];
    element.classList.add('fluctuated');

    setTimeout(async () => {
        element.innerText = text;
        element.classList.remove('fluctuated');
    }, 70);
}
function animationCaller(){
    for(let i=0;i<aboutArr.length;i++){
        setTimeout(()=>{
            titleAnimation(document.getElementById('about-content').children[0].children[0].childNodes[aboutArr[i]],"ABOUT ME"[aboutArr[i]]);
        },(100*i))
    }
    for(let i=0;i<contactArr.length;i++){
        setTimeout(()=>{
            titleAnimation(document.getElementById('socials').childNodes[1].childNodes[contactArr[i]],"TALK TO ME?"[contactArr[i]]);
        },(100*i))
    }
}

var aboutArr = [0,1,2,3,4,6,7];
var contactArr = [0,1,2,3,5,6,8,9,10];

setInterval(()=>{
    animationCaller();
    shuffleArray(aboutArr);
    shuffleArray(contactArr);
},3000)