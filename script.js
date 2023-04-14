function GameBoard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }
  const getBoard = () => board;

  const markSpace = (row, column, playerValue) => {
    //check if that space is already occupied or not
    if (board[row][column].getValue() !== "") {
    } else {
      board[row][column].mark(playerValue);
    }
  };
  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCellValues);
  };
  return { getBoard, markSpace, printBoard };
}

function Cell() {
  let value = "";
  const mark = (symbol) => {
    value = symbol;
  };
  const getValue = () => value;
  return { mark, getValue };
}

function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const gameBoard = GameBoard();
  const players = [
    {
      name: playerOneName,
      symbol: "X",
    },
    {
      name: playerTwoName,
      symbol: "O",
    },
  ];
  let activePlayer = players[0];
  const switchPlayerTurn = () => {
    activePlayer = activePlayer == players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;
  const printNewRound = () => {
    gameBoard.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };
  const playRound = (row, column) => {
    if (gameBoard.getBoard()[row][column].getValue() !== "") {
      alert("Space already occupied!");
      return;
    }
    gameBoard.markSpace(row, column, getActivePlayer().symbol);
    if (checkForWinner()) {
      alert(`The winner is ${activePlayer.name}!`);
      console.log(`The winner is ${activePlayer.name}!`);
      resetGame();
    }
    switchPlayerTurn();
    printNewRound();
  };
  const checkForWinner = () => {
    const board = gameBoard.getBoard();
    let winnerFound = false;
    //check row
    for (let i = 0; i < board.length; i++) {
      const row = board[i];
      if (row.every((cell) => cell.getValue() == activePlayer.symbol)) {
        winnerFound = true;
        break;
      }
    }
    //check column
    for (let i = 0; i < board.length; i++) {
      const column = board.map((row) => row[i]);
      if (column.every((cell) => cell.getValue() === activePlayer.symbol)) {
        winnerFound = true;
        break;
      }
    }
    //check diagonal top-left to bottom-right
    for (let i = 0; i < board.length; i++) {
      const diagonal1 = board.map((row, index) => row[index]);
      if (diagonal1.every((cell) => cell.getValue() === activePlayer.symbol)) {
        winnerFound = true;
        break;
      }
    }
    //check diagonal top-right to bottom-left
    for (let i = 0; i < board.length; i++) {
      const diagonal1 = board.map(
        (row, index) => row[board.length - index - 1]
      );
      if (diagonal1.every((cell) => cell.getValue() === activePlayer.symbol)) {
        winnerFound = true;
      }
    }
    return winnerFound;
  };
  const resetGame = () => {
    gameBoard.getBoard().forEach((row) => {
      row.forEach((cell) => {
        cell.mark("");
      });
    });
    activePlayer = players[0];
    ScreenController().updateScreen();
    printNewRound();
  };
  printNewRound();

  return {
    playRound,
    getActivePlayer,
    getBoard: gameBoard.getBoard,
  };
}
function ScreenController() {
  const game = GameController();
  const playerTurnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");

  const updateScreen = () => {
    //clear the board
    boardDiv.textContent = "";

    // get the newest version of the board and player turn
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    // Display player's turn
    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

    //Render board squares
    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = columnIndex;
        cellButton.textContent = cell.getValue();
        boardDiv.appendChild(cellButton);
      });
    });
  };
  // Add event listener for the board
  function clickHandlerBoard(e) {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;
    if (!selectedColumn || !selectedRow) return;

    game.playRound(selectedRow, selectedColumn);
    updateScreen();
  }
  boardDiv.addEventListener("click", clickHandlerBoard);
  // Initial render
  updateScreen();
  return { updateScreen };
}
ScreenController();
