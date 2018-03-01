namespace Tchess {
    export class knight extends figure {
        public name: string = "Pferd";
        public steps: Array<Array<number>> = [[1, 2], [2, 1], [-2, 1], [2, -1], [-1, 2], [1, -2], [-1, -2], [-2, -1]];
    }
}