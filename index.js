import JSConfetti from "js-confetti";

// The application container.
const applicationContainer = document.querySelector("#app");

// All the possible winning scenarios in the board.
const GAME_SCENARIOS = {
  HORIZONTAL: [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
  ],
  VERTICAL: [
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
  ],
  DIAGONAL: [
    [0, 4, 8],
    [2, 4, 6],
  ],
};

// checkVictoryConditions loops through all the possible winning scenarios and checks if either 'X' or 'O' has won.
const checkVictoryConditions = (scenarios) => {
  let hasWon = false;

  scenarios.forEach((scenario) => {
    if (hasWon) return;

    const blocks = scenario.map(
      (coordinate) =>
        document.querySelector(`[${COORDINATE_ATR}="${coordinate}"]`)
          .textContent
    );

    hasWon =
      blocks.every((block) => block === PLAYERS.X) ||
      blocks.every((block) => block === PLAYERS.O);
  });

  return hasWon;
};

// Creating a custom event that is triggered on every player event to check the winning conditions.
const onMovePlayedEvent = new CustomEvent("onMovedPlayed");

// onMovedPlayed we need to check the board for victory conditions.
const checkBoard = () => {
  const hasWon = [
    checkVictoryConditions(GAME_SCENARIOS.HORIZONTAL),
    checkVictoryConditions(GAME_SCENARIOS.VERTICAL),
    checkVictoryConditions(GAME_SCENARIOS.DIAGONAL),
  ].some((condition) => condition);

  if (!hasWon) return;

  document.dispatchEvent(onPlayerVictory);
};

// Append the onMovedPlayed event to the document.
document.addEventListener("onMovedPlayed", checkBoard);

// Creating a custom event that is triggered player victory.
const onPlayerVictory = new CustomEvent("onPlayerVictory");

// onVictory we trigger some animations.
const onVictory = () => {
  new JSConfetti().addConfetti({
    emojis: ["🌈", "⚡️", "💥", "✨", "💫", "🌸"],
  });

  applicationContainer.replaceChildren();
  applicationContainer.classList.add("flex-container");

  const playerWonMessage = document.createElement("p");
  const playedLast = isXTurn ? PLAYERS.O : PLAYERS.X;
  const victoryMessage = `Player ${playedLast}  has won`;
  playerWonMessage.textContent = victoryMessage;

  const resetGameBoardBtn = document.createElement("button");
  resetGameBoardBtn.textContent = "Restart";

  resetGameBoardBtn.addEventListener("click", () => {
    applicationContainer.classList.remove("flex-container");
    applicationContainer.replaceChildren();
    draw3x3GameBoard();
  });

  applicationContainer.append(playerWonMessage, resetGameBoardBtn);
};

// Append the Victory event to the document.
document.addEventListener("onPlayerVictory", onVictory);

// Global variable dictating whether it's 'X' or 'O' turn.
let isXTurn = true;

// Map of the possible answers.
const PLAYERS = {
  X: "X",
  O: "O",
};

// Appending a custom data-atribute to each block in order to know the currently clicked coordinate.
const COORDINATE_ATR = "data-coordinate";

// The individual tic-tac toe game board block.
const ticTacToeBlockCreator = (indexNumber) => {
  const block = document.createElement("div");
  block.setAttribute(COORDINATE_ATR, indexNumber);

  const blockBehavior = () => {
    // This means that the player has already played.
    if (block.textContent) return;
    block.textContent = isXTurn ? PLAYERS.X : PLAYERS.O;
    isXTurn = !isXTurn;
  };

  block.addEventListener("click", () => {
    blockBehavior();
    // Each block will trigger the parent event that checks the winning conditions.
    document.dispatchEvent(onMovePlayedEvent);
  });

  return block;
};

// Draws the board to the screen.
const draw3x3GameBoard = () => {
  for (let index = 0; index < 9; index++) {
    applicationContainer.appendChild(ticTacToeBlockCreator(index));
  }
};

draw3x3GameBoard();
