namespace Tchess {
    export class queen extends figure {
        public name: string = "Dame";
        public fenCode: string = "q";
        
        public _buildSteps: Array<Array<number>> = [[1, 1], [-1, 1], [1, -1], [-1, -1], [1, 0], [0, 1], [-1, 0], [0, -1]];
    }
}