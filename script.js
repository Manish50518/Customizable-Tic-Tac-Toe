window.addEventListener("DOMContentLoaded", () => {
  const playerTurnTxt = document.querySelector(".turn__text");
  const playerScoreTxt = document.querySelector(".player__score");
  const endBtn = document.getElementById("end_game");
  const resetBtn = document.getElementById("reset_game");
  const setGridBtn = document.getElementById("set_grid");
  const setWinStreakBtn = document.getElementById("set_win_streak");
  const gridSizeInput = document.getElementById("grid_size");
  const winStreakInput = document.getElementById("win_streak");
  const boardElement = document.querySelector(".board");
  const modal = document.getElementById("myModal");
  const modalCloseBtn = document.getElementById("close_t");
  const gameDetails = document.getElementById("game_details");

  let gridSize = 3; // default
  let winStreak = 3; // default
  let board = [];
  let playerTurn = "X";
  let playerXScore = 0;
  let playerOScore = 0;
  let isGameActive = true;

  const initializeBoard = () => {
    boardElement.innerHTML = "";
    board = Array(gridSize * gridSize).fill("");
    boardElement.style.gridTemplateColumns = `repeat(${gridSize}, 100px)`;
    boardElement.style.gridTemplateRows = `repeat(${gridSize}, 100px)`;
    playerTurnTxt.classList.remove("winner");
    for (let i = 0; i < gridSize * gridSize; i++) {
      const tile = document.createElement("div");
      tile.classList.add("board__tile");
      tile.addEventListener("click", () => markBoard(tile, i));
      boardElement.appendChild(tile);
    }

    playerTurn = "X";
    updateTurnText();
    isGameActive = true;
  };

  const updateTurnText = () => {
    playerTurnTxt.innerHTML = `Player <span style="color: ${
      playerTurn === "X" ? " #09c6f9" : "#e9902a"
    }">${playerTurn}</span> turn!`;
  };

  const markBoard = (tile, index) => {
    if (isGameActive && tile.innerHTML === "") {
      board[index] = playerTurn;
      tile.innerHTML = playerTurn;
      tile.classList.add(`letter__${playerTurn}`);
      if (checkWin(playerTurn)) {
        handleWin(playerTurn);
      } else if (checkDraw()) {
        alert("It's a draw!");
        initializeBoard();
      } else {
        playerTurn = playerTurn === "X" ? "O" : "X";
        updateTurnText();
      }
    }
  };

  const checkWin = (currentPlayer) => {
    const directions = [
      { x: 1, y: 0 }, // Horizontal
      { x: 0, y: 1 }, // Vertical
      { x: 1, y: 1 }, // Diagonal down-right
      { x: 1, y: -1 }, // Diagonal up-right
    ];
    const isWithinBounds = (x, y) =>
      x >= 0 && y >= 0 && x < gridSize && y < gridSize;
    const getIndex = (x, y) => y * gridSize + x;

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        if (board[getIndex(x, y)] !== currentPlayer) continue;

        for (let { x: dx, y: dy } of directions) {
          let count = 0;
          for (let step = 0; step < winStreak; step++) {
            const nx = x + dx * step;
            const ny = y + dy * step;
            if (
              isWithinBounds(nx, ny) &&
              board[getIndex(nx, ny)] === currentPlayer
            ) {
              count++;
              if (count === winStreak) return true;
            } else break;
          }
        }
      }
    }
    return false;
  };

  const checkDraw = () => board.every((cell) => cell !== "");

  const handleWin = (winner) => {
    isGameActive = false;
    if (winner === "X") playerXScore++;
    else playerOScore++;
    playerScoreTxt.innerHTML = `${playerXScore} - ${playerOScore}`;
    playerTurnTxt.innerHTML = `🎉🎊🥳 Player ${winner} wins! 🥳🎊🎉`;
    playerTurnTxt.classList.add("winner");
  };

  const resetScores = () => {
    playerXScore = 0;
    playerOScore = 0;
    playerScoreTxt.innerHTML = "0-0";

    playerTurnTxt.classList.remove("winner");
    initializeBoard();
  };

  const setGrid = () => {
    const newGridSize = parseInt(gridSizeInput.value);
    const newWinStreak = parseInt(winStreakInput.value);
    if (newGridSize >= 3 && newGridSize <= 10) {
      gridSize = newGridSize;
    } else {
      alert("Grid size must be between 3 and 10!");
      return;
    }

    if (newWinStreak >= 3 && newWinStreak <= gridSize) {
      winStreak = newWinStreak;
    } else {
      alert("Win streak must be between 3 and grid size!");
      return;
    }

    initializeBoard();
  };

  const setWinStreak = () => {
    const newWinStreak = parseInt(winStreakInput.value);
    if (newWinStreak >= 3 && newWinStreak <= gridSize) {
      winStreak = newWinStreak;
      alert(`Win streak set to ${winStreak}`);
    } else {
      alert(`Win streak must be between 3 and ${gridSize}`);
    }
  };

  const resetGame = () => initializeBoard();

  const endGame = () => {
    const winner =
      playerXScore > playerOScore
        ? `Player <span style="color: #09c6f9;">X</span> won 🥳🥳🎊🎉`
        : playerOScore > playerXScore
        ? `Player <span style="color: #e9902a;">O</span> won 🥳🥳🎊🎉`
        : "It's a tie! 😑😑";

    gameDetails.innerHTML = `Game Over! ${winner}`;
    modal.style.display = "block";

    modalCloseBtn.onclick = () => {
      modal.style.display = "none";
      resetScores();
    };

    window.onclick = (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
        resetScores();
      }
    };
  };

  // Event Listeners
  setGridBtn.addEventListener("click", setGrid);
  setWinStreakBtn.addEventListener("click", setWinStreak);
  resetBtn.addEventListener("click", resetGame);
  endBtn.addEventListener("click", endGame);

  initializeBoard();
});
