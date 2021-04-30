let dataBase = [];


function cleartext(element) {
    element.value = "";
}

function htmlInject(element) {
    var textData = element.value;
    console.log(textData);
    console.log(dataBase);
    return
}

function addToDatabase(element) {
    let textData = element.value;
    if (textData != "") {
        dataBase.unshift(textData);
    }
}

function heightPlacement(leftSide, rightSide) {
    let leftHeight = leftSide.clientHeight;
    let rightHeight = rightSide.clientHeight;
    let side = "left";

    console.log(leftHeight);
    console.log(rightHeight);

    if(leftHeight > rightHeight) {
        side = "right";
    }
    return side;
}

function createFr(element) {
    addToDatabase(element);
    let leftContainer = document.getElementById("leftContainer");
    leftContainer.style.visibility = "hidden";
    let rightContainer = document.getElementById("rightContainer");
    rightContainer.style.visibility = "hidden";

    let side = "left";

    let dfL = new DocumentFragment();
    let dfR = new DocumentFragment();

    while (leftContainer.firstChild) {
        leftContainer.removeChild(leftContainer.firstChild);
    }
    while (rightContainer.firstChild) {
        rightContainer.removeChild(rightContainer.firstChild);
    }

    dataBase.forEach(item => {
        let div = document.createElement('div');
        div.textContent = item;
        div.className = "input__data";
        if (side === "left") {
            dfL.appendChild(div);
        }
        if (side === "right") {
            dfR.appendChild(div);
        }

        leftContainer.appendChild(dfL);
        rightContainer.appendChild(dfR);
        side = heightPlacement(leftContainer, rightContainer);
    })
    leftContainer.style.visibility = "visible";
    rightContainer.style.visibility = "visible";
}

function formSubmit(e){
    e.preventDefault();
    var textBox = document.getElementById('userInput')
    if(textBox.value != ''){
        var xhr = new XMLHttpRequest();

        xhr.onload = function(){
            console.log(this.status)
            if(this.status == 200){

                createFr(textBox);
                htmlInject(textBox);
                cleartext(textBox);
            }
        }
        xhr.open('POST', '/index', true);
        xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        xhr.onerror = function(){
            console.log("Request Error...");
        }
        xhr.send("userInput=" + document.getElementById('userInput').value);
    }
}

function submit() {
    var textBox = document.getElementById("userInputForm");
    textBox.addEventListener("submit", formSubmit);
}