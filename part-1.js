const readlineSync = require('readline-sync');

function printWelcomeMessage() {
    console.log("Welcome to Mini Battleship!");
    console.log("Press any key to start the game.");
}

let gridSize = 3;
let gameBoard = createGameBoard(gridSize);
placeShips(gameBoard, gridSize);

printWelcomeMessage();

process.stdin.setRawMode(true);
process.stdin.resume();

function createGameBoard(size) {
    const board = [];
    for (let row = 0; row < size; row++) {
        board[row] = [];
        for (let col = 0; col < size; col++) {
            board[row][col] = null;
        }
    }
    return board;
}

function printGameBoard(board, revealShips = false) {
    const columnLabels = [' ', ...Array.from({ length: board.length }, (_, i) => i + 1)];
    console.log(columnLabels.join(' '));
    
    board.forEach((row, rowIndex) => {
        const rowLabel = String.fromCharCode('A'.charCodeAt(0) + rowIndex);
        console.log(rowLabel + ' ' + row.map(cell => {
            if (cell === null || (cell === 'S' && !revealShips)) {
                return '~';
            }
            return cell;
        }).join(' '));
    });
}

function getRandomPosition(size) {
    return { 
        row: Math.floor(Math.random() * size),
        col: Math.floor(Math.random() * size)
    };
}

function placeShips(board, size) {
    let ship1, ship2;
    do {
        ship1 = getRandomPosition(size);
        ship2 = getRandomPosition(size);
    } while (ship1.row === ship2.row && ship1.col === ship2.col);   
    board[ship1.row][ship1.col] = 'S';
    board[ship2.row][ship2.col] = 'S';
}

function getUserGuess() {
    let userInput = readlineSync.question("Enter a location to strike ie 'A2' ");
    return userInput.toUpperCase();
}

function updateBoard(board, guess, gridSize) {
    let row = guess.charCodeAt(0) - 'A'.charCodeAt(0);
    let col = parseInt(guess[1], 10) - 1;

    if (guess && row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
        if (board[row][col] === 'X') {
            console.log("You already guessed this location!");
        } else if (board[row][col] === null) {
            board[row][col] = '~';
            console.log('Miss!');
        } else {
            board[row][col] = 'X';
            console.log("Hit. You have sunk the battleship.");
        } 
    } else {
        console.log("Invalid guess, please try again.");
    }
}

let gameOver = false;

function checkGameOver(board) {
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            if (board[row][col] === 'S') {
                return false;
            }
        }
    }
    return true;
}

while (!gameOver) {
    printGameBoard(gameBoard);
    let guess = getUserGuess();
    updateBoard(gameBoard, guess, gridSize);
    gameOver = checkGameOver(gameBoard);

    if (gameOver) {
        printGameBoard(gameBoard, true);
        let playAgain = readlineSync.question('You have destroyed all of the battleships, would you like to play again? (Y/N): ')
        
        if (playAgain.toUpperCase() === 'Y') {
            gameBoard = createGameBoard(gridSize);
            placeShips(gameBoard, gridSize);
            gameOver = false;
        } else {
            console.log('Thank you for playing!');
            process.exit();
        }
    }
}
