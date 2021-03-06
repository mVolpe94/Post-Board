let dataBase = [];
let message_list = {};

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

//Resets the input element given
function cleartext(element) {
    element.value = "";
};

//Adds user input to browser-side dataBase array
function addToDatabase(element, time) {
    let textData = element.value;
    time = parseInt(time);
    console.log(time)
    if (textData != "") {
        dataBase.unshift([textData, time]);
    };
};

//Determines which side to place the message on using the 
//pixel height of each side
function heightPlacement(leftSide, rightSide) {
    let leftHeight = leftSide.clientHeight;
    let rightHeight = rightSide.clientHeight;
    let side = "left";

    // console.log(leftHeight);
    // console.log(rightHeight);

    if(leftHeight > rightHeight) {
        side = "right";
    };
    return side;
};

//Generates document fragments to display each side of the message board
function createFr(element=null, time=null) {
    if (element != null){
      addToDatabase(element, time);
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
        let postTime = timeZoneAdjust(item[1])
        let textDiv = document.createElement('div');
        let timeDiv = document.createElement('div');
        textDiv.textContent = item[0];
        textDiv.className = "input__data";
        timeDiv.textContent = postTime;
        timeDiv.className = "input__time";
        if (side === "left") {
            textDiv.appendChild(timeDiv);
            dfL.appendChild(textDiv);
        };
        if (side === "right") {
            textDiv.appendChild(timeDiv);
            dfR.appendChild(textDiv);
        };

        leftContainer.appendChild(dfL);
        rightContainer.appendChild(dfR);
        side = heightPlacement(leftContainer, rightContainer);
    });

    leftContainer.style.visibility = "visible";
    rightContainer.style.visibility = "visible";
}


function getMillisecondsUTC(){
  epochUTC = Date.now();
  return epochUTC
}


function timeZoneAdjust(utcTime){
  utcTime = parseInt(utcTime)
  var timeNow = new Date(utcTime);
  var timeString = timeNow.toString();
  var timeList = timeString.split(" ");
  var timeOutput = ""

  timeList.forEach(item => {
    if (timeList.indexOf(item) < 6){
      if (item == timeList[4]){
        var curTime = item.split(":");
        console.log(curTime)
        var hour = parseInt(curTime[0])
        if (hour >= 12){
          hour -= 12;
          curTime[2] = "PM";
        }
        else {
          curTime[2] = "AM";
        }
        if (hour == 0){
          hour = 12
        }
      item = hour + ":" + curTime[1] + " " + curTime[2]
      }
      if (item == timeList[2]){
        timeOutput += item + ", "
      } else {
          timeOutput += item + " "
        }
    }
  });
  return timeOutput
}

// Sends user input to screen and server database
function formSubmit(e){
    e.preventDefault();
    var textBox = document.getElementById('userInput')
    if(textBox.value != ''){
      var date = Date.now()
      var jsonData = {'message': textBox.value}
      var jsonString = JSON.stringify(jsonData)

      var xhr = new XMLHttpRequest();
      xhr.onload = function(){
        console.log(this.status);
        if(this.status == 200){

          createFr(textBox, date);
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
        for (id in messages){
          let messageData = messages[id][0];
          let messageTime = messages[id][1];
          dataBase.unshift([messageData, messageTime]);
        };
        console.log(dataBase);
        createFr();
      };
    };
    xhr.open('GET', '/read-db', true);
    xhr.send();
};
