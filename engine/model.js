import { randomTetromino } from "./tetrominos.js";

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const POINTS = {
    SINGLE: 100,
    DOUBLE: 300,
    TRIPLE: 500,
    TETRIS: 800,
    SOFT_DROP: 1,
    HARD_DROP: 8
}

const LINES = {
    0: 5,
    1: 6,
    2: 7,
    3: 8,
    4: 9,
    5: 10,
    6: 15,
    7: 20,
    8: 25,
    9: 30,
    10: 35,
    11: 40,
    12: 45,
    13: 50,
    14: 100,
    15: 100
}

export default function Model() {

    this.getEmptyBoard = function() {

        let rv = [];
        for (let row = 0; row < BOARD_HEIGHT; row++) {
            let cellRow = [];
            for (let col = 0; col < BOARD_WIDTH; col++) {
                cellRow.push(new Cell(0,0));
            }
            rv.push(cellRow);
        }
        return rv;
    }

    this.isEmpty = function(x,y) {
        return gameBoard[y][x].getValue() === 0;
    }

    this.insideBoard = function(x,y) {
        return (
            0 <= x && x <= 9 &&
            0 <= y && y <= 19
        );
    }

    this.isValid = function(piece) {

        return piece.shape.every((row,dy) => {
            return row.every((value, dx) => {
                let x = piece.x + dx;
                let y = piece.y + dy;
                return (
                    value == 0 || (this.insideBoard(x,y) && this.isEmpty(x,y))
                );
            })
        })
    }

    this.generateTetromino = function() {
        return new Tetromino(randomTetromino());
    }

    let state = Model.State.STOPPED;
    let score = 0;
    let gameBoard = this.getEmptyBoard();
    let tetromino = this.generateTetromino();
    let nextTetromino = this.generateTetromino();
    let level = 0;
    let lines = LINES[0];
    let speed = 1;

    let startObservers = [];
    this.onStart = function(callback) {
        startObservers.push(callback)
    }

    this.start = function() {
        if (state != Model.State.STOPPED) this.reset();
        tetromino.render(gameBoard, true);
        startObservers.forEach((o) => {
            o(state);
        })
        state = Model.State.IN_PROGRESS;
    }

    let loseObservers = [];
    this.onLose = function(callback) {
        loseObservers.push(callback);
    }

    this.lose = function() {
        state = Model.State.LOST;
        loseObservers.forEach((o) => {
            o();
        })
    }

    this.getHeight = function() {
        return BOARD_HEIGHT;
    }
    this.getWidth = function() {
        return BOARD_WIDTH;
    }
    this.getState =function() {
        return state;
    }

    this.getScore = function() {
        return score;
    }

    this.getGameBoard = function() {
        return gameBoard;
    }

    this.getSpeed = function() {
        return speed;
    }
    this.getLevel = function() {
        return level;
    }

    this.getTetromino = function() {
        return nextTetromino;
    }

    this.reset = function() {
        score = 0;
        level = 0;
        lines = LINES[0];
        speed = 1;
        this.clearBoard();
        tetromino = this.generateTetromino();
        nextTetromino = this.generateTetromino();
    }

    this.clearBoard = function() {
        for (let i=0; i < BOARD_HEIGHT; i++) {
            for (let j=0; j < BOARD_WIDTH; j++) {
                gameBoard[i][j].clear();
            }
        }
    }

    let moveObservers = [];
    this.onMove = function(callback) {
        moveObservers.push(callback);
    }

    let freezeObservers = [];
    this.onFreeze = function(callback) {
        freezeObservers.push(callback);
    }



   this.rotate = function(tetromino) {
        // clone tetromino, perform rotation, reverse columsn, and return tetromino

        let clone = JSON.parse(JSON.stringify(tetromino));

        for (let i = 0; i < tetromino.length; i++) {
            for (let j = 0; j < i; j++) {
                let tmp = clone[i][j];
                clone[i][j] = clone[j][i];
                clone[j][i] = tmp;      
            }
        }

        clone.forEach(row => row.reverse());
        return clone;
    }


    this.move = function(direction) {

        let piece = null;

        if (direction == "up") {
            piece = {...tetromino, shape: this.rotate(tetromino.shape)}
        } else if (direction == "left") {
            piece = {...tetromino, x:tetromino.x - 1}
        } else if (direction == "right") {
            piece = {...tetromino, x:tetromino.x + 1}
        } else if (direction == "down") {
            piece = {...tetromino, y:tetromino.y + 1}
        } 

        if (this.isValid(piece)) {
            tetromino.clear(gameBoard);
            tetromino.move(piece);
            if (this.checkFreeze()) {
                score += POINTS.SOFT_DROP;
                this.freeze();
            } else {
                tetromino.render(gameBoard, true);
            }
        }

        moveObservers.forEach((l) => {
            l(this);
        })
    }

    let clearLineObservers = [];
    this.onClearLine = function(callBack) {
        clearLineObservers.push(callBack);
    }


    this.clearLines = function() {
        let rows_cleared = 0
        gameBoard.forEach((row, y) => {
            if (row.every(cell => cell.getValue() != 0)) {
                let removed = gameBoard.splice(y,1)[0];
                removed.forEach((cell) => {
                    cell.clear();
                })
                gameBoard.unshift(removed);
                rows_cleared++;
                clearLineObservers.forEach((o) => {
                    o(y);
                });

            }
        });
        switch (rows_cleared) {
            case 1:
                score += POINTS.SINGLE;
            case 2:
                score += POINTS.DOUBLE;
            case 3:
                score += POINTS.TRIPLE;
            case 4:
                score += POINTS.TETRIS;
        }
        lines = Math.max(0, lines - rows_cleared);
        if (lines == 0) {
            // increase level
            level += 1;
            lines = LINES[Math.min(15, level)];
            speed -= 0.05;
        }
    }

    this.isOver = function() {
        return tetromino.y === 0;
    }

    this.freeze = function() {
        /* render current tetromino and create a new one */
        tetromino.render(gameBoard,false);
        if (this.isOver()) {
            this.lose();
        }
        this.clearLines();
        this.getNextTetromino();
        if (tetromino) {
            tetromino.render(gameBoard, true);
            freezeObservers.forEach((o) => {
                o(this);
            });
        }
    }

    this.checkFreeze = function() {
        //return (tetromino.findBottomRow() == BOARD_HEIGHT - 1 || 
        let piece = {...tetromino, y:tetromino.y + 1}
        return !this.isValid(piece)

    }

    this.getNextTetromino = function () {
        if (this.isValid(nextTetromino)) {
            tetromino = nextTetromino;
            nextTetromino = this.generateTetromino();
        } else {
            tetromino = null;
            nextTetromino = null;
            this.lose();
        }
    }


    this.hardDrop = function() {
        if (tetromino) {
            let piece = {...tetromino, y:tetromino.y + 1}
            while (this.isValid(piece)) {
                tetromino.clear(gameBoard);
                tetromino.move(piece);
                piece = {...tetromino, y:tetromino.y + 1}
            }
            this.freeze();
            score += POINTS.HARD_DROP;
            moveObservers.forEach((l) => {
                l(this);
            })
        }
    }



}

Model.State = {
    STOPPED: 2,
    IN_PROGRESS: 1,
    LOST: 0
}

let Cell = function(value, ID) {

    let state = value != 0 ? Cell.State.FULL : Cell.State.EMPTY;
    let colorID = ID;
    let cellObservers = [];

    this.addObservers = function(callback) {
        cellObservers.push(callback);
    }

    let update = () => {
        cellObservers.forEach((o) => {
            o(this);
        })
    }

    this.getValue = function() { 
        if (this.isHidden()) {
            return 0;
        } else {
            return value;
        }

    }
    this.setValue = function(new_value) {
        value = new_value
        update();
    }
    this.getState = function() {return state}
    this.getColor = function() {return colorID}
    this.setColor = function(new_colorID) {
        colorID = new_colorID
        update();
        }

    this.clear = function() {
        value = 0;
        colorID = 0;
        this.unhide();
        update();
    }

    this.hide = function() {
        this.state = Cell.State.HIDDEN;
    }
    this.unhide = function() {
        this.state = Cell.State.UNHIDDEN;
    }

    this.isHidden = function() {
        return this.state == Cell.State.HIDDEN;
    }


}
Cell.State = {
    HIDDEN: 0,
    UNHIDDEN: 1
}

let Tetromino = function(obj) {

    this.shape = obj.shape;
    this.color = obj.color;
    this.x = 3;
    this.y = 0;


    this.getColor = function() {
        return this.color;
    }

    /* may to change into a function cmponentnet */
    this.render = function(gameBoard, hidden) {

        for (let row = 0; row < this.shape.length; row++) {
            for (let col = 0; col < this.shape.length; col++) {
                if (this.shape[row][col] != 0) {
                    gameBoard[this.y + row][this.x + col].setValue(this.shape[row][col]);
                    gameBoard[this.y + row][this.x + col].setColor(this.color);
                    if (hidden){
                        gameBoard[this.y + row][this.x + col].hide();
                    }
                }
            }
        }
    }
    this.clear = function(gameBoard) {

        for (let row = 0; row < this.shape.length; row++) {
            for (let col = 0; col < this.shape.length; col++) {
                if (this.shape[row][col] != 0) {
                    gameBoard[this.y + row][this.x + col].clear();
                }
            }
        }

    }


    this.move = function(piece) {

        this.x = piece.x;
        this.y = piece.y;
        this.shape = piece.shape;

    }


    this.findBottomRow = function() {

        let bottom = 0;
        for (let i = 0; i < this.shape.length; i++) {
            for (let j = 0; j < this.shape.length; j++) {
                if (this.shape[i][j] != 0) {
                    bottom = i;
                }
            }
        }
        return bottom + this.y;
    }
}