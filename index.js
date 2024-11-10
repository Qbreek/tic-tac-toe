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
  return scenarios.some((scenario) => {
    const blocks = scenario.map(
      (coordinate) =>
        document.querySelector(`[${COORDINATE_ATR}="${coordinate}"]`)
          .textContent
    );

    return (
      blocks.every((block) => block === ANSWERS.X) ||
      blocks.every((block) => block === ANSWERS.O)
    );
  });
};

// Creating a custom event that is triggered on every player event to check the winning conditions.
const onMovePlayedEvent = new CustomEvent("onMovedPlayed");

// Append the custom event to the document.
document.addEventListener("onMovedPlayed", () => {
  checkVictoryConditions(GAME_SCENARIOS.HORIZONTAL);
  checkVictoryConditions(GAME_SCENARIOS.VERTICAL);
  checkVictoryConditions(GAME_SCENARIOS.DIAGONAL);
});

// Global variable dictating whether it's 'X' or 'O' turn.
let isXTurn = true;

// Map of the possible answers.
const ANSWERS = {
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
    if (block.textContent) return;
    block.textContent = isXTurn ? ANSWERS.X : ANSWERS.O;
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
(function draw3x3GameBoard() {
  for (let index = 0; index < 9; index++) {
    document.querySelector("#app").appendChild(ticTacToeBlockCreator(index));
  }
})();
