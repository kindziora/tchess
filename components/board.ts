interface enpassant {
    fen: string,
    by: figure
}

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
        "white": {},
        "black": {}
    };

    private winner: string = null;

    private _enpassant: enpassant = {
        fen : "-",
        by : null
    };

    private _halfMove: number = 0;

    public events: object = { 'pawnReachEnd': [], 'check': [], 'checkmate': [], 'castling': [], 'move': [], 'update': [], 'enPassant': [], 'halfMove': [] };

    /**
     * 
     * @param json 
     */
    constructor(json: string) {
        this.loadFromJson(json);

        this.on('checkmate', function (figure: figure) {
            this.setWinner(this.color[figure.getOpponentsColor()]);
        });

        this.on('enPassant', function (position: [number, number, figure]) {
            this._enpassant = {
                "fen": this.boardPositionToFen(position),
                "by": figure
            };

        });
        this.on('halfMove', function (order: number) {
            this._halfMove = order === 0 ? 0 : this._halfMove + order;
        });
    }

    /**
     * 
     */
    getWinner(): string {
        return this.winner;
    }

    /**
     * 
     * @param winner 
     */
    setWinner(winner: string): void {
        this.winner = winner;
    }

    /**
     * 
     * @param position 
     */
    getFigure(position: [number, number]): any {
        if (typeof this.fields[position[1]] !== "undefined" &&
            typeof this.fields[position[1]][position[0]] !== "undefined") {
            return this.fields[position[1]][position[0]];
        }
    }

    setFigure(position: [number, number], figure: any): boolean {
        figure.position = position;
        this.fields[position[1]][position[0]] = figure;
        return true;
    }

    hasTurn(color: string): boolean {
        return (this.moves.length % 2 === 0) && color === "white" || (this.moves.length % 2 > 0) && color === "black";
    }

    hasLost(color: string): boolean {
        let figures = this.getFigures(color);
        for (let f in figures) {
            if (figures[f].canMove()) {
                return false;
            }
        }
        this.onEvent('checkmate', this.getKing(color));
        return true;
    }

    /**
     * events: ['pawnReachEnd','check', 'checkmate', 'castling', 'moved', 'update']
     * @param type 
     * @param figure 
     */
    onEvent(type: string, figure: any): any {
        for (let evts in this.events[type]) {
            this.events[type][evts].call(this, figure);
        }
        for (let evts in this.events['update'])
            this.events['update'][evts].call(this, { "type": type, data: figure });
    }

    /**
    * events: ['pawnReachEnd','check', 'checkmate', 'castling', 'moved', 'update']
    */
    on(eventName: string, callback) {
        if (typeof this.events[eventName] === "undefined") {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }

    /**
     * 
     * @param from 
     * @param to 
     */
    moveFigure(from: [number, number], to: [number, number]): object {
        let figure = this.getFigure(from);
        let intent = { movable: false, info: "keine figur" };

        if (figure) {
            intent = figure.move(to);
            let kickedFigure = this.getFigure(to);

            if (intent.movable) {
                if (kickedFigure) {
                    this.lost[kickedFigure.color].push(kickedFigure);
                    if (kickedFigure.name === "König") {
                        this.onEvent('checkmate', kickedFigure);
                    }
                }
                this.setFigure(to, figure);
                this.setFigure(from, false);

                this.moves.push([from, to]);

                this.setTerritories(this.getTerritories());

                this.onEvent('move', [from, to]);
                figure.moved(to, from);

                let castling = this.getCasting();
                if (castling !== "-") {
                    this.onEvent('castling', castling);
                }

                this.hasLost('black');
                this.hasLost('white');
            }
        }

        return intent;
    }
    /**
     * 
     * @param color 
     * @param index 
     * @param to 
     */
    reviveFigure(color: string, index: number, to: [number, number]): any {
        let figureToReplace = this.getFigure(to);

        if (figureToReplace.constructor.name === 'pawn' && figureToReplace.changePossible) {
            //change
            this.setFigure(to, this.lost[color][index]);
            this.lost[color].splice(index, 1);
            this.setTerritories(this.getTerritories());

            this.hasLost('black');
            this.hasLost('white');
        }

    }

    /**
     * 
     */
    getAsJson(): string {
        let temp = Flatted.parse(Flatted.stringify(this.fields));
        for (let y = 0; y < this.fields.length; y++) {
            for (let x = 0; x < this.fields.length; x++) {
                if (typeof this.fields[y][x] !== "undefined") {
                    temp[y][x] = {
                        type: !this.fields[y][x] ? false : this.fields[y][x].constructor.name,
                        color: (this.fields[y][x].color === 'black') ? 0 : 1
                    };
                }
            }
        }
        let colors = ["black", "white"];
        let lost = { "black": [], "white": [] };
        for (let e in colors) {
            for (let i in this.lost[colors[e]]) {
                lost[colors[e]].push({
                    type: this.lost[colors[e]][i].constructor.name,
                    color: (this.lost[colors[e]][i].color === 'black') ? 0 : 1
                });
            }
        }

        return JSON.stringify([{ "fields": temp, "lost": lost, "moves": this.moves, "color": this.color }]);
    }

    /**
     * 
     * @param territory 
     */
    setTerritories(territory: object): void {
        this.territory = territory;
    }

    /**
     * 
     * @param color 
     */
    getKing(color: string): figure {
        return this.getFigureByTypeAndColor(color, "König");
    }
    /**
     * 
     * @param color 
     * @param type 
     */
    getFigureByTypeAndColor(color: string, type: string): figure {
        return this.getFigures(color).filter((f) => f.name === type)[0];
    }
    /**
     * 
     * @param color 
     * @param type 
     */
    getFiguresByTypeAndColor(color: string, type: string): figure[] {
        return this.getFigures(color).filter((f) => f.name === type);
    }
    /**
     * 
     * @param color 
     */
    getFigures(color: string): Array<figure> {
        let figures = [];
        for (let y = 0; y < this.fields.length; y++) {
            for (let x = 0; x < this.fields.length; x++) {
                if (typeof this.fields[y][x].getPlainmoves !== "undefined") {
                    if (this.fields[y][x].color === color) {
                        figures.push(this.fields[y][x]);
                    }
                }
            }
        }
        return figures;
    }

    getTerritories(): object {

        let territory: object = {
            "white": {},
            "black": {}
        };

        for (let y = 0; y < this.fields.length; y++) {
            for (let x = 0; x < this.fields.length; x++) {
                if (typeof this.fields[y][x].getPlainmoves !== "undefined") {
                    let plainmoves = this.fields[y][x].getPlainmoves();
                    for (let i in plainmoves) {
                        let pm = plainmoves[i];
                        territory[this.fields[y][x].color][pm] = [y, x];
                    }
                }
            }
        }

        return territory;
    }

    loadFromJson(jso: string): void {

        let imp = Flatted.parse(jso);
        this.fields = Flatted.parse(Flatted.stringify(imp.fields));

        for (let y = 0; y < imp.fields.length; y++) {
            for (let x = 0; x < imp.fields.length; x++) {
                if (typeof imp.fields[y][x].type !== "undefined" && imp.fields[y][x].type) {
                    this.fields[y][x] = new Tchess[imp.fields[y][x].type](
                        imp.fields[y][x].color,
                        [x, y],
                        this
                    );
                    this.fields[y][x].getMoves();

                    let plainmoves = this.fields[y][x].getPlainmoves();
                    for (let i in plainmoves) {
                        let pm = plainmoves[i];
                        this.territory[this.fields[y][x].color][pm] = [y, x];
                    }

                } else {
                    this.fields[y][x] = false;
                }
            }
        }
        this.moves = imp.moves;

        let lost = { "black": [], "white": [] };
        let colors = ["black", "white"];
        for (let e in colors) {
            let ei = colors[e];
            for (let i in imp.lost[ei]) {
                lost[ei][i] = new Tchess[imp.lost[ei][i].type](
                    imp.lost[ei][i].color,
                    [0, 0],
                    this
                );
            }
        }
        this.color = imp.color;
        this.lost = lost;
    }

    getAsFEN(): string {
        let FEN = [];
        for (let y = 0; y < this.fields.length; y++) {
            let row = "", fc = "0";
            for (let x = 0; x < this.fields[y].length; x++) {
                // @ts-ignore
                fc = typeof this.fields[y][x] === "object" ? this.fields[y][x].fenChar : !isNaN(1 + parseInt(fc)) ? 1 + parseInt(fc) : 1;

                if (typeof this.fields[y][x] === "object") {
                    row += fc;
                } else {
                    if (typeof this.fields[y][1 + x] === "object" || 1 + x === this.fields.length) {
                        row += fc;
                    }
                }
            }
            FEN.push(row);
        }

        return FEN.reverse().join('/') + ` ${this.hasTurn('white') ? 'w' : 'b'} ${this.getCasting()} ${this.getEnpassant()} ${this.getHalfmoves()} ${this.moves.length === 0 ? 1 : Math.ceil((this.moves.length +1) / 2)}`;

    };

    getCastlingForColor(color: string): string {
        let castlingString = "";
        let king = this.getFigureByTypeAndColor(color, "König");
        let tower = this.getFiguresByTypeAndColor(color, "Turm");
        let castlingMappings = { 3: (color === "white") ? "K" : "k", 4: (color === "white") ? "Q" : "q" }
        let territories = this.getTerritories();
        let opponent = (color === "white") ? "black" : "white";

        //has king moved?
        if (king.hasMoved()) {
            return "";
        }

        //king in mate position?
        if (typeof territories[opponent][king.position.join(',')] !== "undefined") {
            return "";
        }

        for (let t in tower) {
            let dist = king.position[0] > tower[t].position[0] ? king.position[0] - tower[t].position[0] : tower[t].position[0] - king.position[0];
            let y = king.position[1];
            let cnt = 0;
            let max = Math.max(king.position[0], tower[t].position[0]);
            let min = Math.min(king.position[0], tower[t].position[0]);

            for (let inBetween = min + 1; inBetween <= max; inBetween++) {
                cnt++;

                if (this.getFigure([inBetween, y])) {
                    //no figures in between king and tower? 
                    castlingMappings[Math.abs(dist)] = "";
                }

                //king does not pass enemy territory 
                if (cnt <= 2) {
                    if (typeof territories[opponent][[inBetween, y].join(',')] !== "undefined") {
                        castlingMappings[Math.abs(dist)] = "";
                    }
                }
            }
            //tower has not moved?
            castlingString += !tower[t].hasMoved() ? castlingMappings[Math.abs(dist)] : "";
        }

        return castlingString;
    }

    getCasting(): string {
        let castlingInfo = this.getCastlingForColor("white") + this.getCastlingForColor("black");
        return castlingInfo !== "" ? castlingInfo : "-";
    }

    getEnpassant(): string {
        return this._enpassant.fen;
    }

    getEnpassantFigure(): figure {
        return this._enpassant.by;
    }

    getHalfmoves(): string {
        return "" + this._halfMove;
    }
    /**
     * 
     * @param position 
     */
    boardPositionToFen(position: [number, number]): string {
        return (position[0] != -1) ? "abcdefgh"[position[0]] + (position[1] + 1) : "-";
    }

    fenMoveToBoardMove(positionMove: string): number[][] {
        let middle = Math.ceil(positionMove.length / 2);
        let from = positionMove.slice(0, middle);
        let to = positionMove.slice(middle);
        return [this.fenPositionToArrayCoordinates(from), this.fenPositionToArrayCoordinates(to)];
    }

    fenPositionToArrayCoordinates(positionString: string): number[] {
        function alphabetPosition(str) {
            var arr = "abcdefgh".split("");
            return str.replace(/[a-z]/ig, function (m) { return arr.indexOf(m.toLowerCase()) });
        }
        return [parseInt(alphabetPosition(positionString[0])), parseInt(positionString[1]) - 1];
    }


}