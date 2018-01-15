class pawn extends figure{
    public name: string = "Bauer";
    public steps: Array<Array<number>> = [ [0,1] ];

    getMoves(): number[][]{
        let moves = super.getMoves();
        
        if(this.position[1] == 7){
            moves.push([this.position[1], this.position[1] - 2]);
        }
        
        return moves;
    }
}