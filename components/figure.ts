class figure {

    public name: string = "figure";
    public steps: Array<Array<number>> = [ [] ];
    public _buildSteps: Array<Array<number>> = []; 
    public intent: Intent;
    public color: string;
    public plainmoves: Array<string>;

    constructor(
        color: number, 
        public position: [number, number],
        public board: board
    ) {
        this.color = (color === 0) ? 'black' : 'white';
     }

     public move(position: [number, number]): Intent{
        let intent = this.isMovable(position);

        if(!this.isInMovables(position)){
            intent.movable = false;
            intent.info = "nicht erlaubter Schritt";
        }

        if(!this.board.hasTurn(this.color)){
            intent.movable = false;
            intent.info = "Gegner am Zug";
        }

        if(intent.movable){
            this.position = position;
        }
        return intent;
    }
    
    public moved(position: [number, number]){
        
    }
    
    public isInMovables(position: [number, number]): boolean {
        return this.getMoves().filter((e)=>e.position[0] === position[0] &&
        e.position[1] === position[1] ).length > 0;
    }

    public isMovable(position: [number, number]): Intent{

        let field = this.board.getFigure(position);

        let result:Intent = {movable : true, info : "", position: position};

        if(typeof field === "undefined"){
            result.movable = false;
            result.info = "out of range";
        }else if(typeof field.name !== "undefined") {
            if(field.color === this.color){
                result.movable = false;
                result.info = "eigene Figur";
            }else{
                result.movable = true;
                result.info = "gegner schlagen";
            }
        }else{
            result.movable = true;
            result.info = "leeres Feld";
        }

        return result;
    }

    public generateSteps(position: [number, number]): Array<Array<number>> {
        let s: Array<Array<number>> = [];
        for(let m in this._buildSteps){
            let dir = this._buildSteps[m];
            let x = 0, y = 0;
            for(let i = 0; i <= this.board.fields.length;i++){
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

    public getMoves(): Array<Intent>{
        let moves = [];
        let steps = this.steps.concat(this.generateSteps(this.position));
        let plain;
        this.plainmoves = [];
        for(let m in steps){ 
             plain = [
                this.position[0] + steps[m][0], 
                this.position[1] + steps[m][1]
            ];
            let move: Intent = this.isMovable(plain);
            if(move.info !== "out of range"){
                moves.push(move);
                this.plainmoves.push(plain.join(',')); 
            }
        }
        return moves;
    }

    public getPlainmoves(): string[]{
        let plainmoves = [];
        let moves = this.getMoves();
        for(let m in moves){ 
            let move: Intent = moves[m];
            plainmoves.push(move.position.join(','));
        }
        return plainmoves;
    }

    public setPlainmoves(moves: string[]){
        this.plainmoves = moves;
    }
}