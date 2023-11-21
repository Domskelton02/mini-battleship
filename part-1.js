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
    process.stdin.pause();
})

printWelcomeMeassage();

process.stdin.setRawMode(true);
process.stdin.resume();

