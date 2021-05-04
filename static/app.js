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

function createFr() {
    
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
};


function formSubmitter(e){
  e.preventDefault();
  var textBox = document.getElementById('userInput');
  if(textBox.value != ''){
    var sends = new XMLHttpRequest();

    sends.open("POST", "/index", false);
    sends.onload = function(){
      console.log(this.status);
      if(this.status == 200){
        console.log(this.response);
        };
      };

    sends.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
    sends.send("userInput=" + textBox.value);

    var read = new XMLHttpRequest();
    read.open('GET', '/read-db', false);
    read.onload = function(){
      if(this.status == 200){
        var messages = JSON.parse(this.responseText);
        dataBase.splice(0, dataBase.length);
        for (id in messages){
          dataBase.unshift(messages[id]);
        console.log(dataBase);
        createFr()
        };
      };
    };
    read.send();
  };
};

function onLoad() {
  var textBox = document.getElementById("userInputForm");
  textBox.addEventListener("submit", formSubmitter);
  console.log("loaded event listener")
}

