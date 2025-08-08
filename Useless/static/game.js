const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const cellSize = 60;
const rows = 10;
const cols = 10;
const fadeSpeed = 5;
const gameDuration = 60;
let timeLeft = gameDuration;

let level = 0;
let score = 0;

let levels = [
  // Level 1 - Easy
  {
    maze: [
      [1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,1,0,0,0,1],
      [1,0,1,1,0,1,0,1,0,1],
      [1,0,1,0,0,0,0,1,0,1],
      [1,0,1,0,1,1,0,1,0,1],
      [1,0,1,0,0,0,0,0,0,1],
      [1,0,1,1,1,1,1,1,0,1],
      [1,0,0,0,0,0,0,1,0,1],
      [1,1,1,1,1,1,0,1,0,1],
      [1,1,1,1,1,1,1,1,1,1],
    ],
    start: { x: 1, y: 1 },
    exit: { x: 8, y: 8 }
  },

  // Level 2 - Medium Easy
  {
    maze: [
      [1,1,1,1,1,1,1,1,1,1],
      [1,0,1,0,0,0,0,0,0,1],
      [1,0,1,0,1,1,1,1,0,1],
      [1,0,0,0,1,0,0,1,0,1],
      [1,1,1,0,1,0,1,1,0,1],
      [1,0,0,0,1,0,0,0,0,1],
      [1,0,1,1,1,1,1,1,0,1],
      [1,0,0,0,0,0,0,1,0,1],
      [1,1,1,1,1,1,0,1,0,1],
      [1,1,1,1,1,1,1,1,1,1],
    ],
    start: { x: 1, y: 1 },
    exit: { x: 8, y: 6 }
  },

  // Level 3 - Medium
  {
    maze: [
      [1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,1,0,0,0,0,1],
      [1,0,1,0,1,0,1,1,0,1],
      [1,0,1,0,1,0,1,0,0,1],
      [1,0,1,0,1,0,1,0,1,1],
      [1,0,1,0,0,0,1,0,0,1],
      [1,0,1,1,1,1,1,1,0,1],
      [1,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,0,1],
      [1,1,1,1,1,1,1,1,1,1],
    ],
    start: { x: 1, y: 1 },
    exit: { x: 8, y: 7 }
  },

  // Level 4 - Hard
  {
    maze: [
  [1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,1,0,0,1,0,1],
  [1,0,1,0,1,0,1,1,0,1],
  [1,0,1,0,1,0,1,0,0,1],
  [1,0,1,0,1,0,1,0,1,1],
  [1,0,1,0,0,0,0,0,0,1],  // ← fixed row
  [1,0,1,1,1,1,1,1,0,1],
  [1,0,0,0,0,0,1,1,0,1],
  [1,1,1,1,1,1,0,1,0,1],
  [1,1,1,1,1,1,1,1,1,1],
],
start: { x: 1, y: 1 },
exit: { x: 8, y: 7 }
  },

  // Level 5 - Very Hard
  {
    maze: [
      [1,1,1,1,1,1,1,1,1,1],
      [1,0,1,0,0,0,0,1,0,1],
      [1,0,1,0,1,1,0,1,0,1],
      [1,0,1,0,1,0,0,1,0,1],
      [1,0,1,0,1,0,1,1,0,1],
      [1,0,0,0,1,0,0,0,0,1],
      [1,1,1,0,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,1,1,1,1,0,1],
      [1,1,1,1,1,1,1,1,1,1],
    ],
    start: { x: 1, y: 1 },
    exit: { x: 8, y: 7 }
  }
];

let currentLevel = levels[level];
let player = { ...currentLevel.start };
let exit = currentLevel.exit;
let maze = currentLevel.maze;

let wallVisibility = Array.from({ length: rows }, () => Array(cols).fill(0));

let gameOver = false;
let win = false;
let allCleared = false;

// Timer
setInterval(() => {
  if (!gameOver && !allCleared) {
    timeLeft--;
    document.getElementById("timer").innerText = `Time Left: ${timeLeft}`;
    if (timeLeft <= 0) {
      gameOver = true;
      document.getElementById("restartBtn").style.display = "inline-block";
    }
  }
}, 1000);

document.addEventListener("keydown", (e) => {
  if (gameOver || allCleared) return;

  let dx = 0, dy = 0;
  if (e.key === "ArrowUp") dy = -1;
  if (e.key === "ArrowDown") dy = 1;
  if (e.key === "ArrowLeft") dx = -1;
  if (e.key === "ArrowRight") dx = 1;

  let newX = player.x + dx;
  let newY = player.y + dy;

  if (
    newX >= 0 && newX < cols &&
    newY >= 0 && newY < rows &&
    maze[newY][newX] === 0
  ) {
    player.x = newX;
    player.y = newY;
  }

  if (player.x === exit.x && player.y === exit.y) {
    nextLevel();
  }

  if (e.key === " ") {
    // Echo pulse
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (maze[r][c] === 1) wallVisibility[r][c] = 255;
      }
    }
  }
});

function nextLevel() {
  // Score calculation
  score += 100;
  score += timeLeft;

  level++;
  if (level >= levels.length) {
    allCleared = true;
    document.getElementById("restartBtn").style.display = "inline-block";
    return;
  }

  currentLevel = levels[level];
  maze = currentLevel.maze;
  player = { ...currentLevel.start };
  exit = currentLevel.exit;
  wallVisibility = Array.from({ length: rows }, () => Array(cols).fill(0));
  timeLeft = gameDuration;

  // Update UI
  document.getElementById("levelInfo").innerText = `Level: ${level + 1}`;
  document.getElementById("score").innerText = `Score: ${score}`;
}

function restartGame() {
  level = 0;
  score = 0;

  currentLevel = levels[level];
  maze = currentLevel.maze;
  player = { ...currentLevel.start };
  exit = currentLevel.exit;
  wallVisibility = Array.from({ length: rows }, () => Array(cols).fill(0));
  timeLeft = gameDuration;
  gameOver = false;
  allCleared = false;

  document.getElementById("levelInfo").innerText = `Level: ${level + 1}`;
  document.getElementById("score").innerText = `Score: ${score}`;
  document.getElementById("restartBtn").style.display = "none";
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let x = c * cellSize;
      let y = r * cellSize;

      if (maze[r][c] === 1 && wallVisibility[r][c] > 0) {
        ctx.fillStyle = `rgba(100,100,100,${wallVisibility[r][c]/255})`;
        ctx.fillRect(x, y, cellSize, cellSize);
        wallVisibility[r][c] -= fadeSpeed;
        wallVisibility[r][c] = Math.max(0, wallVisibility[r][c]);
      }
    }
  }

  // Exit
  ctx.fillStyle = "#007bff";
  ctx.fillRect(exit.x * cellSize, exit.y * cellSize, cellSize, cellSize);

  // Player
  ctx.fillStyle = "lime";
  ctx.fillRect(player.x * cellSize, player.y * cellSize, cellSize, cellSize);

  // End screen
  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "36px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Time's Up! Game Over", canvas.width / 2, canvas.height / 2);
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 40);
    document.getElementById("restartBtn").style.display = "inline-block";
  } else if (allCleared) {
    ctx.fillStyle = "white";
    ctx.font = "36px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🎉 You Escaped All Levels!", canvas.width / 2, canvas.height / 2);
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 40);
    document.getElementById("restartBtn").style.display = "inline-block";
  }

  requestAnimationFrame(draw);
}

draw();
