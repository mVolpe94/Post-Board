let dataBase = [];

//Resets the input element given
function cleartext(element) {
    element.value = "";
};

//Adds user input to browser-side dataBase array
function addToDatabase(element) {
    let textData = element.value;
    if (textData != "") {
        dataBase.unshift(textData);
    };
};

//Determines which side to place the message on using the 
//pixel height of each side
function heightPlacement(leftSide, rightSide) {
    let leftHeight = leftSide.clientHeight;
    let rightHeight = rightSide.clientHeight;
    let side = "left";

    console.log(leftHeight);
    console.log(rightHeight);

    if(leftHeight > rightHeight) {
        side = "right";
    };
    return side;
};

//Generates document fragments to display each side of the message board
function createFr(element=null) {
    if (element != null){
      addToDatabase(element);
      //Place client side time functions here!!!!!!!!
    }
    let leftContainer = document.getElementById("leftContainer");
    leftContainer.style.visibility = "hidden";
    let rightContainer = document.getElementById("rightContainer");
    rightContainer.style.visibility = "hidden";

    let side = "left";

    let dfL = new DocumentFragment();
    let dfR = new DocumentFragment();

    while (leftContainer.firstChild) {
        leftContainer.removeChild(leftContainer.firstChild);
    };
    while (rightContainer.firstChild) {
        rightContainer.removeChild(rightContainer.firstChild);
    };

    dataBase.forEach(item => {
        let div = document.createElement('div');
        div.textContent = item;
        div.className = "input__data";
        if (side === "left") {
            dfL.appendChild(div);
        };
        if (side === "right") {
            dfR.appendChild(div);
        };

        leftContainer.appendChild(dfL);
        rightContainer.appendChild(dfR);
        side = heightPlacement(leftContainer, rightContainer);
    });
    leftContainer.style.visibility = "visible";
    rightContainer.style.visibility = "visible";
}


function getMillisecondsUTC(){
  // var date = new Date();
  // var year = date.getUTCFullYear();
  // var month = date.getUTCMonth();
  // var day = date.getUTCDate();
  // var hour = date.getUTCHours();
  // var minute = date.getUTCMinutes();
  // var second = date.getUTCSeconds();
  // var milliseconds = date.getUTCMilliseconds();
  // var epochUTC = Date.UTC(year, month, day, hour, minute, second, milliseconds);
  epochUTC = Date.now();
  return epochUTC
}


function timeZoneAdjust(utcTime){

}

// Sends user input to screen and server database
function formSubmit(e){
    e.preventDefault();
    var textBox = document.getElementById('userInput')
    if(textBox.value != ''){
      var date = Date.now()
      var jsonData = {'message': textBox.value, 'time': date} //Take out date
      var jsonString = JSON.stringify(jsonData)

      var xhr = new XMLHttpRequest();
      xhr.onload = function(){
        console.log(this.status);
        if(this.status == 200){

          createFr(textBox);
          // htmlInject(textBox);
          cleartext(textBox);
        };
      };
      xhr.open('POST', '/index', true);
      xhr.setRequestHeader('content-type', 'application/json');
      xhr.onerror = function(){
        console.log("Request Error...");
      };
      console.log(jsonString)
      xhr.send(jsonString);
    };
};

//onload function to produce messages from server database
function loadData() {
    var textBox = document.getElementById("userInputForm");
    textBox.addEventListener("submit", formSubmit);

    var xhr = new XMLHttpRequest();

    xhr.onload = function(){
      console.log(this.status);
      if(this.status == 200){
        var messages = JSON.parse(this.responseText);
        dataBase.splice(0, dataBase.length);
        for (id in messages){ //Maybe run a check if messages[id] is in dataBase array, if not, add messages[id], may be faster
          messageTime = messages[id][1];
          dataBase.unshift(messages[id][0]);
        };
        console.log(dataBase);
        createFr();
      };
    };
    xhr.open('GET', '/read-db', true);
    xhr.send();
};
