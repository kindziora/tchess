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

        public getMoves(): Array<Intent> {
            let moves = super.getMoves();
            let me = this;
            let starter = (this.color === "white") ? 1 : 6;
            let direction = (this.color === "white") ? 2 : -2;

            if (this.position[1] == starter) {
                moves.push(this.isMovable([this.position[0], this.position[1] + direction]));
            }

            let m = moves.filter((e) =>
                (me.position[0] !== e.position[0] && e.info === "gegner schlagen") ||
                (me.position[0] === e.position[0] && e.info !== "gegner schlagen"));

            return m;
        }

        /**
         * check if end was reached
         * @param position 
         */
        public moved(position: [number, number]) {
            super.moved(position);
            let end = (this.color === "white") ? 7 : 0;
            if(position[1] === end) {
                this.board.onEvent('pawnReachEnd', this);
                this.changePossible = true;
            }
        }

    }
}