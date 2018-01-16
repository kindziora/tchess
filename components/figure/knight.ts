namespace Figures {
    class knight extends figure {
        public name: string = "Pferd";
        public _buildSteps: Array<Array<number>> = [[1, 2], [2, 1], [-2, 1], [2, -1], [-1, 2], [1, -2], [-1, -2], [-2, -1]];
    }
}