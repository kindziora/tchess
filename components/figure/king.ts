namespace Tchess {
    export class king extends figure {
        public name: string = "König";
        public steps: Array<Array<number>> = [[0, 1], [1, 1], [1, 0], [0, -1], [-1, -1], [-1, 0], [-1, 1], [1, -1]];
        public checkBy: Array<number>;
        public fenCode: string = "k";
        public castlingPositions: {
            'white' : {"K" : [2, 0], "Q" : [-2, 0]},
            'black' : {"k" : [-2, 0], "q" : [2, 0]}
        };
 
        public getMoves(): Array<Intent> {
            let castlings = this.board.getCastlingString().split("");
            for(let l in castlings){
                let c = castlings[l];
                if(typeof this.castlingPositions[this.color][c] !== "undefined"){
                    this.steps.push(this.castlingPositions[this.color][c]);
                }
            }

            let moves = super.getMoves();
            for (let m in moves) {
                let move = moves[m].position.join(',');
                let opponent = this.getOpponentsColor();
                if (this.positionInDangerBy(moves[m].position)) {
                    moves[m].movable = false;
                    moves[m].info = "Spieler im Schach";
                }
            }
           
            return moves;
        }
    }
}