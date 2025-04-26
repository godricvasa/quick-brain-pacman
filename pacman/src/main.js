// Get canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Grid settings
const rows = 7;
const cols = 7;
const cellSize = 100;

// Ensure canvas is sized correctly
const uiHeight = 100; // space for hearts, timer, question
canvas.width = cols * cellSize;
canvas.height = rows * cellSize + uiHeight;

// Game state
let gameState = {
  hearts: 5,
  score: 0,
  timer: 6,
  timerInterval: null,
  currentQuestion: null,
  answerCells: [],
  gameOver: false,
};

// Player (Pacman) settings
let player = {
  row: 3,
  col: 3,
  color: "yellow",
};

// Draw the grid
function drawGrid() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      ctx.strokeStyle = "#555";
      ctx.strokeRect(
        c * cellSize,
        uiHeight + r * cellSize, // Shift grid down by uiHeight
        cellSize,
        cellSize
      );
    }
  }

  // Draw rightmost vertical border
  ctx.strokeStyle = "#555";
  ctx.beginPath();
  ctx.moveTo(cols * cellSize, uiHeight);
  ctx.lineTo(cols * cellSize, uiHeight + rows * cellSize);
  ctx.stroke();

  // Draw bottommost horizontal border
  ctx.beginPath();
  ctx.moveTo(0, uiHeight + rows * cellSize);
  ctx.lineTo(cols * cellSize, uiHeight + rows * cellSize);
  ctx.stroke();
}

// Draw the player
function drawPlayer() {
  const centerX = player.col * cellSize + cellSize / 2;
  const centerY = uiHeight + player.row * cellSize + cellSize / 2;

  const radius = cellSize / 3;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = player.color;
  ctx.fill();
}

// Draw the UI (hearts, score, timer)
function drawUI() {
  // Draw hearts
  for (let i = 0; i < 5; i++) {
    const heartX = 20 + i * 30;
    const heartY = 20;
    const size = 20;

    if (i < gameState.hearts) {
      // Filled heart
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.moveTo(heartX, heartY + size / 4);
      ctx.bezierCurveTo(
        heartX,
        heartY,
        heartX - size / 2,
        heartY,
        heartX - size / 2,
        heartY + size / 4
      );
      ctx.bezierCurveTo(
        heartX - size / 2,
        heartY + size / 2,
        heartX,
        heartY + (size * 3) / 4,
        heartX,
        heartY + size
      );
      ctx.bezierCurveTo(
        heartX,
        heartY + (size * 3) / 4,
        heartX + size / 2,
        heartY + size / 2,
        heartX + size / 2,
        heartY + size / 4
      );
      ctx.bezierCurveTo(
        heartX + size / 2,
        heartY,
        heartX,
        heartY,
        heartX,
        heartY + size / 4
      );
      ctx.fill();
    } else {
      // Empty heart
      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.moveTo(heartX, heartY + size / 4);
      ctx.bezierCurveTo(
        heartX,
        heartY,
        heartX - size / 2,
        heartY,
        heartX - size / 2,
        heartY + size / 4
      );
      ctx.bezierCurveTo(
        heartX - size / 2,
        heartY + size / 2,
        heartX,
        heartY + (size * 3) / 4,
        heartX,
        heartY + size
      );
      ctx.bezierCurveTo(
        heartX,
        heartY + (size * 3) / 4,
        heartX + size / 2,
        heartY + size / 2,
        heartX + size / 2,
        heartY + size / 4
      );
      ctx.bezierCurveTo(
        heartX + size / 2,
        heartY,
        heartX,
        heartY,
        heartX,
        heartY + size / 4
      );
      ctx.stroke();
    }
  }

  // Draw score
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.textAlign = "right";
  ctx.fillText(`Score: ${gameState.score}`, canvas.width - 20, 30);

  // Draw timer
  if (gameState.timerInterval) {
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(`Time: ${gameState.timer}s`, canvas.width / 2, 30);
  }

  // Draw question
  if (gameState.currentQuestion) {
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "24px Arial";
    ctx.fillText(gameState.currentQuestion.question, canvas.width / 2, 60);
  }
}

// Draw the answer options on the grid
function drawAnswers() {
  if (!gameState.answerCells.length) return;

  for (const answerCell of gameState.answerCells) {
    const centerX = answerCell.col * cellSize + cellSize / 2;
    // const centerY = answerCell.row * cellSize + cellSize / 2;

    // Draw answer background
    ctx.fillStyle = "rgba(0, 100, 200, 0.3)";
    const centerY = uiHeight + answerCell.row * cellSize + cellSize / 2;
    ctx.fillRect(
      answerCell.col * cellSize,
      uiHeight + answerCell.row * cellSize,
      cellSize,
      cellSize
    );

    // Draw answer text
    ctx.fillStyle = "white";
    ctx.font = "bold 28px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(answerCell.value, centerX, centerY);
  }
}

// Clear and redraw
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawAnswers();
  drawPlayer();
  drawUI();

  // Game over screen
  if (gameState.gameOver) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2 - 40);
    ctx.font = "30px Arial";
    ctx.fillText(
      `Your Score: ${gameState.score}`,
      canvas.width / 2,
      canvas.height / 2 + 20
    );

    ctx.fillStyle = "#4CAF50";
    ctx.fillRect(canvas.width / 2 - 100, canvas.height / 2 + 80, 200, 50);
    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText("Play Again", canvas.width / 2, canvas.height / 2 + 105);
  }
}

// Get random coordinates avoiding player position and existing answers
function getRandomAvailableCell() {
  let availableCells = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Skip the player's position and adjacent cells
      if (Math.abs(r - player.row) <= 1 && Math.abs(c - player.col) <= 1) {
        continue;
      }

      // Check if this cell is already occupied by an answer
      const isOccupied = gameState.answerCells.some(
        (cell) => cell.row === r && cell.col === c
      );

      if (!isOccupied) {
        availableCells.push({ row: r, col: c });
      }
    }
  }

  // If there are available cells, pick one randomly
  if (availableCells.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableCells.length);
    return availableCells[randomIndex];
  }

  return null;
}

// Place answer options on the grid
function placeAnswerOptions() {
  if (!gameState.currentQuestion) return;

  gameState.answerCells = [];

  // Shuffle the options
  const options = [...gameState.currentQuestion.options];
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  // Place each option in a random cell
  for (const option of options) {
    const cell = getRandomAvailableCell();
    if (cell) {
      gameState.answerCells.push({
        ...cell,
        value: option,
        isCorrect: option === gameState.currentQuestion.correct_answer,
      });
    }
  }
}

// Start the timer
function startTimer() {
  // Clear any existing timer
  if (gameState.timerInterval) {
    clearInterval(gameState.timerInterval);
  }

  gameState.timer = 6;

  gameState.timerInterval = setInterval(() => {
    gameState.timer--;

    if (gameState.timer <= 0) {
      // Time's up!
      clearInterval(gameState.timerInterval);
      gameState.timerInterval = null;

      // Player loses a heart
      gameState.hearts--;

      if (gameState.hearts <= 0) {
        endGame();
      } else {
        // Start a new round
        setTimeout(fetchNewQuestion, 1000);
      }
    }

    draw();
  }, 1000);
}

// Check if player is on a cell with an answer
function checkAnswer() {
  const answerCell = gameState.answerCells.find(
    (cell) => cell.row === player.row && cell.col === player.col
  );

  if (answerCell) {
    // Stop the timer
    clearInterval(gameState.timerInterval);
    gameState.timerInterval = null;

    if (answerCell.isCorrect) {
      // Correct answer
      gameState.score += 10;

      // Visual feedback
      flashMessage("Correct!", "green");

      // Get next question
      setTimeout(fetchNewQuestion, 1000);
    } else {
      // Wrong answer
      gameState.hearts--;

      // Visual feedback
      flashMessage("Wrong!", "red");

      if (gameState.hearts <= 0) {
        endGame();
      } else {
        // Get next question
        setTimeout(fetchNewQuestion, 1000);
      }
    }
  }
}

// Show a flash message
function flashMessage(message, color) {
  const messageX = canvas.width / 2;
  const messageY = canvas.height / 2;

  // Draw the message with animation
  let opacity = 1;
  const interval = setInterval(() => {
    // Redraw the game
    draw();

    // Draw the message
    ctx.fillStyle = `rgba(0, 0, 0, ${opacity * 0.7})`;
    ctx.fillRect(messageX - 150, messageY - 40, 300, 80);

    ctx.fillStyle = color;
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(message, messageX, messageY);

    opacity -= 0.05;
    if (opacity <= 0) {
      clearInterval(interval);
      draw();
    }
  }, 50);
}

// End the game
function endGame() {
  gameState.gameOver = true;
  clearInterval(gameState.timerInterval);
  gameState.timerInterval = null;
  draw();
}

// Reset the game
function resetGame() {
  gameState = {
    hearts: 5,
    score: 0,
    timer: 6,
    timerInterval: null,
    currentQuestion: null,
    answerCells: [],
    gameOver: false,
  };

  player = {
    row: 3,
    col: 3,
    color: "yellow",
  };

  fetchNewQuestion();
}

// Fetch a new question from the backend
async function fetchNewQuestion() {
  try {
    const response = await fetch(
      "http://localhost:8000/question?difficulty=easy"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch question");
    }

    const data = await response.json();
    gameState.currentQuestion = data;

    // Reset player to center
    player.row = 3;
    player.col = 3;

    // Place answer options
    placeAnswerOptions();

    // Start the timer
    startTimer();

    // Redraw the game
    draw();
  } catch (error) {
    console.error("Error fetching question:", error);
    // Fallback to a default question if API fails
    gameState.currentQuestion = {
      question: "5 + 3 = ?",
      correct_answer: "8",
      options: ["8", "7", "9", "6"],
    };

    // Place answer options
    placeAnswerOptions();

    // Start the timer
    startTimer();

    // Redraw the game
    draw();
  }
}

// Move player with keyboard
document.addEventListener("keydown", (e) => {
  if (gameState.gameOver) return;

  let moved = false;

  if (e.key === "ArrowUp" && player.row > 0) {
    player.row--;
    moved = true;
  }
  if (e.key === "ArrowDown" && player.row < rows - 1) {
    player.row++;
    moved = true;
  }
  if (e.key === "ArrowLeft" && player.col > 0) {
    player.col--;
    moved = true;
  }
  if (e.key === "ArrowRight" && player.col < cols - 1) {
    player.col++;
    moved = true;
  }

  if (moved) {
    checkAnswer();
    draw();
  }
});

// Handle click for Play Again button
canvas.addEventListener("click", (e) => {
  if (!gameState.gameOver) return;

  const rect = canvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  // Check if Play Again button was clicked
  if (
    clickX >= canvas.width / 2 - 100 &&
    clickX <= canvas.width / 2 + 100 &&
    clickY >= canvas.height / 2 + 80 &&
    clickY <= canvas.height / 2 + 130
  ) {
    resetGame();
  }
});

// // Initial setup
resetGame();
