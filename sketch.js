var ti = performance.now();

var cols = 50;
var rows = 50;

var grid = new Array(cols);

var openSet = []
var closedSet = []
var start;
var end;
var w, h;
var path = [];
var noSolution = false;

function Spot(i,j){
  this.i = i;
  this.j = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.neighbors = [];
  this.previous = undefined;
  this.wall = false;

  //gerando spots obstaculos aleatoriamente
  if (random(1) < 0.3){
    this.wall = true;
  }

  this.show = function(color){
    fill(color);
    if (this.wall){
      fill(0);
    }
    stroke(0);
    rect(this.i * w, this.j * h, w, h);
  }

  this.addNeighbors = function(grid){
    if (this.i < cols-1){
      this.neighbors.push(grid[this.i+1][this.j]);
    }
    if (this.i > 0){
      this.neighbors.push(grid[this.i-1][this.j]);
    }
    if (this.j < rows-1){
      this.neighbors.push(grid[this.i][this.j+1]);
    }
    if (this.j > 0){
      this.neighbors.push(grid[this.i][this.j-1]);
    }
  }
}

function removeFromArray(arr, elt) {
  for (let i = arr.length-1; i >= 0; i--){
    if (arr[i] == elt){
      arr.splice(i, 1);
    }
  }
}

function heuristic(a, b){
  var d = abs(a.i-b.i) + abs(a.j-b.j);
  return d;
}

function setup() {
    createCanvas(600,600);

    w = width / cols;
    h = height / rows;

    //construindo o grid
    for(let i = 0; i < cols; i++){
        grid[i] = new Array(rows);
    }

    for(let i = 0; i < cols; i++){
      for(let j = 0; j < rows; j++){
        grid[i][j] = new Spot(i,j);
      }
    }

    //adiciona os vizinhos de cada spot
    for(let i = 0; i < cols; i++){
      for(let j = 0; j < rows; j++){
        grid[i][j].addNeighbors(grid);
      }
    }

    console.log(grid, grid.length);

    //definindo o ponto inicial e o ponto final do caminho
    start = grid[0][0];
    end = grid[cols-1][rows-1];

    start.wall = false;
    end.wall = false;

    openSet.push(start);

}

function draw(){

  if (openSet.length > 0){

    //Acha o proximo spot com menor f
    var winner = 0;
    for (let i = 0; i < openSet.length; i++){
      if(openSet[i].f < openSet[winner].f){
        winner = i;
      }
    }

    var current = openSet[winner];

    // se o spot atual é igual o fim - achou o melhor caminho
    if (current === end){
      noLoop();
      let size = path.length + 1;
      var tf = performance.now();
      console.log(ti, tf, tf-ti); 
      document.getElementById("time").innerHTML = "Tempo de excução: " + ((tf-ti)/1000).toFixed(2) + "s";
      document.getElementById("path").innerHTML = "Tamanho do caminho: " + size;
      document.getElementById("resultado").innerHTML = "Resultado: Solução encontrada!";
    }

    // coloca o spot atual na lista de fechados e remove da lista de abertos
    closedSet.push(current);
    removeFromArray(openSet, current);

    var neighbors = current.neighbors;
    for (let i = 0; i < neighbors.length; i++){
      var neighbor = neighbors[i];

      if(!closedSet.includes(neighbor) && !neighbor.wall){
        var tempG = current.g + 1;

        if(openSet.includes(neighbor)){
          if(tempG < neighbor.g){
            neighbor.g = tempG;
          }
        } else {
          neighbor.g = tempG;
          openSet.push(neighbor);
        }

        neighbor.h = heuristic(neighbor, end);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.previous = current;
      }
    }

  } else {
    noSolution = true;
    noLoop();
    var tf = performance.now();
    console.log(ti, tf, tf-ti); 
    document.getElementById("time").innerHTML = "Tempo de excução: " + ((tf-ti)/1000).toFixed(2) + "s";
    document.getElementById("path").innerHTML = "Tamanho do caminho: 0";
    document.getElementById("resultado").innerHTML = "Resultado: sem solução :(";
  }

  background(0);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].show(color(255));
    }
  }

  for (let i = 0; i < closedSet.length; i++){
    closedSet[i].show(color(255,0,0));
  }

  for (let i = 0; i < openSet.length; i++){
    openSet[i].show(color(0,255,255));
  }

  //path back
  if(!noSolution){
    path = [];
    var temp = current;
    path.push(temp);
    while(temp.previous){
      path.push(temp.previous);
      temp = temp.previous;
    }
  }

  for (let i = 0; i < path.length; i++){
    path[i].show(color(0,255,0));
  }

  start.show(color(0,0,255));
  end.show(color(255,255,0));
  
  if(noSolution){
    for(let i = 0; i < cols; i++){
      for(let j = 0; j < rows; j++){
        if(!grid[i][j].wall){
          grid[i][j].show(color(255,0,0));
        }
      }
    }
  }
}