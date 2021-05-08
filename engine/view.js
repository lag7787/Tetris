import getQuote from "./getQuote.js";
import getCat from "./getCat.js";

const COLORS = {

    0: 'white',
    1: '#0341AE',
    2: '#72CB3B',
    3: '#FFD500',
    4: '#FF971C',
    5: '#FF3213',
    6: '#00AAB5',
    7: '#EC0C6E'
}

export default function View(model) {

    this.model = model;
    this.div = document.createElement('div');
    this.div.classList.add('gameView');

    let boardContainer = document.createElement('div');
    boardContainer.classList.add('boardContainer');
    let board = document.createElement('div');
    board.classList.add('boardGrid');


    for(let row = 0; row < this.model.getHeight();row++) {
        let rowDiv = document.createElement('div');
        rowDiv.classList.add('gridRow');
        for(let col = 0; col < this.model.getWidth(); col++) {
            let cell = new CellView(model.getGameBoard()[row][col]);
            rowDiv.append(cell.div);
        }
        board.append(rowDiv);
    }

    let viewListeners = [];
    this.KeyPress = function(callback) {
        viewListeners.push(callback);
    }

    window.addEventListener('keydown', (e) => {

        let action = {};

        switch(e.key) {
            case 'ArrowUp':
                action.direction = "up";
                break;
            case 'ArrowRight':
                action.direction = "right";
                break;
            case 'ArrowDown':
                action.direction = "down";
                break;
            case 'ArrowLeft':
                action.direction = "left";
                break;
            case ' ':
                action.direction = "hard";
                break;
        }

        viewListeners.forEach((l) => {
            l(action);
        });

    })

    boardContainer.append(board);
    this.div.append(boardContainer);

    model.onClearLine((index) => {
        let row = board.childNodes.item(index);
        board.prepend(row);
    })

    let loseOverlay = document.createElement('div');
    loseOverlay.classList.add("lose-overlay");
    board.append(loseOverlay);

    let loseText = document.createElement('p');
    loseText.innerHTML = "GAME OVER";
    loseOverlay.append(loseText);

    let imgDiv = document.createElement("div");
    imgDiv.classList.add("img-overlay");
    let img = document.createElement('img');
    img.setAttribute("id", "img");

    imgDiv.append(img);
    this.div.append(imgDiv);

    let header = document.createElement('h1');
    header.innerHTML = "TETRIS";
    header.style.textAlign = "center";

    let score = document.createElement('h2');
    score.innerHTML = `Score: ${this.model.getScore()}`;
    score.style.textAlign = "center";

    let level = document.createElement('h2');
    level.innerHTML = `Level: ${this.model.getScore()}`;
    level.style.textAlign = "center";

    let nextTetro = new TetrominoView(this.model.getTetromino());

    let quoteDiv = document.createElement('div')
    let randomQuote = document.createElement('p');
    let author = document.createElement('h3');
    let promise = getQuote();
    promise.then((value) => {
        randomQuote.innerHTML =  value.data[0]["quote"];
        author.innerHTML = "-" + value.data[0]["author"];
    })
    quoteDiv.append(randomQuote);
    quoteDiv.append(author);


    let playButton = document.createElement('button');
    playButton.innerHTML = "PLAY";
    playButton.classList.add("play-button");
    playButton.addEventListener('click', () => {
        loseOverlay.style.display = "none";
        imgDiv.style.display = "none"
        model.start();
        promise = getQuote();
        promise.then((value) => {
        randomQuote.innerHTML =  value.data[0]["quote"];
        author.innerHTML = "-" + value.data[0]["author"];

        });
    });
    playButton.addEventListener('focus', function() {
        this.blur();
    });


    let sidebar = document.createElement('div');
    sidebar.classList.add('sidebar')
    sidebar.append(header)
    sidebar.append(score);
    sidebar.append(level);
    sidebar.append(nextTetro.div);
    sidebar.append(quoteDiv);
    sidebar.append(playButton);
    boardContainer.append(sidebar);

    this.model.onMove((model) => {
        score.innerHTML = `Score: ${model.getScore()}`
        level.innerHTML = `Level: ${model.getLevel()}`
    });

    this.model.onFreeze((model) => {
        nextTetro.update(model.getTetromino());
    })

    this.model.onLose(() => {

        let promise = getCat();
        promise.then((value) => {
            console.log(value.data[0]["url"]);
            img.src = value.data[0]["url"];
        })

        loseOverlay.style.display = "flex";
        imgDiv.style.display = "flex";

    })

}

let TetrominoView = function(tetromino) {

    this.div = document.createElement('div');
    this.div.classList.add('tetroContainer');
    this.tetromino = document.createElement('div')
    this.tetromino.classList.add('tetromino');

    for(let row = 0; row < tetromino.shape.length;row++) {
        let rowDiv = document.createElement('div');
        rowDiv.classList.add('tetroRow');
        for(let col = 0; col < tetromino.shape.length; col++) {
            let cell = document.createElement('div');
            if (tetromino.shape[row][col] != 0) {
                cell.style.backgroundColor = COLORS[tetromino.getColor()];
                cell.style.border = "1mm ridge rgba(55, 53, 53, 0.359";
            }
            cell.classList.add("tetroCell")
            rowDiv.append(cell);
        }
        this.tetromino.append(rowDiv);
    }

    this.div.append(this.tetromino);

    this.update = function(tetromino){
        let new_tetromino = document.createElement('div');
        new_tetromino.classList.add('tetromino');
        for(let row = 0; row < tetromino.shape.length;row++) {
            let rowDiv = document.createElement('div');
            rowDiv.classList.add('tetroRow');
            for(let col = 0; col < tetromino.shape.length; col++) {
                let cell = document.createElement('div');
                if (tetromino.shape[row][col] != 0) {
                    cell.style.backgroundColor = COLORS[tetromino.getColor()];
                    cell.style.border = "1mm ridge rgba(55, 53, 53, 0.359";
                }
                cell.classList.add("tetroCell")
                rowDiv.append(cell);
            }
            new_tetromino.append(rowDiv);
        }
        this.div.replaceChild(new_tetromino, this.tetromino);
        this.tetromino = new_tetromino;
    }
}

let CellView = function(cell) {

    this.div = document.createElement('div');
    this.div.classList.add('gridItem');
    this.value = cell.getValue();
    this.color = COLORS[cell.getColor()]
    this.div.style.backgroundColor = this.color;
    if (cell.getColor() == 0) {
        this.div.style.border = "none";
    }
    else {
            this.div.style.border = "2mm ridge rgba(55, 53, 53, 0.359";
    }
    
    cell.addObservers((c) => {
        this.div.style.backgroundColor = COLORS[c.getColor()];
        this.value = c.getValue();
        if (c.getColor() == 0) {
            this.div.style.border = "none";
        }
        else {
            this.div.style.border = "2mm ridge rgba(55, 53, 53, 0.359";
        }
    })
}