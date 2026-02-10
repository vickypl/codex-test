const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreValue = document.getElementById("score");
const highScoreValue = document.getElementById("high-score");
const statusMessage = document.getElementById("status");
const restartButton = document.getElementById("restart");
const speedSelect = document.getElementById("speed-select");
const levelSelect = document.getElementById("level-select");
const arenaSelect = document.getElementById("arena-select");
const themeSelect = document.getElementById("theme-select");
const touchControls = document.getElementById("touch-controls");
const pauseButton = document.getElementById("touch-pause");

const tileCount = 20;
const tileSize = canvas.width / tileCount;

const speedOptions = {
  slow: 180,
  normal: 120,
  fast: 90,
  turbo: 65,
};
const defaultSpeed = "normal";
const defaultLevel = "classic";
const defaultArena = "open";

function cellsFromRect(x, y, width, height) {
  const cells = [];
  for (let dx = 0; dx < width; dx += 1) {
    for (let dy = 0; dy < height; dy += 1) {
      cells.push({ x: x + dx, y: y + dy });
    }
  }
  return cells;
}

const arenas = {
  open: {
    label: "Open Field",
    walls: [],
    movingObstacles: [],
  },
  crossroads: {
    label: "Crossroads Walls",
    walls: [
      ...cellsFromRect(4, 4, 12, 1),
      ...cellsFromRect(4, 15, 12, 1),
      ...cellsFromRect(4, 5, 1, 10),
      ...cellsFromRect(15, 5, 1, 10),
      ...cellsFromRect(9, 0, 2, 5),
      ...cellsFromRect(9, 15, 2, 5),
    ],
    movingObstacles: [],
  },
  spiral: {
    label: "Spiral Maze",
    walls: [
      ...cellsFromRect(2, 2, 16, 1),
      ...cellsFromRect(2, 3, 1, 15),
      ...cellsFromRect(4, 17, 14, 1),
      ...cellsFromRect(17, 4, 1, 11),
      ...cellsFromRect(5, 4, 10, 1),
      ...cellsFromRect(5, 5, 1, 10),
      ...cellsFromRect(7, 14, 9, 1),
      ...cellsFromRect(14, 7, 1, 6),
      ...cellsFromRect(8, 7, 5, 1),
      ...cellsFromRect(8, 8, 1, 4),
    ],
    movingObstacles: [],
  },
  tunnels: {
    label: "Twin Tunnels",
    walls: [
      ...cellsFromRect(0, 4, 8, 1),
      ...cellsFromRect(12, 4, 8, 1),
      ...cellsFromRect(0, 15, 8, 1),
      ...cellsFromRect(12, 15, 8, 1),
      ...cellsFromRect(8, 6, 1, 8),
      ...cellsFromRect(11, 6, 1, 8),
      ...cellsFromRect(3, 8, 3, 1),
      ...cellsFromRect(14, 11, 3, 1),
    ],
    movingObstacles: [],
  },
  patrol: {
    label: "Moving Patrols",
    walls: [
      ...cellsFromRect(0, 9, 5, 1),
      ...cellsFromRect(15, 9, 5, 1),
      ...cellsFromRect(9, 0, 1, 5),
      ...cellsFromRect(9, 15, 1, 5),
    ],
    movingObstacles: [
      { x: 3, y: 3, axis: "x", min: 3, max: 16, speed: 1, direction: 1 },
      { x: 16, y: 6, axis: "x", min: 3, max: 16, speed: 1, direction: -1 },
      { x: 6, y: 16, axis: "y", min: 3, max: 16, speed: 1, direction: -1 },
      { x: 13, y: 3, axis: "y", min: 3, max: 16, speed: 1, direction: 1 },
    ],
  },
};
const themes = {
  nokia: {
    boardGradient: ["#9bbc0f", "#86a60c"],
    gridLine: "rgba(8, 20, 2, 0.12)",
    fruitGradient: ["#d9ff9f", "#365111", "#1d2b07"],
    fruitStroke: "rgba(12, 28, 4, 0.6)",
    snakeHead: ["#9ae6b4", "#2f855a", "#14532d"],
    snakeBody: ["#6ee7b7", "#276749", "#14532d"],
    snakeSpot: "rgba(220, 252, 231, 0.3)",
    eyeWhite: "#ecfeff",
    eyePupil: "#052e16",
    tongue: "#fb7185",
    pauseOverlay: "rgba(0, 0, 0, 0.4)",
    pauseText: "#d4f7d4",
  },
  sunset: {
    boardGradient: ["#f97316", "#be123c"],
    gridLine: "rgba(86, 11, 45, 0.25)",
    fruitGradient: ["#fde68a", "#f97316", "#b91c1c"],
    fruitStroke: "rgba(98, 9, 30, 0.6)",
    snakeHead: ["#fef08a", "#f59e0b", "#b45309"],
    snakeBody: ["#fdba74", "#ea580c", "#9a3412"],
    snakeSpot: "rgba(255, 237, 213, 0.4)",
    eyeWhite: "#fff7ed",
    eyePupil: "#7c2d12",
    tongue: "#f43f5e",
    pauseOverlay: "rgba(54, 3, 18, 0.48)",
    pauseText: "#ffe4e6",
  },
  ocean: {
    boardGradient: ["#38bdf8", "#0f766e"],
    gridLine: "rgba(7, 56, 67, 0.22)",
    fruitGradient: ["#dbeafe", "#60a5fa", "#1d4ed8"],
    fruitStroke: "rgba(12, 36, 108, 0.6)",
    snakeHead: ["#ccfbf1", "#0d9488", "#115e59"],
    snakeBody: ["#99f6e4", "#0f766e", "#134e4a"],
    snakeSpot: "rgba(240, 253, 250, 0.35)",
    eyeWhite: "#ecfeff",
    eyePupil: "#083344",
    tongue: "#f472b6",
    pauseOverlay: "rgba(3, 37, 65, 0.45)",
    pauseText: "#cffafe",
  },
  arctic: {
    boardGradient: ["#f8fafc", "#cbd5e1"],
    gridLine: "rgba(30, 41, 59, 0.16)",
    fruitGradient: ["#fee2e2", "#fda4af", "#be123c"],
    fruitStroke: "rgba(127, 29, 29, 0.55)",
    snakeHead: ["#dbeafe", "#3b82f6", "#1e40af"],
    snakeBody: ["#bfdbfe", "#2563eb", "#1d4ed8"],
    snakeSpot: "rgba(239, 246, 255, 0.65)",
    eyeWhite: "#f8fafc",
    eyePupil: "#0f172a",
    tongue: "#e11d48",
    pauseOverlay: "rgba(15, 23, 42, 0.38)",
    pauseText: "#e2e8f0",
  },
  midnight: {
    boardGradient: ["#1e1b4b", "#020617"],
    gridLine: "rgba(45, 212, 191, 0.2)",
    fruitGradient: ["#f5d0fe", "#c026d3", "#701a75"],
    fruitStroke: "rgba(88, 28, 135, 0.6)",
    snakeHead: ["#86efac", "#22d3ee", "#0f766e"],
    snakeBody: ["#67e8f9", "#0ea5e9", "#155e75"],
    snakeSpot: "rgba(165, 243, 252, 0.3)",
    eyeWhite: "#f0fdfa",
    eyePupil: "#0f172a",
    tongue: "#f9a8d4",
    pauseOverlay: "rgba(2, 6, 23, 0.52)",
    pauseText: "#ccfbf1",
  },
};
const defaultTheme = "nokia";
let activeTheme = themes[defaultTheme];

const directionMap = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

const INPUT_MODE = {
  KEYBOARD: "keyboard",
  TOUCH: "touch",
};

function isChromeBrowser() {
  const ua = navigator.userAgent || "";
  const vendor = navigator.vendor || "";
  const hasChromeToken = /(Chrome|CriOS)/.test(ua);
  const isEdgeOpera = /(Edg|OPR|SamsungBrowser|YaBrowser|UCBrowser|DuckDuckGo)/.test(ua);

  if (!hasChromeToken || isEdgeOpera) {
    return false;
  }

  return vendor.includes("Google") || /CriOS/.test(ua);
}

function isMobilePlatform() {
  const userAgentDataMobile = navigator.userAgentData?.mobile;
  if (typeof userAgentDataMobile === "boolean") {
    return userAgentDataMobile;
  }

  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || "");
}

function detectInputMode() {
  if (!isChromeBrowser()) {
    return INPUT_MODE.KEYBOARD;
  }

  return isMobilePlatform() ? INPUT_MODE.TOUCH : INPUT_MODE.KEYBOARD;
}

const inputMode = detectInputMode();
document.body.dataset.inputMode = inputMode;

function updateTouchControlVisibility() {
  if (!touchControls) {
    return;
  }

  const enableTouchControls = inputMode === INPUT_MODE.TOUCH;
  touchControls.hidden = !enableTouchControls;
  touchControls.setAttribute("aria-hidden", String(!enableTouchControls));
}

function getTheme() {
  const selectedTheme = themeSelect?.value || defaultTheme;
  return themes[selectedTheme] || themes[defaultTheme];
}

function isHardLevel() {
  return levelSelect?.value === "hard";
}

function getTickSpeed() {
  const selectedSpeed = speedSelect?.value || defaultSpeed;
  return speedOptions[selectedSpeed] || speedOptions[defaultSpeed];
}

let snake;
let direction;
let nextDirection;
let food;
let score;
let currentArena;
let staticWallSet;
let movingObstacles;
let highScore = Number(localStorage.getItem("snake-high-score") || 0);
let gameInterval;
let hasStarted;
let paused;
let audioContext;

highScoreValue.textContent = String(highScore);

function getAudioContext() {
  if (!audioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
      return null;
    }

    audioContext = new AudioCtx();
  }

  return audioContext;
}

function playTone({ frequency, duration = 0.12, type = "square", volume = 0.08, delay = 0 }) {
  const context = getAudioContext();
  if (!context) {
    return;
  }

  const startAt = context.currentTime + delay;
  const endAt = startAt + duration;

  const oscillator = context.createOscillator();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startAt);

  const gain = context.createGain();
  gain.gain.setValueAtTime(0, startAt);
  gain.gain.linearRampToValueAtTime(volume, startAt + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, endAt);

  oscillator.connect(gain);
  gain.connect(context.destination);

  oscillator.start(startAt);
  oscillator.stop(endAt);
}

function playSound(effect) {
  const context = getAudioContext();
  if (!context) {
    return;
  }

  if (context.state === "suspended") {
    context.resume();
  }

  if (effect === "eat") {
    playTone({ frequency: 660, duration: 0.08, type: "triangle", volume: 0.06 });
    playTone({ frequency: 880, duration: 0.09, type: "triangle", volume: 0.06, delay: 0.06 });
    return;
  }

  if (effect === "gameOver") {
    playTone({ frequency: 220, duration: 0.14, type: "sawtooth", volume: 0.09 });
    playTone({ frequency: 174, duration: 0.16, type: "sawtooth", volume: 0.08, delay: 0.12 });
    playTone({ frequency: 130, duration: 0.18, type: "sawtooth", volume: 0.08, delay: 0.24 });
    return;
  }

  if (effect === "start") {
    playTone({ frequency: 392, duration: 0.07, type: "square", volume: 0.05 });
    playTone({ frequency: 523, duration: 0.1, type: "square", volume: 0.06, delay: 0.06 });
    return;
  }

  if (effect === "pause") {
    playTone({ frequency: 294, duration: 0.08, type: "square", volume: 0.05 });
    return;
  }

  if (effect === "resume") {
    playTone({ frequency: 440, duration: 0.08, type: "square", volume: 0.05 });
    return;
  }

  if (effect === "newHighScore") {
    playTone({ frequency: 784, duration: 0.09, type: "triangle", volume: 0.06 });
    playTone({ frequency: 988, duration: 0.11, type: "triangle", volume: 0.06, delay: 0.08 });
  }
}

function randomCell() {
  return {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount),
  };
}

function getArena() {
  const selectedArena = arenaSelect?.value || defaultArena;
  return arenas[selectedArena] || arenas[defaultArena];
}

function toCellKey(cell) {
  return `${cell.x},${cell.y}`;
}

function buildStaticWallSet(arena) {
  return new Set(arena.walls.map(toCellKey));
}

function createMovingObstacles(arena) {
  return arena.movingObstacles.map((obstacle) => ({ ...obstacle, travelTick: 0 }));
}

function isBlockedCell(cell) {
  const key = toCellKey(cell);
  if (staticWallSet.has(key)) {
    return true;
  }

  return movingObstacles.some((obstacle) => obstacle.x === cell.x && obstacle.y === cell.y);
}

function createFood() {
  let nextFood = randomCell();
  let guard = tileCount * tileCount * 3;

  while (guard > 0 && (snake.some((part) => part.x === nextFood.x && part.y === nextFood.y) || isBlockedCell(nextFood))) {
    nextFood = randomCell();
    guard -= 1;
  }

  return nextFood;
}

function reset() {
  currentArena = getArena();
  staticWallSet = buildStaticWallSet(currentArena);
  movingObstacles = createMovingObstacles(currentArena);

  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ];

  while (snake.some((part) => isBlockedCell(part))) {
    snake = snake.map((part) => ({ x: part.x, y: (part.y + 1) % tileCount }));
  }

  direction = { x: 1, y: 0 };
  nextDirection = { ...direction };
  food = createFood();
  score = 0;
  hasStarted = false;
  paused = false;

  scoreValue.textContent = "0";
  const startHint = inputMode === INPUT_MODE.TOUCH
    ? "Tap the on-screen arrows to begin."
    : "Press an arrow key to begin.";

  statusMessage.textContent = `Arena: ${currentArena.label}. ${startHint}`;

  stopLoop();
  drawFrame();
}

function startLoop() {
  if (gameInterval) {
    return;
  }

  gameInterval = setInterval(tick, getTickSpeed());
}

function stopLoop() {
  clearInterval(gameInterval);
  gameInterval = undefined;
}

function refreshLoopSpeed() {
  if (!gameInterval) {
    return;
  }

  stopLoop();
  startLoop();
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

function updateMovingObstacles() {
  movingObstacles.forEach((obstacle) => {
    obstacle.travelTick += 1;
    if (obstacle.travelTick < obstacle.speed) {
      return;
    }

    obstacle.travelTick = 0;
    const nextValue = obstacle[obstacle.axis] + obstacle.direction;

    if (nextValue < obstacle.min || nextValue > obstacle.max) {
      obstacle.direction *= -1;
      obstacle[obstacle.axis] += obstacle.direction;
    } else {
      obstacle[obstacle.axis] = nextValue;
    }
  });
}

function update() {
  direction = nextDirection;

  const rawHead = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  };

  if (isHardLevel() && (rawHead.x < 0 || rawHead.x >= tileCount || rawHead.y < 0 || rawHead.y >= tileCount)) {
    stopLoop();
    statusMessage.textContent = "Game over at the wall. Press Restart to play again.";
    playSound("gameOver");
    return;
  }

  const head = isHardLevel()
    ? rawHead
    : {
      x: (rawHead.x + tileCount) % tileCount,
      y: (rawHead.y + tileCount) % tileCount,
    };

  const hitWall = staticWallSet.has(toCellKey(head));
  if (hitWall) {
    stopLoop();
    statusMessage.textContent = "Game over. You crashed into a wall.";
    playSound("gameOver");
    return;
  }

  const hitSelf = snake.some((part) => part.x === head.x && part.y === head.y);

  if (hitSelf) {
    stopLoop();
    statusMessage.textContent = "Game over. Press Restart to play again.";
    playSound("gameOver");
    return;
  }

  snake.unshift(head);

  updateMovingObstacles();
  const obstacleHit = movingObstacles.some((obstacle) => obstacle.x === head.x && obstacle.y === head.y);
  const obstacleBodyHit = movingObstacles.some((obstacle) => snake.some((part) => part.x === obstacle.x && part.y === obstacle.y));

  if (obstacleHit || obstacleBodyHit) {
    stopLoop();
    statusMessage.textContent = "Game over. A moving obstacle got you.";
    playSound("gameOver");
    return;
  }

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreValue.textContent = String(score);
    playSound("eat");

    if (score > highScore) {
      highScore = score;
      highScoreValue.textContent = String(highScore);
      localStorage.setItem("snake-high-score", String(highScore));
      playSound("newHighScore");
    }

    food = createFood();
    statusMessage.textContent = "Nice! Keep going.";
  } else {
    snake.pop();
  }
}

function drawGrid() {
  const boardGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  boardGradient.addColorStop(0, activeTheme.boardGradient[0]);
  boardGradient.addColorStop(1, activeTheme.boardGradient[1]);
  ctx.fillStyle = boardGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = activeTheme.gridLine;
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

function drawArenaObstacles() {
  ctx.fillStyle = "rgba(2, 6, 23, 0.48)";
  staticWallSet.forEach((key) => {
    const [x, y] = key.split(",").map(Number);
    ctx.fillRect(x * tileSize + 1.5, y * tileSize + 1.5, tileSize - 3, tileSize - 3);
  });

  movingObstacles.forEach((obstacle) => {
    const cx = obstacle.x * tileSize + tileSize / 2;
    const cy = obstacle.y * tileSize + tileSize / 2;
    ctx.fillStyle = "rgba(239, 68, 68, 0.92)";
    ctx.beginPath();
    ctx.arc(cx, cy, tileSize * 0.3, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawFood() {
  const centerX = food.x * tileSize + tileSize / 2;
  const centerY = food.y * tileSize + tileSize / 2;

  const fruitGradient = ctx.createRadialGradient(
    centerX - tileSize * 0.1,
    centerY - tileSize * 0.12,
    tileSize * 0.05,
    centerX,
    centerY,
    tileSize * 0.38,
  );
  fruitGradient.addColorStop(0, activeTheme.fruitGradient[0]);
  fruitGradient.addColorStop(0.55, activeTheme.fruitGradient[1]);
  fruitGradient.addColorStop(1, activeTheme.fruitGradient[2]);

  ctx.fillStyle = fruitGradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, tileSize * 0.35, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = activeTheme.fruitStroke;
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawSnake() {
  snake.forEach((part, index) => {
    const x = part.x * tileSize + tileSize / 2;
    const y = part.y * tileSize + tileSize / 2;

    const segmentGradient = ctx.createRadialGradient(
      x - tileSize * 0.15,
      y - tileSize * 0.18,
      tileSize * 0.08,
      x,
      y,
      tileSize * 0.55,
    );
    segmentGradient.addColorStop(0, index === 0 ? activeTheme.snakeHead[0] : activeTheme.snakeBody[0]);
    segmentGradient.addColorStop(0.6, index === 0 ? activeTheme.snakeHead[1] : activeTheme.snakeBody[1]);
    segmentGradient.addColorStop(1, index === 0 ? activeTheme.snakeHead[2] : activeTheme.snakeBody[2]);

    ctx.fillStyle = segmentGradient;
    ctx.beginPath();
    ctx.roundRect(part.x * tileSize + 1.8, part.y * tileSize + 1.8, tileSize - 3.6, tileSize - 3.6, tileSize * 0.25);
    ctx.fill();

    if (index > 0) {
      ctx.fillStyle = activeTheme.snakeSpot;
      ctx.beginPath();
      ctx.arc(x, y, tileSize * 0.11, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  const head = snake[0];
  const headX = head.x * tileSize;
  const headY = head.y * tileSize;
  const centerX = headX + tileSize / 2;
  const centerY = headY + tileSize / 2;

  const eyeOffsetX = direction.x !== 0 ? direction.x * tileSize * 0.16 : tileSize * 0.14;
  const eyeOffsetY = direction.y !== 0 ? direction.y * tileSize * 0.16 : tileSize * 0.14;

  const leftEyeX = centerX + eyeOffsetX + (direction.y !== 0 ? -tileSize * 0.15 : 0);
  const leftEyeY = centerY + eyeOffsetY + (direction.x !== 0 ? -tileSize * 0.15 : 0);
  const rightEyeX = centerX + eyeOffsetX + (direction.y !== 0 ? tileSize * 0.15 : 0);
  const rightEyeY = centerY + eyeOffsetY + (direction.x !== 0 ? tileSize * 0.15 : 0);

  ctx.fillStyle = activeTheme.eyeWhite;
  ctx.beginPath();
  ctx.arc(leftEyeX, leftEyeY, tileSize * 0.09, 0, Math.PI * 2);
  ctx.arc(rightEyeX, rightEyeY, tileSize * 0.09, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = activeTheme.eyePupil;
  ctx.beginPath();
  ctx.arc(leftEyeX, leftEyeY, tileSize * 0.05, 0, Math.PI * 2);
  ctx.arc(rightEyeX, rightEyeY, tileSize * 0.05, 0, Math.PI * 2);
  ctx.fill();

  const tongueStartX = centerX + direction.x * tileSize * 0.34;
  const tongueStartY = centerY + direction.y * tileSize * 0.34;
  const tongueTipX = centerX + direction.x * tileSize * 0.55;
  const tongueTipY = centerY + direction.y * tileSize * 0.55;

  ctx.strokeStyle = activeTheme.tongue;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(tongueStartX, tongueStartY);
  ctx.lineTo(tongueTipX, tongueTipY);
  ctx.stroke();

  if (direction.x !== 0 || direction.y !== 0) {
    const forkSpread = tileSize * 0.07;
    ctx.beginPath();
    if (direction.x !== 0) {
      ctx.moveTo(tongueTipX, tongueTipY);
      ctx.lineTo(tongueTipX, tongueTipY - forkSpread);
      ctx.moveTo(tongueTipX, tongueTipY);
      ctx.lineTo(tongueTipX, tongueTipY + forkSpread);
    } else {
      ctx.moveTo(tongueTipX, tongueTipY);
      ctx.lineTo(tongueTipX - forkSpread, tongueTipY);
      ctx.moveTo(tongueTipX, tongueTipY);
      ctx.lineTo(tongueTipX + forkSpread, tongueTipY);
    }
    ctx.stroke();
  }
}

function drawPause() {
  if (!paused) {
    return;
  }

  ctx.fillStyle = activeTheme.pauseOverlay;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = activeTheme.pauseText;
  ctx.font = "bold 32px Trebuchet MS";
  ctx.textAlign = "center";
  ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2 + 10);
}

function drawFrame() {
  drawGrid();
  drawArenaObstacles();
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

function beginGameIfNeeded() {
  if (hasStarted) {
    return;
  }

  hasStarted = true;
  playSound("start");
  statusMessage.textContent = "Collect the food and avoid yourself.";
  startLoop();
}

function togglePause() {
  if (!hasStarted || !gameInterval) {
    return;
  }

  paused = !paused;
  playSound(paused ? "pause" : "resume");
  statusMessage.textContent = paused ? "Paused." : "Back in the game!";
  drawFrame();
}

function handleDirectionInput(newDirection) {
  if (!newDirection) {
    return;
  }

  setDirection(newDirection);
  beginGameIfNeeded();
}

window.addEventListener("keydown", (event) => {
  if (inputMode !== INPUT_MODE.KEYBOARD) {
    return;
  }

  if (event.code === "Space") {
    event.preventDefault();
    togglePause();
    return;
  }

  const newDirection = directionMap[event.key];
  if (!newDirection) {
    return;
  }

  event.preventDefault();
  handleDirectionInput(newDirection);
});

touchControls?.querySelectorAll("[data-direction]").forEach((button) => {
  button.addEventListener("pointerdown", (event) => {
    if (inputMode !== INPUT_MODE.TOUCH) {
      return;
    }

    event.preventDefault();
    const key = button.dataset.direction;
    handleDirectionInput(directionMap[key]);
  });
});

pauseButton?.addEventListener("pointerdown", (event) => {
  if (inputMode !== INPUT_MODE.TOUCH) {
    return;
  }

  event.preventDefault();
  togglePause();
});

let touchStartX = 0;
let touchStartY = 0;
const swipeThreshold = 24;

canvas.addEventListener("touchstart", (event) => {
  if (inputMode !== INPUT_MODE.TOUCH) {
    return;
  }

  const [touch] = event.changedTouches;
  if (!touch) {
    return;
  }

  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
}, { passive: true });

canvas.addEventListener("touchend", (event) => {
  if (inputMode !== INPUT_MODE.TOUCH) {
    return;
  }

  const [touch] = event.changedTouches;
  if (!touch) {
    return;
  }

  const deltaX = touch.clientX - touchStartX;
  const deltaY = touch.clientY - touchStartY;

  if (Math.abs(deltaX) < swipeThreshold && Math.abs(deltaY) < swipeThreshold) {
    return;
  }

  event.preventDefault();

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    handleDirectionInput(deltaX > 0 ? directionMap.ArrowRight : directionMap.ArrowLeft);
  } else {
    handleDirectionInput(deltaY > 0 ? directionMap.ArrowDown : directionMap.ArrowUp);
  }
}, { passive: false });

speedSelect?.addEventListener("change", () => {
  const selectedLabel = speedSelect.options[speedSelect.selectedIndex].text;
  const startHint = inputMode === INPUT_MODE.TOUCH
    ? "Tap the on-screen arrows to begin."
    : "Press an arrow key to begin.";

  if (!hasStarted || !gameInterval) {
    statusMessage.textContent = `Speed set to ${selectedLabel}. ${startHint}`;
    return;
  }

  refreshLoopSpeed();
  statusMessage.textContent = `Speed set to ${selectedLabel}.`;
});

levelSelect?.addEventListener("change", () => {
  const selectedLabel = levelSelect.options[levelSelect.selectedIndex].text;
  const startHint = inputMode === INPUT_MODE.TOUCH
    ? "Tap the on-screen arrows to begin."
    : "Press an arrow key to begin.";

  if (!hasStarted || !gameInterval) {
    statusMessage.textContent = `Level set to ${selectedLabel}. ${startHint}`;
    return;
  }

  statusMessage.textContent = `Level set to ${selectedLabel}.`;
});

arenaSelect?.addEventListener("change", () => {
  const selectedLabel = arenaSelect.options[arenaSelect.selectedIndex].text;
  statusMessage.textContent = `Arena set to ${selectedLabel}.`;
  reset();
});

themeSelect?.addEventListener("change", () => {
  activeTheme = getTheme();
  const selectedLabel = themeSelect.options[themeSelect.selectedIndex].text;
  const startHint = inputMode === INPUT_MODE.TOUCH
    ? "Tap the on-screen arrows to begin."
    : "Press an arrow key to begin.";

  if (!hasStarted || !gameInterval) {
    statusMessage.textContent = `Theme set to ${selectedLabel}. ${startHint}`;
  } else {
    statusMessage.textContent = `Theme changed to ${selectedLabel}.`;
  }

  drawFrame();
});

restartButton.addEventListener("click", () => {
  playSound("start");
  reset();
});

if (speedSelect) {
  speedSelect.value = defaultSpeed;
}

if (levelSelect) {
  levelSelect.value = defaultLevel;
}

if (themeSelect) {
  themeSelect.value = defaultTheme;
}

if (arenaSelect) {
  arenaSelect.value = defaultArena;
}

activeTheme = getTheme();
updateTouchControlVisibility();

reset();
