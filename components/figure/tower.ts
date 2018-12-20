namespace Tchess {
    export class tower extends figure {
        public name: string = "Turm";
        public fenCode: string = "r";
        public _buildSteps: Array<Array<number>> = [[1, 0], [0, 1], [-1, 0], [0, -1]];
    }
}