class board {
    public fields: Array<Array<any>>;
    public moves: Array<Array<any>>;
    public lost: object = {
        "white": [],
        "black": []
    };

    public territory: object = {
        "white": [],
        "black": []
    };


    /**
     * 
     * @param json 
     */
    constructor(json: string) {
        this.loadFromJson(json);
    }

    /**
     * 
     * @param position 
     */
    getFigure(position: [number, number]): any{
        if(typeof this.fields[position[1]] !== "undefined" && 
            typeof this.fields[position[1]][position[0]] !== "undefined" ){
            return this.fields[position[1]][position[0]];
        }
    }

    setFigure(position: [number, number], figure: any ): boolean{
        this.fields[position[1]][position[0]] = figure;
        return true;
    }

    hasTurn(color: string): boolean {
        return (this.moves.length % 2 === 0) && color === "white" ||  (this.moves.length % 2 > 0) && color === "black";
    }
    
    /**
     * 
     * @param from 
     * @param to 
     */
    moveFigure(from: [number, number], to: [number, number]): object{
        let figure = this.getFigure(from);
        let intent = { movable : false, info : "keine figur"};
        
        if(figure) { 
            intent = figure.move(to);
            let kickedFigure = this.getFigure(to);
    
            if(intent.movable){
                if(kickedFigure){
                    this.lost[kickedFigure.color].push(kickedFigure);
                }
                this.setFigure(to, figure);
                this.setFigure(from, false);

                this.moves.push([from, to]);
                this.territory[figure.color].push(figure.plainmoves);
            }
        }

        return intent;
    }

    getAsJson(): string{
        let temp = JSON.parse(CircularJSON.stringify(this.fields));
        for(let y = 0; y < this.fields.length; y++) {
            for(let x = 0; x < this.fields.length; x++) {
                if(typeof this.fields[y][x] !== "undefined"){
                    temp[y][x] = {
                        type : !this.fields[y][x] ? false : this.fields[y][x].constructor.name,
                        color :  (this.fields[y][x].color  === 'black') ? 0 : 1
                    }; 
                } 
            }
        }
       
        return CircularJSON.stringify({"fields" : temp, "lost" : this.lost, "moves": this.moves});
    }

    loadFromJson(jso: string): void{
        let imp = JSON.parse(jso);
        this.fields = JSON.parse(CircularJSON.stringify(imp.fields));
 
        for(let y = 0; y < imp.fields.length; y++) {
            for(let x = 0; x < imp.fields.length; x++) {
                if(typeof imp.fields[y][x].type !== "undefined"){
                     this.fields[y][x] = new Tchess[imp.fields[y][x].type](
                        imp.fields[y][x].color,
                        [x,y],
                        this
                    );
                    this.fields[y][x].getMoves();
                    this.territory[this.fields[y][x].color].push(this.fields[y][x].plainmoves);
                }else{
                    this.fields[y][x] = false; 
                }
            }
        }
        this.moves = imp.moves;
        this.lost = imp.lost;
    }
   
}