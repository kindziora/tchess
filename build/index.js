var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Flatted = (function (Primitive, primitive) {
    /*!
     * ISC License
     *
     * Copyright (c) 2018, Andrea Giammarchi, @WebReflection
     *
     * Permission to use, copy, modify, and/or distribute this software for any
     * purpose with or without fee is hereby granted, provided that the above
     * copyright notice and this permission notice appear in all copies.
     *
     * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
     * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
     * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
     * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
     * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
     * OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
     * PERFORMANCE OF THIS SOFTWARE.
     */
    var Flatted = {
        parse: function parse(text, reviver) {
            var input = JSON.parse(text, Primitives).map(primitives);
            var value = input[0];
            var $ = reviver || noop;
            return $('', typeof value === 'object' && value ?
                revive(input, new Set, value, $) :
                value);
        },
        stringify: function stringify(value, replacer, space) {
            for (var firstRun, known = new Map, input = [], output = [], $ = replacer && typeof replacer === typeof input ?
                function (k, v) {
                    if (k === '' || -1 < replacer.indexOf(k))
                        return v;
                } :
                (replacer || noop), i = +set(known, input, $('', value)), replace = function (key, value) {
                if (firstRun) {
                    firstRun = !firstRun;
                    return i < 1 ? value : $(key, value);
                }
                var after = $(key, value);
                switch (typeof after) {
                    case 'object':
                        if (after === null)
                            return after;
                    case primitive:
                        return known.get(after) || set(known, input, after);
                }
                return after;
            }; i < input.length; i++) {
                firstRun = true;
                output[i] = JSON.stringify(input[i], replace, space);
            }
            return '[' + output.join(',') + ']';
        }
    };
    return Flatted;
    function noop(key, value) {
        return value;
    }
    function revive(input, parsed, output, $) {
        return Object.keys(output).reduce(function (output, key) {
            var value = output[key];
            if (value instanceof Primitive) {
                var tmp = input[value];
                if (typeof tmp === 'object' && !parsed.has(tmp)) {
                    parsed.add(tmp);
                    output[key] = $(key, revive(input, parsed, tmp, $));
                }
                else {
                    output[key] = $(key, tmp);
                }
            }
            else
                output[key] = $(key, value);
            return output;
        }, output);
    }
    function set(known, input, value) {
        var index = Primitive(input.push(value) - 1);
        known.set(value, index);
        return index;
    }
    // the two kinds of primitives
    //  1. the real one
    //  2. the wrapped one
    function primitives(value) {
        return value instanceof Primitive ? Primitive(value) : value;
    }
    function Primitives(key, value) {
        return typeof value === primitive ? new Primitive(value) : value;
    }
}(String, 'string'));
var figure = /** @class */ (function () {
    function figure(color, position, board) {
        this.position = position;
        this.board = board;
        this.name = "figure";
        this.steps = [[]];
        this._buildSteps = [];
        this.color = (color === 0) ? 'black' : 'white';
    }
    figure.prototype.move = function (position) {
        var intent = this.isMovable(position);
        if (!this.isInMovables(position)) {
            intent.movable = false;
            intent.info = "nicht erlaubter Schritt";
        }
        if (!this.board.hasTurn(this.color)) {
            intent.movable = false;
            intent.info = "Gegner am Zug";
        }
        if (intent.movable) {
            this.position = position;
        }
        return intent;
    };
    figure.prototype.isInMovables = function (position) {
        return this.getMoves().filter(function (e) { return e.position[0] === position[0] &&
            e.position[1] === position[1]; }).length > 0;
    };
    figure.prototype.isMovable = function (position) {
        var field = this.board.getFigure(position);
        var result = { movable: true, info: "", position: position };
        if (typeof field === "undefined") {
            result.movable = false;
            result.info = "out of range";
        }
        else if (typeof field.name !== "undefined") {
            if (field.color === this.color) {
                result.movable = false;
                result.info = "eigene Figur";
            }
            else {
                result.movable = true;
                result.info = "gegner schlagen";
            }
        }
        else {
            result.movable = true;
            result.info = "leeres Feld";
        }
        return result;
    };
    figure.prototype.generateSteps = function (position) {
        var s = [];
        for (var m in this._buildSteps) {
            var dir = this._buildSteps[m];
            var x = 0, y = 0;
            for (var i = 0; i <= this.board.fields.length; i++) {
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
    figure.prototype.getMoves = function () {
        var moves = [];
        var steps = this.steps.concat(this.generateSteps(this.position));
        var plain;
        this.plainmoves = [];
        for (var m in steps) {
            plain = [
                this.position[0] + steps[m][0],
                this.position[1] + steps[m][1]
            ];
            var move = this.isMovable(plain);
            if (move.info !== "out of range") {
                moves.push(move);
                this.plainmoves.push(plain.join(','));
            }
        }
        return moves;
    };
    return figure;
}());
var Tchess;
(function (Tchess) {
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
    Tchess.bishop = bishop;
})(Tchess || (Tchess = {}));
var Tchess;
(function (Tchess) {
    var king = /** @class */ (function (_super) {
        __extends(king, _super);
        function king() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.name = "König";
            _this.steps = [[0, 1], [1, 1], [1, 0], [0, -1], [-1, -1], [-1, 0], [-1, 1], [1, -1]];
            return _this;
        }
        king.prototype.getMoves = function () {
            var moves = _super.prototype.getMoves.call(this);
            for (var m in moves) {
                var move = moves[m].position.join(',');
                var opponent = (this.color === 'black') ? 'white' : 'black';
                if (this.board.territory[opponent].indexOf(move) !== -1) {
                    moves[m].movable = false;
                    moves[m].info = "spieler im schach";
                }
            }
            return moves;
        };
        return king;
    }(figure));
    Tchess.king = king;
})(Tchess || (Tchess = {}));
var Tchess;
(function (Tchess) {
    var knight = /** @class */ (function (_super) {
        __extends(knight, _super);
        function knight() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.name = "Pferd";
            _this.steps = [[1, 2], [2, 1], [-2, 1], [2, -1], [-1, 2], [1, -2], [-1, -2], [-2, -1]];
            return _this;
        }
        return knight;
    }(figure));
    Tchess.knight = knight;
})(Tchess || (Tchess = {}));
var Tchess;
(function (Tchess) {
    var pawn = /** @class */ (function (_super) {
        __extends(pawn, _super);
        function pawn(color, position, board) {
            var _this = _super.call(this, color, position, board) || this;
            _this.position = position;
            _this.board = board;
            _this.name = "Bauer";
            _this.steps = [[0, 1], [1, 1], [-1, 1]];
            if (_this.color === "black") {
                _this.steps = [[0, -1], [1, -1], [-1, -1]];
            }
            return _this;
        }
        pawn.prototype.getMoves = function () {
            var moves = _super.prototype.getMoves.call(this);
            var me = this;
            var starter = (this.color === "white") ? 1 : 6;
            var direction = (this.color === "white") ? 2 : -2;
            if (this.position[1] == starter) {
                moves.push(this.isMovable([this.position[0], this.position[1] + direction]));
            }
            var m = moves.filter(function (e) {
                return (me.position[0] !== e.position[0] && e.info === "gegner schlagen") ||
                    (me.position[0] === e.position[0] && e.info !== "gegner schlagen");
            });
            return m;
        };
        return pawn;
    }(figure));
    Tchess.pawn = pawn;
})(Tchess || (Tchess = {}));
var Tchess;
(function (Tchess) {
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
    Tchess.queen = queen;
})(Tchess || (Tchess = {}));
var Tchess;
(function (Tchess) {
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
    Tchess.tower = tower;
})(Tchess || (Tchess = {}));
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
        this.territory = {
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
        if (typeof this.fields[position[1]] !== "undefined" &&
            typeof this.fields[position[1]][position[0]] !== "undefined") {
            return this.fields[position[1]][position[0]];
        }
    };
    board.prototype.setFigure = function (position, figure) {
        this.fields[position[1]][position[0]] = figure;
        return true;
    };
    board.prototype.hasTurn = function (color) {
        return (this.moves.length % 2 === 0) && color === "white" || (this.moves.length % 2 > 0) && color === "black";
    };
    /**
     *
     * @param from
     * @param to
     */
    board.prototype.moveFigure = function (from, to) {
        var figure = this.getFigure(from);
        var intent = { movable: false, info: "keine figur" };
        if (figure) {
            intent = figure.move(to);
            var kickedFigure = this.getFigure(to);
            if (intent.movable) {
                if (kickedFigure) {
                    this.lost[kickedFigure.color].push(kickedFigure);
                }
                this.setFigure(to, figure);
                this.setFigure(from, false);
                this.moves.push([from, to]);
                this.territory[figure.color].push(figure.plainmoves);
            }
        }
        return intent;
    };
    board.prototype.getAsJson = function () {
        var temp = Flatted.parse(Flatted.stringify(this.fields));
        for (var y = 0; y < this.fields.length; y++) {
            for (var x = 0; x < this.fields.length; x++) {
                if (typeof this.fields[y][x] !== "undefined") {
                    temp[y][x] = {
                        type: !this.fields[y][x] ? false : this.fields[y][x].constructor.name,
                        color: (this.fields[y][x].color === 'black') ? 0 : 1
                    };
                }
            }
        }
        return Flatted.stringify({ "fields": temp, "lost": this.lost, "moves": this.moves });
    };
    board.prototype.loadFromJson = function (jso) {
        var imp = Flatted.parse(jso);
        this.fields = Flatted.parse(Flatted.stringify(imp.fields));
        for (var y = 0; y < imp.fields.length; y++) {
            for (var x = 0; x < imp.fields.length; x++) {
                if (typeof imp.fields[y][x].type !== "undefined" && typeof imp.fields[y][x].type.length !== "undefined") {
                    this.fields[y][x] = new Tchess[imp.fields[y][x].type](imp.fields[y][x].color, [x, y], this);
                    this.fields[y][x].getMoves();
                    this.territory[this.fields[y][x].color].push(this.fields[y][x].plainmoves);
                }
                else {
                    this.fields[y][x] = false;
                }
            }
        }
        this.moves = imp.moves;
        this.lost = imp.lost;
    };
    return board;
}());
var Tchess;
(function (Tchess) {
    var game = /** @class */ (function () {
        function game() {
        }
        game.start = function (boardString) {
            return new board(boardString ? boardString : this.defaultBoard);
        };
        game.defaultBoard = '[{"fields":[[{"color":1,"type":"tower"},{"color":1,"type":"knight"},{"color":1,"type":"bishop"},{"color":1,"type":"queen"},{"color":1,"type":"king"},{"color":1,"type":"bishop"},{"color":1,"type":"knight"},{"color":1,"type":"tower"}],[{"color":1,"type":"pawn"},{"color":1,"type":"pawn"},{"color":1,"type":"pawn"},{"color":1,"type":"pawn"},{"color":1,"type":"pawn"},{"color":1,"type":"pawn"},{"color":1,"type":"pawn"},{"color":1,"type":"pawn"}],[false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false],[{"color":0,"type":"pawn"},{"color":0,"type":"pawn"},{"color":0,"type":"pawn"},{"color":0,"type":"pawn"},{"color":0,"type":"pawn"},{"color":0,"type":"pawn"},{"color":0,"type":"pawn"},{"color":0,"type":"pawn"}],[{"color":0,"type":"tower"},{"color":0,"type":"knight"},{"color":0,"type":"bishop"},{"color":0,"type":"queen"},{"color":0,"type":"king"},{"color":0,"type":"bishop"},{"color":0,"type":"knight"},{"color":0,"type":"tower"}]],"moves":[],"lost":{"white":[],"black":[]}}]';
        return game;
    }());
    Tchess.game = game;
})(Tchess || (Tchess = {}));
if (typeof module !== "undefined")
    module.exports = Tchess;
//# sourceMappingURL=index.js.map