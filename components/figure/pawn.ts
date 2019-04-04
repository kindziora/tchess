namespace Tchess {
    export class pawn extends figure {
        public name: string = "Bauer";
        public fenCode: string = "p";
        public changePossible: boolean = false;
        public steps: Array<Array<number>> = [[0, 1], [1, 1], [-1, 1]];

        constructor(
            color: number,
            public position: [number, number],
            public board: board
        ) {
            super(color, position, board);

            if (this.color === "black") {
                this.steps = [[0, -1], [1, -1], [-1, -1]];
            }
        }

        public getMoves(ignoreOwn?: boolean): Array<Intent> {
            let moves = super.getMoves(ignoreOwn);
            let me = this;
            let starter = (this.color === "white") ? 1 : 6;
            let direction = (this.color === "white") ? 2 : -2;

            if (this.position[1] == starter) {
                let firstBeforePawn = this.isMovable([this.position[0], this.position[1] + (direction / 2)]);
                if (firstBeforePawn.info !== "gegner schlagen") {
                    moves.push(this.isMovable([this.position[0], this.position[1] + direction]));
                }
            }
            let enpsPosition = [];
            if (this.board.getEnpassant() !== "-") {
                let byFigure = this.board.getEnpassantFigure();
                if (byFigure.color !== this.color) { //enemy
                    enpsPosition = this.board.fenPositionToArrayCoordinates(this.board.getEnpassant());
                }
            }

            let m = moves.filter((e) =>
                (me.position[0] !== e.position[0] && e.info === "gegner schlagen") || // beat enemy
                (me.position[0] === e.position[0] && e.info !== "gegner schlagen") || // empty field
                (me.position[0] !== e.position[0] && e.info !== "gegner schlagen" && // enpasse beat enemy
                    enpsPosition.length > 0 && e.position[0] === enpsPosition[0] &&
                    e.position[1] === enpsPosition[1])
            );

            let ownKing = this.board.getKing(this.color);
            if(ownKing){
                if (ownKing.positionInDangerBy(ownKing.position)) {
                    m = [];
                    this.board.onEvent('check', [this]);
                }
            } 

            return m;
        }

        /**
         * check if end was reached
         * @param position 
         */
        public moved(position: [number, number], from?: [number, number]) {
            //super.moved(position);
            //this.board.onEvent('enPassant', [-1, -1]);
            this.board.onEvent('halfMove', 1);

            let end = (this.color === "white") ? 7 : 0;
            if (position[1] === end) {
                this.board.onEvent('pawnReachEnd', this);
                this.changePossible = true;
            }

            let enpsPosition = [];

            if (this.board.getEnpassant() !== "-") {
                enpsPosition = this.board.fenPositionToArrayCoordinates(this.board.getEnpassant());
                if (position[0] === enpsPosition[0] && position[1] === enpsPosition[1]) {
                    // kill the figure related to the enpasse
                    this.board.lost[this.board.getEnpassantFigure().color].push(this.board.getEnpassantFigure());
                    this.board.setFigure(this.board.getEnpassantFigure().position, false);
                }

            }

            let distance = from[1] > position[1] ? from[1] - position[1] : position[1] - from[1];

            if (Math.abs(distance) > 1) {
                //enpassant
                this.board.onEvent('enPassant', [position[0], position[1] + (from[1] > position[1] ? 1 : -1), this]);
            }else{
                this.board.onEvent('enPassant', [-1, -1]);
            }
           

            if (from[0] - position[0] === 0) {
                this.board.onEvent('halfMove', 0);
            }
        }

    }
}