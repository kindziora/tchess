namespace Tchess {
    export class pawn extends figure {
        public name: string = "Bauer";
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

        getMoves(): number[][] {
            let moves = super.getMoves();
            let me = this;
            let starter = (this.color === "white") ? 1 : 6;
            let direction = (this.color === "white") ? 2 : -2;

            if (this.position[1] == starter) {
                moves.push(this.isMovable([this.position[0], this.position[1] + direction]));
            }

            return moves.filter((e) => 
            !(me.position[0] !== e.position[0] && e.info !== "gegner schlagen") &&
            !(me.position[1] !== e.position[1] && e.info === "gegner schlagen"));
        }

    }
}