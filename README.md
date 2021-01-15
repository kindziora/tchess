# tchess
chess game engine build with typescript 

### sample usage

```javascript

let Tchess = require('../build/index.js');
const {parse, stringify} = require('flatted/cjs');
let FENValidation = require('./validateFEN.js');
let g = Tchess.game.start( );
let white = 1;
let black = 6;

let js = g.getAsJson();

g.loadFromJson(js);

console.log(js == g.getAsJson());

console.log(g.moveFigure([1,white], [1,++white]));
console.log(g.moveFigure([2,black], [2,--black]));

console.log("figur", g.getFigure([1,0]));
console.log("moves", g.getFigure([1,0]).getMoves());


console.log(g.moveFigure([1,white], [1,++white]));
console.log(g.moveFigure([2,black], [2,--black]));

console.log(g.moveFigure([1,white], [2,++white]));
 

 console.log("getCasting", g.getCasting());
 console.log("getEnpassant", g.getEnpassant());
 console.log("getHalfmoves", g.getHalfmoves());


console.log("getAsFEN", g.getAsFEN());

 
console.log(FENValidation(g.getAsFEN()));`
