const readlineSync = require('readline-sync');

function printWelcomeMessage() {
    console.log("Welcome to Mini Battleship!");
    readlineSync.question("Press any key to start the game.");
}

function createGameBoard(size) {
    const board = [];
    for (let row = 0; row < size; row++) {
        board.push(new Array(size).fill('.'));
    }
    return board;
}

function printGameBoard(board, showShips = false) {
    const columnLabels = [' ', ...Array.from({ length: board.length }, (_, i) => String(i + 1))].join(' ');
    console.log(columnLabels);

    board.forEach((row, rowIndex) => {
        const rowString = row.map(cell => cell === 'S' ? (showShips ? 'S' : '.') : cell).join(' ');
        console.log(`${String.fromCharCode('A'.charCodeAt(0) + rowIndex)} ${rowString}`);
    });
}

function getRandomPosition(size) {
    return {
        row: Math.floor(Math.random() * size),
        col: Math.floor(Math.random() * size)
    };
}

function canPlaceShip(board, row, col, size, horizontal) {
    for (let i = 0; i < size; i++) {
        let checkRow = row + (horizontal ? 0 : i);
        let checkCol = col + (horizontal ? i : 0);
        if (checkRow >= size || checkCol >= size || board[checkRow][checkCol] === 'S') {
            return false;
        }
    }
    return true;
}

function placeShips(board, shipSizes) {
    shipSizes.forEach(size => {
        let placed = false;
        while (!placed) {
            let horizontal = Math.random() >= 0.5;
            let position = getRandomPosition(board.length);
            if (canPlaceShip(board, position.row, position.col, size, horizontal)) {
                for (let i = 0; i < size; i++) {
                    board[horizontal ? position.row : position.row + i][horizontal ? position.col + i : position.col] = 'S';
                }
                placed = true;
            }
        }
    });
}

function getUserGuess() {
    return readlineSync.question("Enter a location to strike (e.g., 'A1'): ").toUpperCase();
}

function makeGuess(board, guess) {
    const row = guess.charCodeAt(0) - 'A'.charCodeAt(0);
    const col = parseInt(guess.slice(1)) - 1;
    if (board[row][col] === 'S') {
        board[row][col] = 'X';
        return 'Hit';
    } else if (board[row][col] === 'X' || board[row][col] === 'O') {
        return 'Repeat';
    } else {
        board[row][col] = 'O';
        return 'Miss';
    }
}

function checkGameOver(board) {
    return !board.some(row => row.includes('S'));
}

function computerTurn(board) {
    let guess;
    do {
        guess = getRandomPosition(board.length);
    } while (board[guess.row][guess.col] !== '.');

    const guessStr = `${String.fromCharCode('A'.charCodeAt(0) + guess.row)}${guess.col + 1}`;
    return makeGuess(board, guessStr);
}

function gameLoop(playerBoard, computerBoard) {
    while (true) {
        console.clear();
        console.log("Player's board:");
        printGameBoard(playerBoard, true);
        console.log("Computer's board:");
        printGameBoard(computerBoard);

        const playerGuess = getUserGuess();
        const playerResult = makeGuess(computerBoard, playerGuess);
        console.log(`Player's result: ${playerResult}`);

        if (checkGameOver(computerBoard)) {
            console.log("You have sunk all the computer's battleships!");
            break;
        }

        const computerResult = computerTurn(playerBoard);
        console.log(`Computer's result: ${computerResult}`);

        if (checkGameOver(playerBoard)) {
            console.log("The computer has sunk all your battleships!");
            break;
        }
    }

    const playAgain = readlineSync.question('Would you like to play again? (Y/N): ');
    if (playAgain.toUpperCase() === 'Y') {
        startGame();
    } else {
        console.log('Thank you for playing!');
    }
}

function startGame() {
    printWelcomeMessage();
    const gridSize = 10;
    const shipSizes = [2, 3, 3, 4, 5];
    const playerBoard = createGameBoard(gridSize);
    const computerBoard = createGameBoard(gridSize);
    placeShips(playerBoard, shipSizes);
    placeShips(computerBoard, shipSizes);
    gameLoop(playerBoard, computerBoard);
}

startGame();
