let Tchess = require('../build/index.js');

let g = Tchess.game.start();
let white = 1;
let black = 6;
console.log(g.moveFigure([1,white], [1,++white]));
console.log(g.moveFigure([2,black], [2,--black]));

console.log("figur", g.getFigure([1,0]));
console.log("moves", g.getFigure([1,0]).getMoves());


console.log(g.moveFigure([1,white], [1,++white]));
console.log(g.moveFigure([2,black], [2,--black]));

console.log(g.moveFigure([1,white], [2,++white]));
 
let e = JSON.parse(g.getAsJson())['fields']
    .map((e)=> e.map(
        (i) => i.type.toString()[0]
    ).join(','))
    .join('\r\n')
    .replace(/f/g, ' ');

console.log(e);

