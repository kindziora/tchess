namespace Tchess {
    export class king extends figure {
        public name: string = "König";
        public steps: Array<Array<number>> = [[0, 1], [1, 1], [1, 0], [0, -1], [-1, -1], [-1, 0], [-1, 1], [1, -1]];
        public checkBy: Array<number>;
        public fenCode: string = "k";
        public castlingPositions: object =  {
            'white' : {"K" : {steps : [2, 0], tower: [[7,0], [5,0]]}, "Q" : {steps : [-2, 0], tower: [[0,0], [3,0]]}},
            'black' : {"k" : {steps : [-2, 0], tower: [[7,7], [5,7]]}, "q" : {steps : [2, 0], tower: [[0,7], [3,7]]}}
        };
        
        public getMoves(): Array<Intent> {
            let castlings = this.board.getCastlingString().split("");
            for(let l in castlings){
                let c = castlings[l];
                if(typeof this.castlingPositions[this.color][c] !== "undefined"){
                    this.steps.push(this.castlingPositions[this.color][c].steps);
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

        /**
         * 
         * @param position 
         * @param from 
         */
        public moved(position: [number, number], from?: [number, number]) {
            super.moved(position);
           
            let distance = position[0] - from[0];

            if (Math.abs(distance) > 1) {
                //castling

                for (let m in this.castlingPositions[this.color]){
                    let moves = this.castlingPositions[this.color][m].steps;
                    if(this.castlingPositions[this.color][m].steps.indexOf(distance) > -1){
                        let towerFrom = this.castlingPositions[this.color][m].tower[0];
                        let tower = this.board.getFigure(towerFrom);
                        
                        let towerTo = this.castlingPositions[this.color][m].tower[1];

                        this.board.setFigure(towerTo, tower);
                        this.board.setFigure(towerFrom, false);
                        this.board.setTerritories(this.board.getTerritories());
                        
                        this.board.onEvent('castling', [from, position, this, m]);
                    }
                }

            }
           
        }


    }
}