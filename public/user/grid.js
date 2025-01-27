// Canvas size
var canvasX = 1000;
var canvasY = 1000;

var rows;
var cols;

// Size of each cell
var cellSize = 70;

var state = 0;

/*
*
* Drawing the grid and initial setup for the grid.
*
*/

getCarParks();

var NameOfGrid = "Test";

async function setup(NameOfGrid) {
  NameOfGrid = NameOfGrid;
  console.log(NameOfGrid);
  gridSize = await getGridSize(NameOfGrid);
  canvasX = cellSize * gridSize[0];
  canvaxY = cellSize * gridSize[1];
  console.log(canvasX);
  var canvas = createCanvas(canvasX, canvasY);
  canvas.parent('grid');
  console.log(gridSize[0]);
  rows = gridSize[0];
  console.log(gridSize[1]);
  cols = gridSize[1];
  // console.log(gridSize);
  frameRate(20);
}

function draw() {
  //console.log("Trying to draw!");
  stroke(0);
  //console.log(rows);
  //console.log(cols);
  // Ajax request for server database.
  $.ajax({
    url: "/getBookings",
    type: "POST",
    dataType: "json",
    data: {
      name: NameOfGrid
    },
    success: function(returnedArray) {
      //console.log(returnedArray);
      var counter = 0;
      for(var y = 0; y < cols; y++) {
        for(var x = 0; x < rows; x++) {
          //console.log(returnedArray);
          if(returnedArray[counter] == 1) {
            fill("green");
            rect(cellSize * x, cellSize * y, cellSize, cellSize);
            //fill("white");
            text(`x:${x} y:${y}`, cellSize * x + 15, cellSize * y + 15);
            //console.log("Making green square!");
          } else if(returnedArray[counter] == 2) {
            fill("grey");
            rect(cellSize * x, cellSize * y, cellSize, cellSize);
            //fill("white");
            text(`x:${x} y:${y}`, cellSize * x + 15, cellSize * y + 15);
            //console.log("Making grey square!");
          } else if (returnedArray[counter] == 3) {
            fill("black");
            rect(cellSize * x, cellSize * y, cellSize, cellSize);
            fill("white");
            text(`x:${x} y:${y}`, cellSize * x + 15, cellSize * y + 15);
            //console.log("Making black square!");
          } else {
            fill("red");
            rect(cellSize * x, cellSize * y, cellSize, cellSize);
            text(`x:${x} y:${y}`, cellSize * x + 15, cellSize * y + 15);
            //console.log("Making red square!");
          }
          counter++;
        }
        mouseHover();
      }
    }
  })
}
async function getGridSize(name){
  var gridSizeLocal;
  await $.ajax({
    url: "/getGridSize",
    type: "POST",
    dataType: "json",
    data: {
      name: name
    },
    success: function(gridSize) {
      console.log("Grid sized: " + gridSize);
      gridSizeLocal = gridSize;     
    }
  })
  //console.log(gridSizeLocal);
  return gridSizeLocal;
}

/*
*
* Buttons list
*
*/

function mouseHover(){
	noFill();
  let x = Math.floor(mouseX / cellSize);
  let y = Math.floor(mouseY / cellSize);
  if(x < rows && y < cols){
    if(x >= 0 && y >= 0){
      fill("#6C5B7B");
      rect(x * cellSize, y * cellSize, cellSize, cellSize);
      text(`x:${x} y:${y}`, cellSize * x + 15, cellSize * y + 15);

      var spaceInfo = gatherSpace(x, y, '/gatherSpaceInformation');

      if(spaceInfo != null){
          
        var positionX = spaceInfo[0];
        var positionY = spaceInfo[1];
        var cost = spaceInfo[2];
        var timing = spaceInfo[3];

        document.getElementById("cost").innerHTML = "Cost: " + cost;
        document.getElementById("timing").innerHTML = "Booking timing: " + timing;
        document.getElementById("location").innerHTML = "Location: " + "Row: " + positionX + " " + "Column: " + positionY;
      }
    }
  }
}

/*

FIX THE GRID NOT APPEARING...


*/

// Clicked on the reserve button.
document.addEventListener("DOMContentLoaded", function(event) { 

  document.getElementById("logOut").addEventListener("click", function(){
    window.location = "/Login";
  });
  // Get currently logged in user balance.
  //gatherBalance();

  document.getElementById('reserve').addEventListener("click", function(){ 
    do{
      var positionX = parseInt(window.prompt("Please enter position X : "), 10);
      var positionY = parseInt(window.prompt("Please enter position Y : "), 10);
      var timing = parseInt(window.prompt("Please enter the timing : "), 10);
    }
    while(isNaN(positionX) && positionX >= 0 && isNaN(positionY) && positionY >= 0 && positionX <= rows && positionY <= cols && isNaN(timing) && timing >= 0);

    $.ajax({
      url: '/gatherSpaceInformation',
      type: "POST",
      data: { 
          name: NameOfGrid,
          positionX: positionX,
          positionY: positionY
      },
      dataType: "json",
      success: function(spaceInfo) {
      console.log(spaceInfo);
        // Code to check that user has enough balance !!!


        console.log(spaceInfo[4]);
        console.log((spaceInfo[4] == 'false') || (spaceInfo[4] == 0));
        if(spaceInfo[4] == 'false' || spaceInfo[4] == 0){
          var result = window.confirm("Do you want to reserve this space: " + spaceInfo[0] + "," + spaceInfo[1]);
            if(result == true){
              $.ajax({
                url: "/bookSpace",
                type: "POST",
                data: { 
                    name: NameOfGrid,
                    positionX: spaceInfo[0],
                    positionY: spaceInfo[1],
                    timing: timing,
                },
                dataType: "json",
                success: function(response) {
                    alert("Booked position: " + response[0] + ":" + response[1]);
                    // Update grid size.
                }
              });
            }
          }
          else{
            window.confirm("Cannot book this current space as it has already been booked:" + spaceInfo[0] + "," + spaceInfo[1]);
          }
        }
      });
    })
});


var space;
function gatherSpace(positionX, positionY, url){
  //console.log(NameOfGrid);
  $.ajax({
    url: url,
    type: "POST",
    data: { 
        name: NameOfGrid,
        positionX: positionX,
        positionY: positionY
    },
    dataType: "json",
    success: function(spaceInfo) {
      space = spaceInfo;
    }
  });
  return space;
}

//AJAX function for dropdown
function getCarParks() {
  $.ajax({
    url: "/getCarParkDropdown",
    type: "GET",
    dataType: "json",
    success: function(carParks) {
      var CarParksArray = carParks;
      console.log(carParks);
      for (var index = 0; index < carParks.length; index++){
        console.log("CarParks[index] = " + carParks[index]);
        if(carParks[index] != null) {
          $('#carParkSelect').append('<option id = "' + carParks[index] + '" value ="' + carParks[index] + '">' + carParks[index] + '</option>');
          document.getElementById(CarParksArray[index]).addEventListener("click", function(event) {
            NameOfGrid = event.target.id
            setup(NameOfGrid);
            //console.log(NameOfGrid);
          });      
        }
      }
    }
  })
}

$(document).ready(function(){
  $("carParkSelect").change(function(){
      var NameOfGrid = $(this).children("option:selected").val();
      console.log(NameOfGrid);
      gatherBalance();
  });
});


function gatherBalance(){
  console.log(NameOfGrid);
  $.ajax({
    url: "/getBalance",
    type: "GET",
    dataType: "json",
    success: function(balance) {
      userBalance = balance;
      document.getElementById("balance").innerHTML = "Balance" + userBalance;
    }
  });
}

// Adding balance to user
document.addEventListener("DOMContentLoaded", function(event) { 
  document.getElementById('addmoney').addEventListener("click", function() {
      do{
          var addToBalance = parseFloat(window.prompt("How much would you like to add? " + "£: "), 10);
      }
      while(isNaN(Number.isInteger(addToBalance*100) + addToBalance > 0.01 || addToBalance <= 1000));

      var result = window.confirm("Are you sure you want to add £" + balance + "to your balance?");
      if(result == true){

        $.ajax({
          url: "/getBalance",
          type: "GET",
          dataType: "json",
          success: function(balance) {
            userBalance = balance+addToBalance;
            sess = req.session;
          }
        });
      }
      else{
          alert("Transaction was cancelled.");
      }
  });
});

// Location gathering GPS
function sendGeolocation(position) {
  var GPSFormat = {
    "Latitude": position.coords.latitude,
    "Longitude": position.coords.longitude
  }
  $.ajax({
    url: "/GPS",
    type: "POST",
    data: GPSFormat,
    dataType: "json",
    success: function(returnedStatement) {
      console.log(returnedStatement);
    },
    error: function(xhr, status, err) {
      alert("Error can't connect to server");
    }
  });
  console.log("Latitude: " + position.coords.latitude);
  console.log("Longitude: " + position.coords.longitude);
}



