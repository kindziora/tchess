class board {
    public fields: Array<Array<any>>;

    constructor(json: string) {
        this.loadFromJson(json);
    }
    
    getField(position: [number, number]): any{

        return this.fields[position[0]][position[1]];
    }

    saveAsJson(): string{

        let exp: object = [];

        for(let x = 0; x <= 8; x++) {
            for(let y = 0; y <= 8; y++) {
                if(typeof this.fields[x][y] !== "undefined"){
                    exp[x][y] = {
                        type : this.fields[x][y].constructor.name,
                        color : this.fields[x][y].color 
                    }; 
                } 
            }
        }
        return JSON.stringify(exp);
    }

    loadFromJson(jso: string): void{
        let import: object = JSON.parse(jso);

        for(let x = 0; x <= 8; x++) {
            for(let y = 0; y <= 8; y++) {
                if(typeof window[import[x][y].type] !== "undefined"){
                    this.fields[x][y] = new window[import[x][y].type](import[x][y].color, [x,y]); 

                }else{
                    this.fields[x][y] = false; 
                }
            }
        }
    }

   
}