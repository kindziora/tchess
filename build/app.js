var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var board = /** @class */ (function () {
    /**
     *
     * @param json
     */
    function board(json) {
        this.lost = {
            "white": [],
            "black": []
        };
        this.loadFromJson(json);
    }
    /**
     *
     * @param position
     */
    board.prototype.getFigure = function (position) {
        return this.fields[position[0]][position[1]];
    };
    board.prototype.setFigure = function (position, figure) {
        this.fields[position[0]][position[1]] = figure;
        return true;
    };
    /**
     *
     * @param from
     * @param to
     */
    board.prototype.moveFigure = function (from, to) {
        var figure = this.getFigure(from);
        var intent = figure.move(to);
        var kickedFigure = this.getFigure(to);
        if (intent.movable) {
            if (kickedFigure) {
                this.lost[kickedFigure.color].push(kickedFigure);
            }
            this.setFigure(to, figure);
            this.setFigure(from, false);
            this.moves.push([from, to]);
        }
        return intent;
    };
    board.prototype.getAsJson = function () {
        var temp = this.fields;
        for (var x = 0; x < this.fields.length; x++) {
            for (var y = 0; y < this.fields.length; y++) {
                if (typeof this.fields[x][y] !== "undefined") {
                    temp[x][y] = {
                        type: this.fields[x][y].constructor.name,
                        color: (this.fields[x][y].color === 'black') ? 0 : 1
                    };
                }
            }
        }
        return JSON.stringify({ "fields": temp, "lost": this.lost, "moves": this.moves });
    };
    board.prototype.loadFromJson = function (jso) {
        var imp = JSON.parse(jso);
        this.fields = imp.fields;
        for (var x = 0; x < imp.fields.length; x++) {
            for (var y = 0; y < imp.fields.length; y++) {
                if (typeof imp.fields[x][y].type !== "undefined") {
                    console.log(Figures);
                    this.fields[x][y] = new Figures[imp.fields[x][y].type](imp.fields[x][y].color, [x, y]);
                }
                else {
                    this.fields[x][y] = false;
                }
            }
        }
        this.moves = imp.moves;
        this.lost = imp.lost;
    };
    return board;
}());
var figure = /** @class */ (function () {
    function figure(color, position) {
        this.position = position;
        this.name = "figure";
        this.steps = [[0, 1]];
        this._buildSteps = [[]];
        this.color = (color === 0) ? 'black' : 'white';
    }
    figure.prototype.move = function (position) {
        var intent = this.isMovable(position);
        if (intent.movable) {
            this.position = position;
        }
        return intent;
    };
    figure.prototype.isMovable = function (position) {
        var field = this.board.getFigure(position);
        var result = { movable: true, info: "", position: position };
        if (typeof field === "undefined") {
            result.movable = false;
            result.info = "out of range";
        }
        if (typeof field.name !== "undefined") {
            if (field.color === this.color) {
                result.movable = false;
                result.info = "eigene Figur";
            }
            else {
                result.movable = true;
                result.info = "gegner schlagen";
            }
        }
        return result;
    };
    figure.prototype.generateSteps = function (position) {
        var s = [];
        for (var m in this._buildSteps) {
            var dir = this._buildSteps[m];
            var x = 0, y = 0;
            for (var i = 0; i <= board.fields.length; i++) {
                x += dir[0];
                y += dir[1];
                var intent = this.isMovable([position[0] + x, position[1] + y]);
                if (intent.info !== "out of range") {
                    s.push([x, y]);
                }
                if (intent.info === "gegner schlagen" || intent.info === "eigene Figur") {
                    break;
                }
            }
        }
        return s;
    };
    figure.prototype.getMoves = function (position) {
        var moves = [];
        var steps = (_a = this.steps).concat.apply(_a, this.generateSteps(position));
        for (var m in steps) {
            var move = this.isMovable([
                this.position[0] + steps[m][0],
                this.position[1] + steps[m][1]
            ]);
            if (move.info !== "out of range") {
                moves.push(move);
            }
        }
        return moves;
        var _a;
    };
    return figure;
}());
if (typeof window === "undefined")
    window = global;
var chess = /** @class */ (function () {
    function chess() {
    }
    chess.start = function () {
        return new board(this.defaultBoard);
    };
    chess.defaultBoard = '{"fields":[[{"color":1,"type":"tower"},{"color":1,"type":"knight"},{"color":1,"type":"bishop"},{"color":1,"type":"queen"},{"color":1,"type":"king"},{"color":1,"type":"bishop"},{"color":1,"type":"knight"},{"color":1,"type":"tower"}],[{"color":1,"type":"pawn"},{"color":1,"type":"pawn"},{"color":1,"type":"pawn"},{"color":1,"type":"pawn"},{"color":1,"type":"pawn"},{"color":1,"type":"pawn"},{"color":1,"type":"pawn"},{"color":1,"type":"pawn"}],[false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false],[{"color":0,"type":"pawn"},{"color":0,"type":"pawn"},{"color":0,"type":"pawn"},{"color":0,"type":"pawn"},{"color":0,"type":"pawn"},{"color":0,"type":"pawn"},{"color":0,"type":"pawn"},{"color":0,"type":"pawn"}],[{"color":0,"type":"tower"},{"color":0,"type":"knight"},{"color":0,"type":"bishop"},{"color":0,"type":"queen"},{"color":0,"type":"king"},{"color":0,"type":"bishop"},{"color":0,"type":"knight"},{"color":0,"type":"tower"}]],"moves":[],"lost":[]}';
    return chess;
}());
var game = chess.start();
console.log(game.getAsJson());
console.log(game.moveFigure([1, 1], [1, 2]));
console.log(game.getAsJson());
var Figures;
(function (Figures) {
    var bishop = /** @class */ (function (_super) {
        __extends(bishop, _super);
        function bishop() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.name = "Läufer";
            _this._buildSteps = [[1, 1], [-1, 1], [1, -1], [-1, -1]];
            return _this;
        }
        return bishop;
    }(figure));
})(Figures || (Figures = {}));
var Figures;
(function (Figures) {
    var king = /** @class */ (function (_super) {
        __extends(king, _super);
        function king(color, position) {
            var _this = _super.call(this, color, position) || this;
            _this.position = position;
            _this.name = "König";
            _this.steps = [[0, 1], [1, 1], [1, 0], [0, -1], [-1, -1], [-1, 0], [-1, 1], [1, -1]];
            if (_this.color === "black") {
                _this.steps = [[0, -1]];
            }
            return _this;
        }
        king.prototype.getMoves = function (position) {
            var moves = _super.prototype.getMoves.call(this, position);
            var starter = (this.color === "white") ? 1 : 6;
            var direction = (this.color === "white") ? 2 : -2;
            if (this.position[1] == starter) {
                moves.push([this.position[0], this.position[1] + direction]);
            }
            return moves;
        };
        return king;
    }(figure));
})(Figures || (Figures = {}));
var Figures;
(function (Figures) {
    var knight = /** @class */ (function (_super) {
        __extends(knight, _super);
        function knight() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.name = "Pferd";
            _this._buildSteps = [[1, 2], [2, 1], [-2, 1], [2, -1], [-1, 2], [1, -2], [-1, -2], [-2, -1]];
            return _this;
        }
        return knight;
    }(figure));
})(Figures || (Figures = {}));
var Figures;
(function (Figures) {
    var pawn = /** @class */ (function (_super) {
        __extends(pawn, _super);
        function pawn(color, position) {
            var _this = _super.call(this, color, position) || this;
            _this.position = position;
            _this.name = "Bauer";
            _this.steps = [[0, 1]];
            if (_this.color === "black") {
                _this.steps = [[0, -1]];
            }
            return _this;
        }
        pawn.prototype.getMoves = function (position) {
            var moves = _super.prototype.getMoves.call(this, position);
            var starter = (this.color === "white") ? 1 : 6;
            var direction = (this.color === "white") ? 2 : -2;
            if (this.position[1] == starter) {
                moves.push([this.position[0], this.position[1] + direction]);
            }
            return moves;
        };
        return pawn;
    }(figure));
})(Figures || (Figures = {}));
var Figures;
(function (Figures) {
    var queen = /** @class */ (function (_super) {
        __extends(queen, _super);
        function queen() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.name = "Dame";
            _this._buildSteps = [[1, 1], [-1, 1], [1, -1], [-1, -1], [1, 0], [0, 1], [-1, 0], [0, -1]];
            return _this;
        }
        return queen;
    }(figure));
})(Figures || (Figures = {}));
var Figures;
(function (Figures) {
    var tower = /** @class */ (function (_super) {
        __extends(tower, _super);
        function tower() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.name = "Turm";
            _this._buildSteps = [[1, 0], [0, 1], [-1, 0], [0, -1]];
            return _this;
        }
        return tower;
    }(figure));
})(Figures || (Figures = {}));
//# sourceMappingURL=app.js.map