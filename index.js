var canvas = document.getElementById("canvas");
document.onkeydown = checkKey;
var ctx = canvas.getContext("2d");

var resize = function () {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
};
window.onresize = resize;
resize();

// Init. Stage
var stage = [];

// Init. snakePlayer
var speed = 5;
var canTurn = true;
var gameOver = false;
var snake_id = 1;

var snake = [];
snake.push({
  id: snake_id,
  type: 1,
  dx: speed,
  dy: 0,
  index: 0,
  stageCell: null,
  parent: snake,
});
for (var index = 1; index < 6; index++) {
  var unit = {
    id: snake_id,
    type: 1,
    index: index,
    parent: snake,
    stageCell: null,
  };
  snake.push(unit);
}
snake_id++;

// Push the snake to the stage
for (let index = 0; index < snake.length; index++) {
  let emp = {
    x: getRandomInt(width),
    y: getRandomInt(height),
    objs: [],
  };
  stage.push(emp);
  snake[index].stageCell = emp;
  emp.objs.push(snake[index]);
}

// Init. AI snakes
var snakes = [];

// Init. food
var food = {
  type: 2,
  effect: 1,
  stageCell: null,
};
// Push food to the stage
let emp = {
  x: getRandomInt(width),
  y: getRandomInt(height),
  objs: [],
};
stage.push(emp);
food.stageCell = emp;
emp.objs.push(food);

function snakeMove() {
  let snake = stage.filter(element => element.objs[0].type === 1).reverse();
  //console.log(snake);
  snake.forEach(element => {
    if (element.objs[0].index === 0) {
      element.x += element.objs[0].dx;
      element.y += element.objs[0].dy;

      // Wall Collision
      if (element.x >= width) {
        element.x = 0;
      }
      if (element.x < 0) {
        element.x = width - 1;
      }
      if (element.y <= 0) {
        element.y = height - 1;
      }
      if (element.y >= height) {
        element.y = 0;
      }
    } else {
      element.x = element.objs[0].parent[element.objs[0].index - 1].stageCell.x;
      element.y = element.objs[0].parent[element.objs[0].index - 1].stageCell.y;
    }
  });
  canTurn = true;
}

function eat() {
  let heads = stage.filter(
    element => element.objs[0].type === 1 && element.objs[0].index === 0
  );
  let foods = stage.filter(element => element.objs[0].type === 2);
  heads.forEach(head => {
    foods.forEach(food => {
      if (head.x <= food.x + 8 && head.x >= food.x - 8) {
        if (head.y <= food.y + 8 && head.y >= food.y - 8) {
          if (food.objs[0].effect === 1) {
            food.x = getRandomInt(width);
            food.y = getRandomInt(height);
            let emp = {
              x: 0,
              y: 0,
              objs: [],
            };
            stage.push(emp);
            let unit = {
              id: head.objs[0].id,
              type: 1,
              index: head.objs[0].parent.length,
              parent: head.objs[0].parent,
              stageCell: emp,
            };
            head.objs[0].parent.push(unit);
            emp.objs.push(unit);
          } else {
            if (food.objs[0].effect === 2) {
              stage = stage.filter(element => element !== food);
              for (let index = 0; index < 5; index++) {
                let emp = {
                  x: 0,
                  y: 0,
                  objs: [],
                };
                stage.push(emp);
                let unit = {
                  id: head.objs[0].id,
                  type: 1,
                  index: head.objs[0].parent.length,
                  parent: head.objs[0].parent,
                  stageCell: emp,
                };
                head.objs[0].parent.push(unit);
                emp.objs.push(unit);
              }
            }
          }
        }
      }
    });
  });
}
//Show super Food
setTimeout(showSuperFood(), 10000);
function showSuperFood() {
  // Init. food
  var superFood = {
    type: 2,
    effect: 2,
    stageCell: null,
  };
  // Push food to the stage
  let emp = {
    x: getRandomInt(width),
    y: getRandomInt(height),
    objs: [],
  };
  stage.push(emp);
  superFood.stageCell = emp;
  emp.objs.push(superFood);

  setTimeout(showSuperFood, 10000);
}
setTimeout(showAI(), 10000);
function showAI() {
  let AI = [];
  AI.push({
    id: snake_id,
    type: 1,
    dx: speed,
    dy: 0,
    index: 0,
    stageCell: null,
    parent: AI,
  });
  for (var index = 1; index < 6; index++) {
    var unit = {
      id: snake_id,
      type: 1,
      index: index,
      parent: AI,
      stageCell: null,
    };
    AI.push(unit);
  }
  snake_id++;
  // Push the snake to the stage
  for (let index = 0; index < AI.length; index++) {
    let emp = {
      x: 0,
      y: 0,
      objs: [],
    };
    stage.push(emp);
    AI[index].stageCell = emp;
    emp.objs.push(AI[index]);
    snakes.push(AI);
  }
  setTimeout(showAI, 10000);
}
function AImove() {
  let foods = stage.filter(element => element.objs[0].type === 2);
  let targetedFood = foods[getRandomInt(foods.length)];
  snakes.forEach(snake => {
    head = snake.filter(element => element.index === 0)[0];
    // console.log(targetedFood);
    // console.log("head", head);
    if (
      head.stageCell.x <= targetedFood.x + 8 &&
      head.stageCell.x >= targetedFood.x - 8
    ) {
      head.dx = 0;
      head.dy = speed;
    }
    if (
      head.stageCell.y <= targetedFood.y + 8 &&
      head.stageCell.y >= targetedFood.y - 8
    ) {
      head.dy = 0;
      head.dx = speed;
    }
  });
}

function isGameOver() {
  let heads = stage.filter(
    element => element.objs[0].type === 1 && element.objs[0].index === 0
  );
  let body = stage.filter(
    element => element.objs[0].type === 1 && element.objs[0].index !== 0
  );
  body.forEach(element => {
    heads.forEach(head => {
      if (head.x <= element.x + 4 && head.x >= element.x - 4) {
        if (head.y <= element.y + 4 && head.y >= element.y - 4) {
          if (head.objs[0].id === element.objs[0].id) {
            stage = stage.filter(units => units.objs[0].id !== head.objs[0].id);
          } else {
            if (head.objs[0].parent.length > element.objs[0].parent.length) {
              for (
                let index = 0;
                index < element.objs[0].parent.length;
                index++
              ) {
                let emp = {
                  x: 0,
                  y: 0,
                  objs: [],
                };
                stage.push(emp);
                let unit = {
                  id: head.objs[0].id,
                  type: 1,
                  index: head.objs[0].parent.length,
                  parent: head.objs[0].parent,
                  stageCell: emp,
                };
                head.objs[0].parent.push(unit);
                emp.objs.push(unit);
              }
              stage = stage.filter(
                units => units.objs[0].id !== element.objs[0].id
              );
            } else {
              for (let index = 0; index < head.objs[0].parent.length; index++) {
                let emp = {
                  x: 0,
                  y: 0,
                  objs: [],
                };
                stage.push(emp);
                let unit = {
                  id: element.objs[0].id,
                  type: 1,
                  index: element.objs[0].parent.length,
                  parent: element.objs[0].parent,
                  stageCell: emp,
                };
                element.objs[0].parent.push(unit);
                emp.objs.push(unit);
              }
              stage = stage.filter(
                units => units.objs[0].id !== head.objs[0].id
              );
            }
          }
        }
      }
    });
  });
  var player = stage.filter(units => units.objs[0].id === 1);
  if (player.length === 0) {
    gameOver = true;
  }
}

function checkKey(event) {
  let unit = stage.filter(
    element => element.objs[0].type === 1 && element.objs[0].index === 0
  )[0].objs[0];

  // Up
  if (event.keyCode === 38 && unit.dy <= 0 && canTurn) {
    unit.dy = -speed;
    unit.dx = 0;
    canTurn = false;
  }
  // Down
  if (event.keyCode === 40 && unit.dy >= 0 && canTurn) {
    unit.dy = speed;
    unit.dx = 0;
    canTurn = false;
  }
  // Left
  if (event.keyCode === 37 && unit.dx <= 0 && canTurn) {
    unit.dy = 0;
    unit.dx = -speed;
    canTurn = false;
  }
  // Right
  if (event.keyCode === 39 && unit.dx >= 0 && canTurn) {
    unit.dy = 0;
    unit.dx = speed;
    canTurn = false;
  }
}

function update() {
  // Move the snake
  AImove();
  snakeMove();

  // Check Food Collision
  eat();
  // Check snake collision
  isGameOver();
}

function draw() {
  ctx.clearRect(0, 0, width, height);
  stage.forEach(element => {
    ctx.font = "30px Verdana";
    ctx.fillText(snake.length - 6, 10, 50);
    if (element.objs[0].type === 2 && element.objs[0].effect === 2) {
      ctx.fillStyle = "green";
    }
    ctx.fillRect(element.x, element.y, 10, 10);
    ctx.fillStyle = "black";
  });
  ctx.font = "30px Verdana";
  ctx.fillText(snake.length - 6, 10, 50);
}

function loop(timestamp) {
  if (!gameOver) {
    update();
    draw();
    lastRender = timestamp;
    window.requestAnimationFrame(loop);
  } else {
    ctx.font = "30px Verdana";
    ctx.fillStyle = "black";
    ctx.fillText("GAME OVER!", width / 2 - 100, height / 2);
  }
}
var lastRender = 0;
window.requestAnimationFrame(loop);

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
