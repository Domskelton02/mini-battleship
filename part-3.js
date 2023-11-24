const readlineSync = require('readline-sync');

function printWelcomeMessage() {
    console.log("Welcome to Mini Battleship!");
    console.log("Press any key to start the game.");
}

function createGameBoard(size) {
    const board = [];
    for (let row = 0; row < size; row++) {
        board[row] = new Array(size).fill('.');
    }
    return board;
}

function printGameBoard(board) {
    const columnLabels = [' ', ...Array.from({ length: board.length }, (_, i) => i + 1)].join(' ');
    console.log(columnLabels);
    
    board.forEach((row, rowIndex) => {
        const rowLabel = String.fromCharCode('A'.charCodeAt(0) + rowIndex);
        const rowString = row.map(cell => {
            if (cell === 'S') {
                return '.';
            } else if (cell === 'X') {
                return 'X';
            } else if (cell === 'O') {
                return 'O';
            } else {
                return '.';
            }
        }).join(' ');
        console.log(`${rowLabel} ${rowString}`);
    });
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

        if (row >= board.length || col >= board[0].length || board[row][col] !== '.') {
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
            let position = getRandomPosition(board.length, size, isHorizontal);

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
    return readlineSync.question("Enter a location to strike ie 'A2': ").toUpperCase();
}

function updateBoard(board, guess) {
    let row = guess.charCodeAt(0) - 'A'.charCodeAt(0);
    let col = parseInt(guess.slice(1)) - 1;

    if (board[row][col] === 'S') {
        board[row][col] = 'X';
        console.log("Hit. You have sunk a part of a battleship.");
    } else if (board[row][col] === '.') {
        board[row][col] = 'O';
        console.log('Miss!');
    } else {
        console.log("You already guessed this location!");
    }
}

function checkGameOver(board) {
    return board.every(row => row.every(cell => cell !== 'S'));
}

function gameLoop(board) {
    while (true) {
        printGameBoard(board);
        let guess = getUserGuess();
        updateBoard(board, guess);

        if (checkGameOver(board)) {
            console.log("You have destroyed all battleships.");
            let playAgain = readlineSync.question('Would you like to play again? (Y/N): ');
            if (playAgain.toUpperCase() === 'Y') {
                board = createGameBoard(gridSize);
                placeShips(board, shipSizes);
                continue;
            } else {
                console.log('Thank you for playing!');
                break;
            }
        }
    }
}


printWelcomeMessage();
readlineSync.question();
let gridSize = 10;
let shipSizes = [2, 3, 3, 4, 5];
let gameBoard = createGameBoard(gridSize);
placeShips(gameBoard, shipSizes);
gameLoop(gameBoard);
