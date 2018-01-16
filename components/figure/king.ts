namespace Figures {
    class king extends figure {
        public name: string = "König";
        public steps: Array<Array<number>> = [[0, 1], [1, 1], [1, 0], [0, -1], [-1, -1], [-1, 0], [-1, 1], [1, -1]];

        constructor(
            color: number,
            public position: [number, number]
        ) {
            super(color, position);

            if (this.color === "black") {
                this.steps = [[0, -1]];
            }
        }

        getMoves(position: [number, number]): number[][] {
            let moves = super.getMoves(position);

            let starter = (this.color === "white") ? 1 : 6;
            let direction = (this.color === "white") ? 2 : -2;

            if (this.position[1] == starter) {
                moves.push([this.position[0], this.position[1] + direction]);
            }
            return moves;
        }
    }
}