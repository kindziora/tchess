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
var chess = /** @class */ (function () {
    function chess() {
    }
    chess.start = function () {
        return true;
    };
    return chess;
}());
chess.start();
var board = /** @class */ (function () {
    function board(json) {
    }
    board.prototype.getField = function (position) {
        return this.fields[position[0]][position[1]];
    };
    board.prototype.loadFromJson = function (json) {
        return [];
    };
    board.prototype.saveAsJson = function () {
        return "";
    };
    return board;
}());
var figure = /** @class */ (function () {
    function figure(color, position) {
        this.color = color;
        this.position = position;
        this.name = "figure";
        this.steps = [[0, 1]];
    }
    figure.prototype.move = function (position) {
        return this.isMovable(position);
    };
    figure.prototype.isMovable = function (position) {
        var field = this.board.getField(position);
        var result = { movable: true, info: "", position: position };
        if (!field) {
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
    figure.prototype.getMoves = function () {
        var moves = [];
        for (var m in this.steps) {
            var move = this.isMovable([
                this.position[0] + this.steps[m][0],
                this.position[1] + this.steps[m][1]
            ]);
            if (move.info !== "out of range") {
                moves.push(move);
            }
        }
        return moves;
    };
    return figure;
}());
var pawn = /** @class */ (function (_super) {
    __extends(pawn, _super);
    function pawn() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "Bauer";
        _this.steps = [[0, 1]];
        return _this;
    }
    pawn.prototype.getMoves = function () {
        var moves = _super.prototype.getMoves.call(this);
        if (this.position[1] == 7) {
            moves.push([this.position[1], this.position[1] - 2]);
        }
        return moves;
    };
    return pawn;
}(figure));
var tower = /** @class */ (function (_super) {
    __extends(tower, _super);
    function tower() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "Bauer";
        _this.steps = [[0, 1]];
        return _this;
    }
    tower.prototype.getMoves = function () {
        var moves = _super.prototype.getMoves.call(this);
        if (this.position[1] == 7) {
            moves.push([this.position[1], this.position[1] - 2]);
        }
        return moves;
    };
    return tower;
}(figure));
//# sourceMappingURL=app.js.map