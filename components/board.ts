class board {
    public fields: Array<Array<any>>;
    public moves: Array<Array<any>>;
    public lost: object = {
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
        return this.fields[position[1]][position[0]];
    }

    setFigure(position: [number, number], figure: any ): boolean{
        this.fields[position[1]][position[0]] = figure;
        return true;
    }

    /**
     * 
     * @param from 
     * @param to 
     */
    moveFigure(from: [number, number], to: [number, number]): object{
        let figure = this.getFigure(from);
        let intent;
        let last = this.getFigure(this.moves[this.moves.length-1]);

        if(last){
            if(figure.color === last.color){
                intent.movable = false;
                intent.info = "wrong turn";
                intent.position = from;
            }
        }
        
        if(figure && !intent) {
            intent = figure.move(to);
            let kickedFigure = this.getFigure(to);
    
            if(intent.movable){
                if(kickedFigure){
                    this.lost[kickedFigure.color].push(kickedFigure);
                }
                this.setFigure(to, figure);
                this.setFigure(from, false);
    
                this.moves.push([from, to]);
    
            }
        }
        
        return intent;
    }

    getAsJson(): string{
        let temp = JSON.parse(CircularJSON.stringify(this.fields));

        for(let x = 0; x < this.fields.length; x++) {
            for(let y = 0; y < this.fields.length; y++) {

                if(typeof this.fields[y][x] !== "undefined"){
                    temp[y][x] = {
                        type : !this.fields[y][x] ? false : this.fields[y][x].constructor.name,
                        color :  (this.fields[y][x].color  === 'black') ? 0 : 1
                    }; 
                } 
            }
        }
       
        return JSON.stringify({"fields" : temp, "lost" : this.lost, "moves": this.moves});
    }

    loadFromJson(jso: string): void{
        let imp = JSON.parse(jso);
        this.fields = JSON.parse(CircularJSON.stringify(imp.fields))
        for(let x = 0; x < imp.fields.length; x++) {
            for(let y = 0; y < imp.fields.length; y++) {
                if(typeof imp.fields[y][x].type !== "undefined"){
                     this.fields[y][x] = new Figures[imp.fields[y][x].type](
                        imp.fields[y][x].color,
                        [x,y],
                        this
                    );
                }else{
                    this.fields[x][y] = false; 
                }
            }
        }

        this.moves = imp.moves;
        this.lost = imp.lost;
    }

   
}