namespace Tchess {

    export class bishop extends figure {
        public name: string = "Läufer";
        public fenCode: string = "b";
        public _buildSteps: Array<Array<number>> = [[1, 1], [-1, 1], [1, -1], [-1, -1]];
    }
}