class board {
    public fields: Array<Array<any>>;
    public moves: Array<Array<any>>;

    public color: object = {
        "white": null,
        "black": null
    };

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
     * events: ['pawnReachEnd','check', 'checkmate', 'castling']
     * @param type 
     * @param figure 
     */
    onEvent (type: string, figure: any) : any {
        console.log(type, figure);
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

                figure.moved(to);

                this.moves.push([from, to]);
                this.territory[figure.color].push(figure.plainmoves);
            }
        }

        return intent;
    }

    reviveFigure(color: string, index: number, to : [number, number]) : any{
        let figureToReplace = this.getFigure(to);

        if(figureToReplace.type === 'pawn' && figureToReplace.changePossible){
            //change
            this.setFigure(to, this.lost[color][index]);
            this.lost[color] = this.lost[color].splice(index, 1);
        }

    }

    getAsJson(): string{
        let temp = Flatted.parse(Flatted.stringify(this.fields));
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
        let colors = ["black", "white"];
        let lost = {"black" : [], "white" : []};
        for(let e in colors) {
            for(let i in this.lost[colors[e]]) {
                lost[colors[e]].push({
                    type : this.lost[colors[e]][i].constructor.name,
                    color :  (this.lost[colors[e]][i].color  === 'black') ? 0 : 1
                });
            }
        }
       
        return JSON.stringify([{"fields" : temp, "lost" : lost, "moves": this.moves, "color" : this.color}]);
    }

    loadFromJson(jso: string): void{
        
        let imp = Flatted.parse(jso);
        this.fields = Flatted.parse(Flatted.stringify(imp.fields));
 
        for(let y = 0; y < imp.fields.length; y++) {
            for(let x = 0; x < imp.fields.length; x++) {
                if(typeof imp.fields[y][x].type !== "undefined" && imp.fields[y][x].type){
                     this.fields[y][x] = new Tchess[imp.fields[y][x].type](
                        imp.fields[y][x].color,
                        [x,y],
                        this
                    );
                    this.fields[y][x].getMoves();
                    this.territory[this.fields[y][x].color].push(this.fields[y][x].getPlainmoves());
                }else{
                    this.fields[y][x] = false; 
                }
            }
        }
        this.moves = imp.moves;

        let lost = {"black" : [], "white" : []};
        let colors = ["black", "white"];
        for(let e in colors) {
            let ei = colors[e];
            for(let i in imp.lost[ei]) {
                lost[ei][i] = new Tchess[imp.lost[ei][i].type](
                        imp.lost[ei][i].color,
                        [0,0],
                        this
                    );
            }
        }
        this.color = imp.color;
        this.lost = lost;
    }
   
}