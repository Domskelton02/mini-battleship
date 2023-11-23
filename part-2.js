const readlineSync = require('readline-sync');

function printWelcomeMessage() {
    console.log("Welcome to Mini Battleship!");
    console.log("Press any key to start the game.");
}

let gridSize = 10;
let shipSizes = [2, 3, 3, 4, 5];
let gameBoard = createGameBoard(gridSize);
placeShips(gameBoard, shipSizes);


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
            else if (cell === 'S' && revealShips) {
                return 'S';
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

function placeShips(board, shipSizes) {
    shipSizes.forEach(size => {
        let placed = false;
        while (!placed) {
            let horizontal = Math.random() < 0.5;
            let pos = getRandomPosition(board.length, size, horizontal);
            
            if (canPlaceShip(board, pos.row, pos.col, size, horizontal)) {
                for (let i = 0; i < size; i++) {
                    let row = pos.row + (horizontal ? 0 : i);
                    let col = pos.col + (horizontal ? i : 0);
                    board[row][col] = 'S';
                }
                placed = true;
            }
        }
    });
}

function getRandomPosition(gridSize, shipSize, horizontal) {
    let row, col;
    if (horizontal) {
        row = Math.floor(Math.random() * gridSize);
        col = Math.floor(Math.random() * (gridSize - shipSize));
    } else {
        row = Math.floor(Math.random() * (gridSize - shipSize));
        col = Math.floor(Math.random() * gridSize);
    }
    return { row, col };
}

function canPlaceShip(board, row, col, size, horizontal) {
    for (let i = 0; i < size; i++) {
        let checkRow = row + (horizontal ? 0 : i);
        let checkCol = col + (horizontal ? i : 0);
        if (checkRow >= board.length || checkCol >= board.length || board[checkRow][checkCol] === 'S') {
            return false; 
        }
    }
    return true;
}

gameBoard = createGameBoard(10);
placeShips(gameBoard, shipSizes);

function getUserGuess() {
    let userInput = readlineSync.question("Enter a location to strike ie 'A2' ");
    return userInput.toUpperCase();
}

function updateBoard(board, guess, gridSize) {
    let row = guess.charCodeAt(0) - 'A'.charCodeAt(0);
    let col = parseInt(guess.slice(1)) - 1;

    if (guess && row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
        if (board[row][col] === 'X') {
            console.log("You already guessed this location!");
        } else if (board[row][col] === '~') {
            console.log("You already guessed this location!");
        } else if (board[row][col] === 'S') {
            board[row][col] = 'X';
            console.log("Hit. You have sunk a part of a battleship.");
        } else {
            board[row][col] = '~';
            console.log('Miss!');
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
            placeShips(gameBoard, shipSizes);
            gameOver = false;
        } else {
            console.log('Thank you for playing!');
            process.exit();
        }
    }
}
