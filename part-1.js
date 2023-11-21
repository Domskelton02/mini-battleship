const readlineSync = require('readline-sync');

function printWelcomeMeassage() {
    console.log("Welcome to Mini Battleship!");
    console.log("Press any key to start the game.");
}
// included a keypress module because when i ran the terminal i could only press enter to move on, but the requirements are to be able to press "any" key
const keypress = require('keypress');

keypress(process.stdin);

process.stdin.on('keypress', function (ch, key) {
    console.log('Starting the game...');
    const gameBoard = createGameBoard(gridSize);
    printGameBoard(gameBoard); 
    process.stdin.pause();
})

printWelcomeMeassage();

process.stdin.setRawMode(true);
process.stdin.resume();

const gridSize = 3;

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

function printGameBoard(board) {
    const columnLabels = [' ', ...Array.from({ length: board.length }, (_, i) => i + 1)];
    console.log(columnLabels.join(' '));
    
    board.forEach((row, rowIndex) => {
        const rowLabel = String.fromCharCode('A'.charCodeAt(0) + rowIndex);
        console.log(rowLabel + ' ' + row.map(cell => cell === null ? '~' : cell).join(' '));


});
}