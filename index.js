const pointsDisplay = document.getElementById("points");

const gameWindow = document.getElementById("game-window");
const ctx = gameWindow.getContext('2d');


let changed = true; // set when a move has been made
let move = "ArrowRight";

const size = 25;
const step = size;

let head = {x: 100, y: 100};
let snake = [{x: head.x - size, y: 100}, {x: head.x - (size*2), y: 100}, {x: head.x - (size*3), y: 100}];

let food = {x: 0, y: 0};
let points = 0;

let interval = null;

function init() {
    clearInterval(interval);
    randomFood();
    points = 0;
    move = "ArrowRight";
    head = {x: 100, y: 100};
    snake = [{x: head.x - size, y: 100}, {x: head.x - (size*2), y: 100}, {x: head.x - (size*3), y: 100}];
    interval = setInterval(run, 100);
}

document.addEventListener("keypress", e => {
    if (e.key == " ") {
        init();
    }
});

document.addEventListener("keydown", e => { 
    if (!changed) {
        return;
    }
    if ((e.key == "ArrowUp" && move != "ArrowDown")
        || (e.key == "ArrowDown" && move != "ArrowUp")
        || (e.key == "ArrowLeft" && move != "ArrowRight")
        || (e.key == "ArrowRight" && move != "ArrowLeft")) {
        move = e.key
        changed = false;
    }
}, false);

function drawSquare(x, y) {
    ctx.fillStyle = "green";
    ctx.fillRect(x, y, size, size);
}

function drawSnake() {
    drawSquare(head.x, head.y);
    for (let b of snake) {
        drawSquare(b.x, b.y);
    }
}

function clear() {
    ctx.clearRect(0, 0, gameWindow.width, gameWindow.height);
}

function withinSnake(x, y) {
    for (let b of snake) {
        if ((b.x <= x && x < b.x+size) && (b.y <= y && y < b.y+size)) {
            return true;
        }
    }
    return false;
}

function drawFood() {
    ctx.fillStyle="red";
    ctx.beginPath();
    ctx.arc(food.x, food.y, Math.floor(size / 4), 0, 2*Math.PI);
    ctx.fill();
}

function moveSnake() {
    snake.unshift({...head});
    switch (move) {
        case "ArrowUp":
            if (head.y > 0) {
                head.y -= step;
            } else {
                return true;
            }
            break;
        case "ArrowDown":
            if (head.y+size < gameWindow.height) {
                head.y += step;
            } else {
                return true;
            }
            break;
        case "ArrowRight":
            if (head.x+size < gameWindow.width) {
                head.x += step;
            } else {
                return true;
            }
            break;
        case "ArrowLeft":
            if (head.x > 0) {
                head.x -= step;
            } else {
                return true; 
            }
            break;
    }
    changed = true;
    return false;
}

function randomFood() {
    do {
        food.x = Math.floor(Math.random() * gameWindow.width); 
        food.y = Math.floor(Math.random() * gameWindow.height);
    } while (withinSnake(food.x, food.y));
}

function run() {
    if (withinSnake(head.x, head.y)) {
        gameover();
        return;
    }
    if (moveSnake()) {
        gameover();
        return;
    }
    if ((food.x >= head.x && food.x < head.x+size) && (food.y >= head.y && food.y < head.y+size)) {
        randomFood();
        points += 1;
    } else {
        snake.pop();
    }
    clear();
    drawFood();
    drawSnake();
    displayPoints();
}


function gameover() {
    clearInterval(interval);
    pointsDisplay.innerText = "Press space to start";
    interval = null;
    alert("Game Over");
}


function displayPoints() {
    pointsDisplay.innerText = "Points: " + points;
}