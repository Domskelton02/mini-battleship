const readlineSync = require('readline-sync');

function printWelcomeMessage() {
    console.log("Welcome to Mini Battleship!");
    console.log("Press any key to start the game.");
}

let gridSize = 10;
let shipSizes = [2, 3, 3, 4, 5];

function createGameBoard(size) {
    const board = [];
    for (let row = 0; row < size; row++) {
        board[row] = new Array(size).fill(null);
    }
    return board;
}

function getRandomPosition(gridSize, shipSize, isHorizontal) {
    let row, col;
    if (isHorizontal) {
        row = Math.floor(Math.random() * gridSize);
        col = Math.floor(Math.random() * (gridSize - shipSize));
    } else {
        row = Math.floor(Math.random() * (gridSize - shipSize));
        col = Math.floor(Math.random() * gridSize);
    }
    return { row, col };
}

function canPlaceShip(board, startRow, startCol, size, isHorizontal) {
    for (let i = 0; i < size; i++) {
        let row = startRow + (isHorizontal ? 0 : i);
        let col = startCol + (isHorizontal ? i : 0);

        if (board[row][col] === 'S' || row >= gridSize || col >= gridSize) {
            return false;
        }
    }
    return true;
}

function placeShips(board, shipSizes) {
    shipSizes.forEach(size => {
        let placed = false;
        while (!placed) {
            let isHorizontal = Math.random() < 0.5;
            let position = getRandomPosition(gridSize, size, isHorizontal);

            if (canPlaceShip(board, position.row, position.col, size, isHorizontal)) {
                for (let i = 0; i < size; i++) {
                    let row = position.row + (isHorizontal ? 0 : i);
                    let col = position.col + (isHorizontal ? i : 0);
                    board[row][col] = 'S';
                }
                placed = true;
            }
        }
    });
}

function getUserGuess() {
    let guess = readlineSync.question("Enter a location to strike ie 'A2': ");
    return guess.toUpperCase();
}

function updateBoard(board, guess) {
    let rowChar = guess.charCodeAt(0) - 'A'.charCodeAt(0);
    let col = parseInt(guess.slice(1)) - 1;

    if (rowChar >= 0 && rowChar < gridSize && col >= 0 && col < gridSize) {
        if (board[rowChar][col] === 'X' || board[rowChar][col] === '~') {
            console.log("You already guessed this location!");
        } else if (board[rowChar][col] === 'S') {
            board[rowChar][col] = 'X';
            console.log("Hit. You have sunk a part of a battleship.");
        } else {
            board[rowChar][col] = '~';
            console.log('Miss!');
        }
    } else {
        console.log("Invalid guess, please try again.");
    }
}

function checkGameOver(board) {
    return board.every(row => row.every(cell => cell !== 'S'));
}

function gameLoop(board) {
    let guess = getUserGuess();
    updateBoard(board, guess);
    if (checkGameOver(board)) {
        console.log('You have destroyed all of the battleships, would you like to play again? (Y/N): ');
        let playAgain = readlineSync.question();
        if (playAgain.toUpperCase() === 'Y') {
            board = createGameBoard(gridSize);
            placeShips(board, shipSizes);
            gameLoop(board);
        } else {
            console.log('Thank you for playing!');
            process.exit();
        }
    } else {
        gameLoop(board);
    }
}

printWelcomeMessage();
readlineSync.question();
let gameBoard = createGameBoard(gridSize);
placeShips(gameBoard, shipSizes);
gameLoop(gameBoard);
