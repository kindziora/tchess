namespace Figures {
    export class queen extends figure {
        public name: string = "Dame";
        public _buildSteps: Array<Array<number>> = [[1, 1], [-1, 1], [1, -1], [-1, -1], [1, 0], [0, 1], [-1, 0], [0, -1]];
    }
}