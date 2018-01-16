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
        return this.fields[position[0]][position[1]];
    }

    setFigure(position: [number, number], figure: any ): boolean{
        this.fields[position[0]][position[1]] = figure;
        return true;
    }

    /**
     * 
     * @param from 
     * @param to 
     */
    moveFigure(from: [number, number], to: [number, number]): object{
        let figure = this.getFigure(from);

        let intent = figure.move(to);
        let kickedFigure = this.getFigure(to);

        if(intent.movable){
            if(kickedFigure){
                this.lost[kickedFigure.color].push(kickedFigure);
            }
            this.setFigure(to, figure);
            this.setFigure(from, false);

            this.moves.push([from, to]);

        }
        
        return intent;
    }

    getAsJson(): string{
        let temp = this.fields;
        for(let x = 0; x < this.fields.length; x++) {
            for(let y = 0; y < this.fields.length; y++) {

                if(typeof this.fields[x][y] !== "undefined"){
                    temp[x][y] = {
                        type : this.fields[x][y].constructor.name,
                        color :  (this.fields[x][y].color  === 'black') ? 0 : 1
                    }; 
                } 
            }
        }
       
        return JSON.stringify({"fields" : temp, "lost" : this.lost, "moves": this.moves});
    }

    loadFromJson(jso: string): void{
        let imp = JSON.parse(jso);
        this.fields = imp.fields;
        for(let x = 0; x < imp.fields.length; x++) {
            for(let y = 0; y < imp.fields.length; y++) {
                if(typeof imp.fields[x][y].type !== "undefined"){
                    console.log( Figures );
                    this.fields[x][y] = new Figures[imp.fields[x][y].type](imp.fields[x][y].color, [x,y]);
                }else{
                    this.fields[x][y] = false; 
                }
            }
        }

        this.moves = imp.moves;
        this.lost = imp.lost;
    }

   
}