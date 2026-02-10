const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreValue = document.getElementById("score");
const highScoreValue = document.getElementById("high-score");
const statusMessage = document.getElementById("status");
const restartButton = document.getElementById("restart");

const tileCount = 20;
const tileSize = canvas.width / tileCount;
const speed = 120;

let snake;
let direction;
let nextDirection;
let food;
let score;
let highScore = Number(localStorage.getItem("snake-high-score") || 0);
let gameInterval;
let hasStarted;
let paused;

highScoreValue.textContent = String(highScore);

function randomCell() {
  return {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount),
  };
}

function createFood() {
  let nextFood = randomCell();

  while (snake.some((part) => part.x === nextFood.x && part.y === nextFood.y)) {
    nextFood = randomCell();
  }

  return nextFood;
}

function reset() {
  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ];
  direction = { x: 1, y: 0 };
  nextDirection = { ...direction };
  food = createFood();
  score = 0;
  hasStarted = false;
  paused = false;

  scoreValue.textContent = "0";
  statusMessage.textContent = "Press an arrow key to begin.";

  clearInterval(gameInterval);
  drawFrame();
}

function startLoop() {
  if (gameInterval) {
    return;
  }

  gameInterval = setInterval(tick, speed);
}

function stopLoop() {
  clearInterval(gameInterval);
  gameInterval = undefined;
}

function setDirection(newDirection) {
  const isReversing =
    snake.length > 1 &&
    newDirection.x === -direction.x &&
    newDirection.y === -direction.y;

  if (!isReversing) {
    nextDirection = newDirection;
  }
}

function update() {
  direction = nextDirection;

  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  };

  const hitWall =
    head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount;
  const hitSelf = snake.some((part) => part.x === head.x && part.y === head.y);

  if (hitWall || hitSelf) {
    stopLoop();
    statusMessage.textContent = "Game over. Press Restart to play again.";
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreValue.textContent = String(score);

    if (score > highScore) {
      highScore = score;
      highScoreValue.textContent = String(highScore);
      localStorage.setItem("snake-high-score", String(highScore));
    }

    food = createFood();
    statusMessage.textContent = "Nice! Keep going.";
  } else {
    snake.pop();
  }
}

function drawGrid() {
  ctx.fillStyle = "#9bbc0f";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(0, 0, 0, 0.08)";
  for (let i = 0; i <= tileCount; i += 1) {
    const line = i * tileSize;
    ctx.beginPath();
    ctx.moveTo(line, 0);
    ctx.lineTo(line, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, line);
    ctx.lineTo(canvas.width, line);
    ctx.stroke();
  }
}

function drawFood() {
  ctx.fillStyle = "#223200";
  ctx.beginPath();
  ctx.arc(
    food.x * tileSize + tileSize / 2,
    food.y * tileSize + tileSize / 2,
    tileSize * 0.35,
    0,
    Math.PI * 2,
  );
  ctx.fill();
}

function drawSnake() {
  snake.forEach((part, index) => {
    ctx.fillStyle = index === 0 ? "#0f380f" : "#306230";
    ctx.fillRect(part.x * tileSize + 1, part.y * tileSize + 1, tileSize - 2, tileSize - 2);
  });
}

function drawPause() {
  if (!paused) {
    return;
  }

  ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#d4f7d4";
  ctx.font = "bold 32px Trebuchet MS";
  ctx.textAlign = "center";
  ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2 + 10);
}

function drawFrame() {
  drawGrid();
  drawFood();
  drawSnake();
  drawPause();
}

function tick() {
  if (paused) {
    drawFrame();
    return;
  }

  update();
  drawFrame();
}

window.addEventListener("keydown", (event) => {
  const map = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
  };

  if (event.code === "Space") {
    event.preventDefault();

    if (!hasStarted || !gameInterval) {
      return;
    }

    paused = !paused;
    statusMessage.textContent = paused ? "Paused." : "Back in the game!";
    drawFrame();
    return;
  }

  const newDirection = map[event.key];
  if (!newDirection) {
    return;
  }

  event.preventDefault();

  setDirection(newDirection);

  if (!hasStarted) {
    hasStarted = true;
    statusMessage.textContent = "Collect the food and avoid walls.";
    startLoop();
  }
});

restartButton.addEventListener("click", reset);

reset();
