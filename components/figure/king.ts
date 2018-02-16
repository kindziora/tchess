namespace Tchess {
    export class king extends figure {
        public name: string = "König";
        public steps: Array<Array<number>> = [[0, 1], [1, 1], [1, 0], [0, -1], [-1, -1], [-1, 0], [-1, 1], [1, -1]];
        
        public getMoves(): number[][] {
            let moves = super.getMoves();
            for(let m in moves){
                let move = moves[m].position.join(',');
                let opponent = (this.color === 'black') ? 'white' : 'black' ;
                if(this.board.territory[opponent].indexOf(move) !== -1){
                    moves[m].movable = false;
                    moves[m].info = "spieler im schach";
                }
            }
            return moves;
        }
    }
}