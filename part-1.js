const readlineSync = require('readline-sync');

function startGame() {
    console.log("Welcome to Mini Battleship!");
    readlineSync.question("Press any key to start the game.");
    let gameBoard = createGameBoard(3);
    placeTwoShips(gameBoard);
    gameLoop(gameBoard);
}

function createGameBoard(size) {
    return Array.from({ length: size }, () => Array(size).fill(null));
}

function placeTwoShips(board) {
    for (let i = 0; i < 2; i++) {
        let placed = false;
        while (!placed) {
            const position = getRandomPosition(board.length);
            if (board[position.row][position.col] === null) {
                board[position.row][position.col] = 'S';
                placed = true;
            }
        }
    }
}

function getRandomPosition(size) {
    return {
        row: Math.floor(Math.random() * size),
        col: Math.floor(Math.random() * size)
    };
}

function gameLoop(board) {
    let shipsSunk = 0;

    while (shipsSunk < 2) {
        const guess = getUserGuess();
        const result = makeGuess(board, guess);
        
        if (result === 'hit') {
            shipsSunk++;
            console.log(`Hit. You have sunk a battleship. ${2 - shipsSunk} ship remaining.`);
        } else if (result === 'miss') {
            console.log("You have missed!");
        } else {
            console.log("You have already picked this location. Miss!");
        }
    }

    if (shipsSunk === 2) {
        console.log("You have destroyed all battleships. Would you like to play again? Y/N");
        if (readlineSync.keyInYNStrict()) {
            startGame();
        } else {
            console.log('Thank you for playing!');
        }
    }
}

function getUserGuess() {
    return readlineSync.question("Enter a location to strike ie 'A2': ").toUpperCase();
}

function makeGuess(board, guess) {
    const row = guess.charCodeAt(0) - 'A'.charCodeAt(0);
    const col = parseInt(guess.slice(1)) - 1;

    if (board[row][col] === 'S') {
        board[row][col] = 'X';
        return 'hit';
    } else if (board[row][col] === 'X' || board[row][col] === 'M') {
        return 'repeat';
    } else {
        board[row][col] = 'M';
        return 'miss';
    }
}

startGame();
