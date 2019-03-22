var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
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
            var tmp = typeof value === 'object' && value ?
                revive(input, new Set, value, $) :
                value;
            return $.call({ '': tmp }, '', tmp);
        },
        stringify: function stringify(value, replacer, space) {
            for (var firstRun, known = new Map, input = [], output = [], $ = replacer && typeof replacer === typeof input ?
                function (k, v) {
                    if (k === '' || -1 < replacer.indexOf(k))
                        return v;
                } :
                (replacer || noop), i = +set(known, input, $.call({ '': value }, '', value)), replace = function (key, value) {
                if (firstRun) {
                    firstRun = !firstRun;
                    return value;
                    // this was invoking twice each root object
                    // return i < 1 ? value : $.call(this, key, value);
                }
                var after = $.call(this, key, value);
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
                    output[key] = $.call(output, key, revive(input, parsed, tmp, $));
                }
                else {
                    output[key] = $.call(output, key, tmp);
                }
            }
            else
                output[key] = $.call(output, key, value);
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
        this.fenCode = "0";
        this._moved = false;
        this._history = [];
        this.color = (color === 0) ? 'black' : 'white';
        this._history.push(this.position);
    }
    Object.defineProperty(figure.prototype, "fenChar", {
        get: function () {
            return (this.color === "white") ? this.fenCode.toUpperCase() : this.fenCode.toLowerCase();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(figure.prototype, "history", {
        get: function () {
            return this._history;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     */
    figure.prototype.getOpponentsColor = function () {
        return (this.color === 'black') ? 'white' : 'black';
    };
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
    figure.prototype.moved = function (position, from) {
        this._moved = true;
        this.board.onEvent('enPassant', [-1, -1]);
        this.board.onEvent('halfMove', 1);
    };
    figure.prototype.hasMoved = function () {
        return this._moved;
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
    figure.prototype.getPlainmoves = function () {
        var plainmoves = [];
        var moves = this.getMoves();
        for (var m in moves) {
            var move = moves[m];
            plainmoves.push(move.position.join(','));
        }
        return plainmoves;
    };
    figure.prototype.setPlainmoves = function (moves) {
        this.plainmoves = moves;
    };
    /**
     *
     */
    figure.prototype.canMove = function () {
        var moves = this.getMoves();
        for (var m in moves) {
            if (moves[m].movable) {
                return true;
            }
        }
        return false;
    };
    /**
     *
     * @param position
     */
    figure.prototype.positionInDangerBy = function (position) {
        var opponent = this.getOpponentsColor();
        var areal = this.board.territory[opponent];
        return areal[this.position.join(',')];
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
            _this.fenCode = "b";
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
            _this.fenCode = "k";
            _this.castlingPositions = {
                'white': { "K": { steps: [2, 0], tower: [[0, 0], [5, 0]] }, "Q": { steps: [-2, 0], tower: [[0, 0], [5, 0]] } },
                'black': { "k": { steps: [-2, 0], tower: [[0, 0], [5, 0]] }, "q": { steps: [2, 0], tower: [[0, 0], [5, 0]] } }
            };
            return _this;
        }
        king.prototype.getMoves = function () {
            var castlings = this.board.getCastlingString().split("");
            for (var l in castlings) {
                var c = castlings[l];
                if (typeof this.castlingPositions[this.color][c].steps !== "undefined") {
                    this.steps.push(this.castlingPositions[this.color][c].steps);
                }
            }
            var moves = _super.prototype.getMoves.call(this);
            for (var m in moves) {
                var move = moves[m].position.join(',');
                var opponent = this.getOpponentsColor();
                if (this.positionInDangerBy(moves[m].position)) {
                    moves[m].movable = false;
                    moves[m].info = "Spieler im Schach";
                }
            }
            return moves;
        };
        /**
         *
         * @param position
         * @param from
         */
        king.prototype.moved = function (position, from) {
            _super.prototype.moved.call(this, position);
            var distance = from[0] - position[0];
            if (Math.abs(distance) > 1) {
                //castling
                for (var m in this.castlingPositions[this.color].steps) {
                    var moves = this.castlingPositions[this.color].steps[m];
                    if (this.castlingPositions[this.color].steps[m].indexOf(distance) > -1) {
                        var towerFrom = this.castlingPositions[this.color].steps[m].tower[0];
                        var tower_1 = this.board.getFigure(towerFrom);
                        var towerTo = this.castlingPositions[this.color].steps[m].tower[1];
                        this.board.setFigure(towerTo, tower_1);
                        this.board.setFigure(towerFrom, null);
                        this.board.setTerritories(this.board.getTerritories());
                        this.board.onEvent('castling', [from, position, this, m]);
                    }
                }
            }
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
            _this.fenCode = "n";
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
            _this.fenCode = "p";
            _this.changePossible = false;
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
                var firstBeforePawn = this.isMovable([this.position[0], this.position[1] + (direction / 2)]);
                if (firstBeforePawn.info !== "gegner schlagen") {
                    moves.push(this.isMovable([this.position[0], this.position[1] + direction]));
                }
            }
            var enpsPosition = [];
            if (this.board.getEnpassant() !== "-") {
                var byFigure = this.board.getEnpassantFigure();
                if (byFigure.color !== this.color) { //enemy
                    enpsPosition = this.board.fenPositionToArrayCoordinates(this.board.getEnpassant());
                }
            }
            var m = moves.filter(function (e) {
                return (me.position[0] !== e.position[0] && e.info === "gegner schlagen") || // beat enemy
                    (me.position[0] === e.position[0] && e.info !== "gegner schlagen") || // empty field
                    (me.position[0] !== e.position[0] && e.info !== "gegner schlagen" && // enpasse beat enemy
                        enpsPosition.length > 0 && e.position[0] === enpsPosition[0] &&
                        e.position[1] === enpsPosition[1]);
            });
            return m;
        };
        /**
         * check if end was reached
         * @param position
         */
        pawn.prototype.moved = function (position, from) {
            //super.moved(position);
            //this.board.onEvent('enPassant', [-1, -1]);
            this.board.onEvent('halfMove', 1);
            var end = (this.color === "white") ? 7 : 0;
            if (position[1] === end) {
                this.board.onEvent('pawnReachEnd', this);
                this.changePossible = true;
            }
            var enpsPosition = [];
            if (this.board.getEnpassant() !== "-") {
                enpsPosition = this.board.fenPositionToArrayCoordinates(this.board.getEnpassant());
                if (position[0] === enpsPosition[0] && position[1] === enpsPosition[1]) {
                    // kill the figure related to the enpasse
                    this.board.lost[this.board.getEnpassantFigure().color].push(this.board.getEnpassantFigure());
                    this.board.setFigure(this.board.getEnpassantFigure().position, false);
                }
            }
            var distance = from[1] > position[1] ? from[1] - position[1] : position[1] - from[1];
            if (Math.abs(distance) > 1) {
                //enpassant
                this.board.onEvent('enPassant', [position[0], position[1] + (from[1] > position[1] ? 1 : -1), this]);
            }
            else {
                this.board.onEvent('enPassant', [-1, -1]);
            }
            if (from[0] - position[0] === 0) {
                this.board.onEvent('halfMove', 0);
            }
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
            _this.fenCode = "q";
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
            _this.fenCode = "r";
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
        this.color = {
            "white": null,
            "black": null
        };
        this.lost = {
            "white": [],
            "black": []
        };
        this.territory = {
            "white": {},
            "black": {}
        };
        this.winner = null;
        this._enpassant = {
            fen: "-",
            by: null
        };
        this._halfMove = 0;
        this._fullmoves = 1;
        this._castlingString = "-";
        this._fen = "";
        this.events = { 'pawnReachEnd': [], 'check': [], 'checkmate': [], 'castling': [], 'move': [], 'update': [], 'enPassant': [], 'halfMove': [] };
        this.loadFromJson(json);
        this.on('checkmate', function (figure) {
            this.setWinner(this.color[figure.getOpponentsColor()]);
        });
        this.on('enPassant', function (position) {
            this._enpassant = {
                "fen": this.boardPositionToFen(position),
                "by": position[2]
            };
        });
        this.on('halfMove', function (order) {
            this._halfMove = order === 0 ? 0 : this._halfMove + order;
        });
    }
    /**
     *
     */
    board.prototype.getWinner = function () {
        return this.winner;
    };
    /**
     *
     * @param winner
     */
    board.prototype.setWinner = function (winner) {
        this.winner = winner;
    };
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
        figure.position = position;
        this.fields[position[1]][position[0]] = figure;
        return true;
    };
    board.prototype.hasTurn = function (color) {
        return (this.moves.length % 2 === 0) && color === "white" || (this.moves.length % 2 > 0) && color === "black";
    };
    board.prototype.hasLost = function (color) {
        var figures = this.getFigures(color);
        for (var f in figures) {
            if (figures[f].canMove()) {
                return false;
            }
        }
        this.onEvent('checkmate', this.getKing(color));
        return true;
    };
    /**
     * events: ['pawnReachEnd','check', 'checkmate', 'castling', 'moved', 'update']
     * @param type
     * @param figure
     */
    board.prototype.onEvent = function (type, figure) {
        for (var evts in this.events[type]) {
            this.events[type][evts].call(this, figure);
        }
        for (var evts in this.events['update'])
            this.events['update'][evts].call(this, { "type": type, data: figure });
    };
    /**
    * events: ['pawnReachEnd','check', 'checkmate', 'castling', 'moved', 'update']
    */
    board.prototype.on = function (eventName, callback) {
        if (typeof this.events[eventName] === "undefined") {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
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
                if (figure.color === "black") {
                    this._fullmoves++;
                }
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
                this._fen = this.getAsFEN();
                var castling = this.getCasting();
                if (castling !== "-") {
                    this.onEvent('castling', castling);
                }
                this.hasLost('black');
                this.hasLost('white');
            }
        }
        return intent;
    };
    /**
     *
     * @param color
     * @param index
     * @param to
     */
    board.prototype.reviveFigure = function (color, index, to) {
        var figureToReplace = this.getFigure(to);
        if (figureToReplace.constructor.name === 'pawn' && figureToReplace.changePossible) {
            //change
            this.setFigure(to, this.lost[color][index]);
            this.lost[color].splice(index, 1);
            this.setTerritories(this.getTerritories());
            this.hasLost('black');
            this.hasLost('white');
        }
    };
    /**
     *
     */
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
        var colors = ["black", "white"];
        var lost = { "black": [], "white": [] };
        for (var e in colors) {
            for (var i in this.lost[colors[e]]) {
                lost[colors[e]].push({
                    type: this.lost[colors[e]][i].constructor.name,
                    color: (this.lost[colors[e]][i].color === 'black') ? 0 : 1
                });
            }
        }
        return JSON.stringify([{ "fields": temp, "lost": lost, "moves": this.moves, "color": this.color }]);
    };
    /**
     *
     * @param territory
     */
    board.prototype.setTerritories = function (territory) {
        this.territory = territory;
    };
    /**
     *
     * @param color
     */
    board.prototype.getKing = function (color) {
        return this.getFigureByTypeAndColor(color, "König");
    };
    /**
     *
     * @param color
     * @param type
     */
    board.prototype.getFigureByTypeAndColor = function (color, type) {
        return this.getFigures(color).filter(function (f) { return f.name === type; })[0];
    };
    /**
     *
     * @param color
     * @param type
     */
    board.prototype.getFiguresByTypeAndColor = function (color, type) {
        return this.getFigures(color).filter(function (f) { return f.name === type; });
    };
    /**
     *
     * @param color
     */
    board.prototype.getFigures = function (color) {
        var figures = [];
        for (var y = 0; y < this.fields.length; y++) {
            for (var x = 0; x < this.fields.length; x++) {
                if (typeof this.fields[y][x].getPlainmoves !== "undefined") {
                    if (this.fields[y][x].color === color) {
                        figures.push(this.fields[y][x]);
                    }
                }
            }
        }
        return figures;
    };
    board.prototype.getTerritories = function () {
        var territory = {
            "white": {},
            "black": {}
        };
        for (var y = 0; y < this.fields.length; y++) {
            for (var x = 0; x < this.fields.length; x++) {
                if (typeof this.fields[y][x].getPlainmoves !== "undefined") {
                    var plainmoves = this.fields[y][x].getPlainmoves();
                    for (var i in plainmoves) {
                        var pm = plainmoves[i];
                        territory[this.fields[y][x].color][pm] = [y, x];
                    }
                }
            }
        }
        return territory;
    };
    board.prototype.loadFromJson = function (jso) {
        var imp = Flatted.parse(jso);
        this.fields = Flatted.parse(Flatted.stringify(imp.fields));
        for (var y = 0; y < imp.fields.length; y++) {
            for (var x = 0; x < imp.fields.length; x++) {
                if (typeof imp.fields[y][x].type !== "undefined" && imp.fields[y][x].type) {
                    this.fields[y][x] = new Tchess[imp.fields[y][x].type](imp.fields[y][x].color, [x, y], this);
                    this.fields[y][x].getMoves();
                    var plainmoves = this.fields[y][x].getPlainmoves();
                    for (var i in plainmoves) {
                        var pm = plainmoves[i];
                        this.territory[this.fields[y][x].color][pm] = [y, x];
                    }
                }
                else {
                    this.fields[y][x] = false;
                }
            }
        }
        this.moves = imp.moves;
        var lost = { "black": [], "white": [] };
        var colors = ["black", "white"];
        for (var e in colors) {
            var ei = colors[e];
            for (var i in imp.lost[ei]) {
                lost[ei][i] = new Tchess[imp.lost[ei][i].type](imp.lost[ei][i].color, [0, 0], this);
            }
        }
        this.color = imp.color;
        this.lost = lost;
    };
    board.prototype.getAsFEN = function () {
        var FEN = [];
        for (var y = 0; y < this.fields.length; y++) {
            var row = "", fc = "0";
            for (var x = 0; x < this.fields[y].length; x++) {
                // @ts-ignore
                fc = typeof this.fields[y][x] === "object" ? this.fields[y][x].fenChar : !isNaN(1 + parseInt(fc)) ? 1 + parseInt(fc) : 1;
                if (typeof this.fields[y][x] === "object") {
                    row += fc;
                }
                else {
                    if (typeof this.fields[y][1 + x] === "object" || 1 + x === this.fields.length) {
                        row += fc;
                    }
                }
            }
            FEN.push(row);
        }
        return FEN.reverse().join('/') + (" " + (this.hasTurn('white') ? 'w' : 'b') + " " + this.getCasting() + " " + this.getEnpassant() + " " + this.getHalfmoves() + " " + (this.moves.length === 0 ? 1 : this.getFullmoves()));
    };
    ;
    board.prototype.getCastlingForColor = function (color) {
        var castlingString = "";
        var king = this.getFigureByTypeAndColor(color, "König");
        var tower = this.getFiguresByTypeAndColor(color, "Turm");
        var castlingMappings = { 3: (color === "white") ? "K" : "k", 4: (color === "white") ? "Q" : "q" };
        var territories = this.getTerritories();
        var opponent = (color === "white") ? "black" : "white";
        //has king moved?
        if (king.hasMoved()) {
            return "";
        }
        //king in mate position?
        if (typeof territories[opponent][king.position.join(',')] !== "undefined") {
            return "";
        }
        for (var t in tower) {
            var dist = king.position[0] > tower[t].position[0] ? king.position[0] - tower[t].position[0] : tower[t].position[0] - king.position[0];
            var y = king.position[1];
            var cnt = 0;
            var max = Math.max(king.position[0], tower[t].position[0]);
            var min = Math.min(king.position[0], tower[t].position[0]);
            for (var inBetween = min + 1; inBetween <= max; inBetween++) {
                cnt++;
                if (king.position[0] != inBetween && tower[t].position[0] != inBetween) {
                    if (this.getFigure([inBetween, y])) {
                        //no figures in between king and tower? 
                        castlingMappings[Math.abs(dist)] = "";
                    }
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
    };
    board.prototype.getCasting = function () {
        var castlingInfo = this.getCastlingForColor("white") + this.getCastlingForColor("black");
        this._castlingString = castlingInfo !== "" ? castlingInfo : "-";
        return this._castlingString;
    };
    board.prototype.getCastlingString = function () {
        return this._castlingString;
    };
    board.prototype.getEnpassant = function () {
        return this._enpassant.fen;
    };
    board.prototype.getEnpassantFigure = function () {
        return this._enpassant.by;
    };
    board.prototype.getHalfmoves = function () {
        return "" + this._halfMove;
    };
    board.prototype.getFullmoves = function () {
        return "" + this._fullmoves;
    };
    /**
     *
     * @param position
     */
    board.prototype.boardPositionToFen = function (position) {
        return (position[0] != -1) ? "abcdefgh"[position[0]] + (position[1] + 1) : "-";
    };
    board.prototype.fenMoveToBoardMove = function (positionMove) {
        var middle = Math.ceil(positionMove.length / 2);
        var from = positionMove.slice(0, middle);
        var to = positionMove.slice(middle);
        return [this.fenPositionToArrayCoordinates(from), this.fenPositionToArrayCoordinates(to)];
    };
    board.prototype.fenPositionToArrayCoordinates = function (positionString) {
        function alphabetPosition(str) {
            var arr = "abcdefgh".split("");
            return str.replace(/[a-z]/ig, function (m) { return arr.indexOf(m.toLowerCase()); });
        }
        return [parseInt(alphabetPosition(positionString[0])), parseInt(positionString[1]) - 1];
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
        game.defaultBoard = '[{"fields":[[{"color":1,"type":"tower"},{"color":1,"type":"knight"},{"color":1,"type":"bishop"},{"color":1,"type":"queen"},{"color":1,"type":"king"},{"color":1,"type":"bishop"},{"color":1,"type":"knight"},{"color":1,"type":"tower"}],[{"color":1,"type":"pawn"},{"color":1,"type":"pawn"},{"color":1,"type":"pawn"},{"color":1,"type":"pawn"},{"color":1,"type":"pawn"},{"color":1,"type":"pawn"},{"color":1,"type":"pawn"},{"color":1,"type":"pawn"}],[false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false],[{"color":0,"type":"pawn"},{"color":0,"type":"pawn"},{"color":0,"type":"pawn"},{"color":0,"type":"pawn"},{"color":0,"type":"pawn"},{"color":0,"type":"pawn"},{"color":0,"type":"pawn"},{"color":0,"type":"pawn"}],[{"color":0,"type":"tower"},{"color":0,"type":"knight"},{"color":0,"type":"bishop"},{"color":0,"type":"queen"},{"color":0,"type":"king"},{"color":0,"type":"bishop"},{"color":0,"type":"knight"},{"color":0,"type":"tower"}]],"moves":[],"lost":{"white":[],"black":[]},"color":{"white":false,"black":false}}]';
        return game;
    }());
    Tchess.game = game;
})(Tchess || (Tchess = {}));
if (typeof module !== "undefined")
    module.exports = Tchess;
//# sourceMappingURL=index.js.map