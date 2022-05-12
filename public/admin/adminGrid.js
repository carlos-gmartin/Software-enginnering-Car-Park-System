getCarParks();
// Canvas size
var canvasX = 1000;
var canvasY = 1000;

var rows;
var cols;

// Size of each cell
var cellSize = 100;

async function setup() {
  gridSize = await getGridSize();
  canvasX = 100 * gridSize[0];
  canvaxY = 100 * gridSize[1];
  console.log(canvasX);
  var canvas = createCanvas(canvasX, canvasY);
  canvas.parent('admin-grid');
  console.log(gridSize[0]);
  rows = gridSize[0];
  console.log(gridSize[1]);
  cols = gridSize[1];
  // console.log(gridSize);
  frameRate(20);
}

function draw() {
  console.log("Trying to draw!");
  stroke(0);
  //console.log(rows);
  //console.log(cols);
  // Ajax request for server database.
  $.ajax({
    url: "/getBookings",
    type: "GET",
    dataType: "json",
    success: function(returnedArray) {
      //console.log(returnedArray);
      var counter = 0;
      for(var y = 0; y < cols; y++) {
        for(var x = 0; x < rows; x++) {
          if(returnedArray[counter] == 1) {
            fill("green");
            rect(cellSize * x, cellSize * y, cellSize, cellSize);
            text(`x:${x} y:${y}`, 100 * x + 15, 100 * y + 15);
          } else if(returnedArray[counter] == 2) {
            fill("grey");
            rect(cellSize * x, cellSize * y, cellSize, cellSize);
            text(`x:${x} y:${y}`, 100 * x + 15, 100 * y + 15);
          } else {
            fill("red");
            rect(cellSize * x, cellSize * y, cellSize, cellSize);
            text(`x:${x} y:${y}`, 100 * x + 15, 100 * y + 15);
          }
          counter++;
        }
      }
    }
  })
}

async function getGridSize(){
  var gridSizeLocal;
  await $.ajax({
    url: "/getGridSize",
    type: "GET",
    dataType: "json",
    success: function(gridSize) {
      console.log("Grid sized: " + gridSize);
      gridSizeLocal = gridSize;     
    }
  })
  console.log(gridSizeLocal);
  return gridSizeLocal;
}


// create Grid button
document.addEventListener("DOMContentLoaded", function(event) { 
    document.getElementById('createGrid').addEventListener("click", function() {
        do{
            var rowSize = parseInt(window.prompt("Please enter a desired car park size to be created," + "rows: "), 10);
            var colSize = parseInt(window.prompt("Please enter a desired car park size to be created," + "cols: "), 10);
            var pricing = parseInt(window.prompt("Please enter the price for the car park spaces," + "price: "), 10);
        }
        while(isNaN(rowSize) || rowSize > 100 || rowSize < 1 || isNaN(colSize) || colSize > 100 || colSize < 1 || isNaN(pricing) || pricing > 100 || pricing < 1);

        var result = window.confirm("Are you sure you want to create a car park of size: " + rowSize + "," + colSize);
        if(result == true){
            $.ajax({
                url: "/createGridButton",
                type: "POST",
                data: { 
                    rowSize: rowSize,
                    colSize: colSize,
                    pricing: pricing
                },
                dataType: "json",
                success: function(response) {
                    alert('Car park created successfully grid of size: ' + response);
                }
            });
        }
        else{
            alert("Car Park was cancelled.");
        }
    });
});


//Get booking Request:
function mousePressed() {
  stroke(0);
  let x = Math.floor(mouseY / cellSize);
  let y = Math.floor(mouseX / cellSize);
  fill("blue");
  rect(y * cellSize, x * cellSize, cellSize, cellSize);
}



//AJAX function for dropdown
function getCarParks() {
  $.ajax({
    url: "/getCarParkDropdown",
    type: "GET",
    dataType: "json",
    success: function(carParks) {
      //Put html editing code for dropdown in here
      console.log(carParks);
    }
  })
}