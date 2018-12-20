namespace Tchess {
    export class king extends figure {
        public name: string = "König";
        public steps: Array<Array<number>> = [[0, 1], [1, 1], [1, 0], [0, -1], [-1, -1], [-1, 0], [-1, 1], [1, -1]];
        public checkBy: Array<number>;
        public fenCode: string = "k";
       
        public getMoves(): Array<Intent> {
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