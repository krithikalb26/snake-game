const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

const boxSize = 20;
const canvasSize = 400;

// Initial game state
let snake, direction, food, score, isAlive, gameLoopId;

function initGame() {
    snake = [{x: 200, y: 200}];
    direction = "RIGHT";
    food = spawnFood();
    score = 0;
    isAlive = true;
    draw();
}

function startGame() {
    if (gameLoopId) clearTimeout(gameLoopId);
    initGame();
    gameLoop();
}

function gameOver() {
    isAlive = false;
    alert("Game Over! Your score: " + score);
}

function changeDirection(e) {
    if (!isAlive) return;
    if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    else if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
}

function spawnFood() {
    return {
        x: Math.floor(Math.random() * (canvasSize / boxSize)) * boxSize,
        y: Math.floor(Math.random() * (canvasSize / boxSize)) * boxSize
    };
}

function draw() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Draw food
    ctx.fillStyle = "#06c46b";
    ctx.fillRect(food.x, food.y, boxSize, boxSize);

    // Draw snake
    ctx.fillStyle = "#fff";
    snake.forEach(part => ctx.fillRect(part.x, part.y, boxSize, boxSize));

    // Draw score
    ctx.fillStyle = "#fff";
    ctx.font = "18px Arial";
    ctx.fillText("Score: " + score, 10, 20);
}

function update() {
    if (!isAlive) return;

    let head = {...snake[0]};
    if (direction === "UP") head.y -= boxSize;
    else if (direction === "DOWN") head.y += boxSize;
    else if (direction === "LEFT") head.x -= boxSize;
    else if (direction === "RIGHT") head.x += boxSize;

    // Collision detection
    if (
        head.x < 0 || head.x >= canvasSize ||
        head.y < 0 || head.y >= canvasSize ||
        snake.some(part => part.x === head.x && part.y === head.y)
    ) {
        gameOver();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        food = spawnFood();
    } else {
        snake.pop();
    }
}

function gameLoop() {
    if (isAlive) {
        update();
        draw();
        gameLoopId = setTimeout(gameLoop, 100);
    }
}

// Event listeners
document.addEventListener("keydown", changeDirection);

startBtn.addEventListener("click", startGame);

restartBtn.addEventListener("click", () => {
    startGame();
});

// Initialize first frame (game not running until Start pressed)
initGame();
