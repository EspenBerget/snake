const pointsDisplay = document.getElementById("points");
const scoreDisplay = document.getElementById("score");

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

const space = e => {
    if (e.key = " ") {
        init();
    }
};

document.addEventListener("keypress", space);

function init() {
    document.removeEventListener("keypress", space);
    clearInterval(interval);
    randomFood();
    points = 0;
    move = "ArrowRight";
    head = {x: 100, y: 100};
    snake = [{x: head.x - size, y: 100}, {x: head.x - (size*2), y: 100}, {x: head.x - (size*3), y: 100}];
    interval = setInterval(run, 60);
}


document.addEventListener("keydown", e => { 
    if (!changed) {
        return;
    }
    let key = e.key;
    switch (key) {
        case "w":
            key = "ArrowUp";
            break;
        case "s":
            key = "ArrowDown";
            break;
        case "d":
            key = "ArrowRight";
            break;
        case "a":
            key = "ArrowLeft";
            break;
    }
    if (   (key == "ArrowUp"    && move != "ArrowDown")
        || (key == "ArrowDown"  && move != "ArrowUp")
        || (key == "ArrowLeft"  && move != "ArrowRight")
        || (key == "ArrowRight" && move != "ArrowLeft")) {
        move = key
        changed = false;
    }
}, false);

let rainbow = ctx.createLinearGradient(0, 0, 1200, 0);
rainbow.addColorStop(0, "red");
rainbow.addColorStop(0.1, "orange");
rainbow.addColorStop(0.3, "yellow");
rainbow.addColorStop(0.5, "green");
rainbow.addColorStop(0.7, "blue");
rainbow.addColorStop(0.8, "violet");
rainbow.addColorStop(1, "indigo");

function drawSnake() {
    ctx.fillStyle = rainbow;
    ctx.fillRect(head.x, head.y, size, size);
    for (let b of snake) {
        ctx.fillRect(b.x, b.y, size, size);
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

function drawGrid() {
    ctx.fillStyle="white";
    for (let x = 0; x < 48; x++) {
        ctx.beginPath();
        ctx.moveTo(x*size, 0);
        ctx.lineTo(x*size, gameWindow.height);
        ctx.stroke();
    }
    for (let y = 0; y < 24; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y*size);
        ctx.lineTo(gameWindow.width, y*size);
        ctx.stroke();
    }
}

function randomFood() {
    do {
        // This palces the red dot in the center
        food.x = Math.floor(Math.random() * 48) * size + 12.5;  // 48
        food.y = Math.floor(Math.random() * 24) * size + 12.5;  // 24
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
    drawGrid();
    drawFood();
    drawSnake();
    displayPoints();
}

function addScore(name) {
    let player = document.createElement("td");
    let score = document.createElement("td");
    let row = document.createElement("tr");

    player.innerText = name;
    score.innerText = points;

    row.appendChild(player);
    row.appendChild(score);

    scoreDisplay.appendChild(row);
}

function gameover() {
    clearInterval(interval);
    let name = prompt("Game Over!\nAdd player name\n(leave empty to drop score)", "");
    if (name !== "") {
        addScore(name);
    }
    pointsDisplay.innerText = "Press space to start";
    document.addEventListener("keypress", space);
}


function displayPoints() {
    pointsDisplay.innerText = "Points: " + points;
}