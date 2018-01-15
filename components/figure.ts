class figure {

    public name: string = "figure";
    public steps: Array<Array<number>> = [ [0,1] ];
    public board: board;
    public intent: Intent;

    constructor(
        public color: boolean, 
        public position: [number, number]
    ) { }

    move(position: [number, number]): Intent{
        return this.isMovable(position);
    }

    isMovable(position: [number, number]): Intent{

        let field = this.board.getField(position);

        let result:Intent = {movable : true, info : "", position: position};

        if(!field){
            result.movable = false;
            result.info = "out of range";
        }
        
        if(typeof field.name !== "undefined") {
            if(field.color === this.color){
                result.movable = false;
                result.info = "eigene Figur";
            }else{
                result.movable = true;
                result.info = "gegner schlagen";
            }
        }

        return result;
    }

    getMoves(): number[][]{
        let moves = [];

        for(let m in this.steps){

            let move: Intent = this.isMovable([
                this.position[0] + this.steps[m][0], 
                this.position[1] + this.steps[m][1]
            ]);

            if(move.info !== "out of range"){
                moves.push(move);
            }
           
        }
        
        return moves;
    }



}