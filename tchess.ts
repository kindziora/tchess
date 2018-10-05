namespace Tchess {
    export class game {
        public static defaultBoard: string = '[{"fields":[[{"color":1,"type":"tower"},{"color":1,"type":"knight"},{"color":1,"type":"bishop"},{"color":1,"type":"queen"},{"color":1,"type":"king"},{"color":1,"type":"bishop"},{"color":1,"type":"knight"},{"color":1,"type":"tower"}],[{"color":1,"type":"pawn"},{"color":1,"type":"pawn"},{"color":1,"type":"pawn"},{"color":1,"type":"pawn"},{"color":1,"type":"pawn"},{"color":1,"type":"pawn"},{"color":1,"type":"pawn"},{"color":1,"type":"pawn"}],[false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false],[{"color":0,"type":"pawn"},{"color":0,"type":"pawn"},{"color":0,"type":"pawn"},{"color":0,"type":"pawn"},{"color":0,"type":"pawn"},{"color":0,"type":"pawn"},{"color":0,"type":"pawn"},{"color":0,"type":"pawn"}],[{"color":0,"type":"tower"},{"color":0,"type":"knight"},{"color":0,"type":"bishop"},{"color":0,"type":"queen"},{"color":0,"type":"king"},{"color":0,"type":"bishop"},{"color":0,"type":"knight"},{"color":0,"type":"tower"}]],"moves":[],"lost":{"white":[],"black":[]}}]';
        public static start(boardString?: string): board {
            return new board(boardString ? boardString : this.defaultBoard);
        }
    }
}
if(typeof module !== "undefined")
    module.exports = Tchess;