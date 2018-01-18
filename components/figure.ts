class figure {

    public name: string = "figure";
    public steps: Array<Array<number>> = [ [0,1] ];
    public _buildSteps: Array<Array<number>> = [ [] ]; 
    public intent: Intent;
    public color: string;

    constructor(
        color: number, 
        public position: [number, number],
        public board: board
    ) {
        this.color = (color === 0) ? 'black' : 'white';
     }

    move(position: [number, number]): Intent{
        let intent = this.isMovable(position);
        if(intent.movable){
            this.position = position;
        }
        return intent;
    }
    
    isMovable(position: [number, number]): Intent{

        let field = this.board.getFigure(position);

        let result:Intent = {movable : true, info : "", position: position};


        
        if(typeof field === "undefined"){
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

    generateSteps(position: [number, number]): Array<Array<number>> {
        let s: Array<Array<number>> = [];
        for(let m in this._buildSteps){
            let dir = this._buildSteps[m];
            let x = 0, y = 0;
            for(let i = 0; i <= board.fields.length;i++){
                x += dir[0];
                y += dir[1];

                let intent = this.isMovable([position[0] + x, position[1] + y]);

                if(intent.info !== "out of range"){
                    s.push([x, y]);
                }

                if(intent.info === "gegner schlagen" || intent.info === "eigene Figur") {
                    break;  
                }

            }
        }
        return s;
    }

    getMoves(position: [number, number]): number[][]{
        let moves = [];
        let steps = this.steps.concat(...this.generateSteps(position));
        
        for(let m in steps){

            let move: Intent = this.isMovable([
                this.position[0] + steps[m][0], 
                this.position[1] + steps[m][1]
            ]);

            if(move.info !== "out of range"){
                moves.push(move);
            }
           
        }
        
        return moves;
    }

}