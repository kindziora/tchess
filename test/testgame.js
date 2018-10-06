

var Tchess = require("../build/index.js");
console.log(Tchess);
var game = Tchess.game;

var session = game.start();

console.log(
    session.getAsJson(),
session.moveFigure([1,0], [2,2]),
session.moveFigure([1,1], [1,2]),

session.getAsJson()
);