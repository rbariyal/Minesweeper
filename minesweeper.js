var board = [];
var rows = 8;
var cols = 8;

var minescount = 10;
var mineslocation = [];

var tilesClicked = 0;
var flagEnabled = false;
var gameOver = false;

window.onload = function () {
    startGame();
};


function Newgame()
{

    location.reload();
}
function startGame() {
    document.getElementById("mines-count").innerHTML = minescount;
    document.getElementById("flag-button").addEventListener("click", setFlag);
    document.getElementById("new-game").addEventListener("click",Newgame);
    setMines();
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < cols; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString(); //<div id ="0-0"></div>
            tile.addEventListener("click", clickTile);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
    console.log(board);
}

function setMines() {
    //   mineslocation.push("2-2");
    //   mineslocation.push("1-1");
    //   mineslocation.push("3-4");
    //   mineslocation.push("2-3");
    //   mineslocation.push("5-6");

    let minesleft = minescount;

    while (minesleft > 0) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * cols);
        let id = r.toString() + "-" + c.toString();

        if (!mineslocation.includes(id)) {
            mineslocation.push(id);
            minesleft -= 1;
        }
    }
}

function setFlag() {
    if (flagEnabled) {
        flagEnabled = false;
        document.getElementById("flag-button").style.backgroundColor = "Lightgray";
    } else {
        flagEnabled = true;
        document.getElementById("flag-button").style.backgroundColor = "darkgray";
    }
}

function clickTile() {
    if (gameOver ) {
        return;
    }
    
    let tile = this;

    let cords = tile.id.split("-");
    let r = parseInt(cords[0]);
    let c = parseInt(cords[1]);
    if (flagEnabled) {
        if (tile.innerText == "") {
            tile.innerText = "🚩";
            board[r][c].classList.add("tile-clicked");
        } 
        else if (tile.innerText == "🚩") {
            tile.innerText = "";
            board[r][c].classList.remove("tile-clicked");
        }
        return;
    }
    if (mineslocation.includes(tile.id)) {
        revealtiles();
        // alert("Game Over");
        gameOver = true;
        return;
    }

    // let cords = tile.id.split("-");
    // let r = parseInt(cords[0]);
    // let c = parseInt(cords[1]);
    checkmines(r, c);
}

function revealtiles() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let tile = board[r][c];
            if (mineslocation.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";
            }
        }
    }
}

function checkmines(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) {
        return;
    }
    if (board[r][c].classList.contains("tile-clicked")) {
        return;
    }

    board[r][c].classList.add("tile-clicked");
    let minesfound = 0;
    tilesClicked += 1;
    //top3
    minesfound += checkTile(r - 1, c - 1);
    minesfound += checkTile(r - 1, c);
    minesfound += checkTile(r - 1, c + 1);

    //left and right
    minesfound += checkTile(r, c - 1);
    minesfound += checkTile(r, c + 1);

    //bottom 3
    minesfound += checkTile(r + 1, c - 1);
    minesfound += checkTile(r + 1, c);
    minesfound += checkTile(r + 1, c + 1);

    if (minesfound > 0) {
        board[r][c].innerText = minesfound;
        board[r][c].classList.add("x" + minesfound.toString());
    } else {
        //top 3
        checkmines(r - 1, c - 1);
        checkmines(r - 1, c);
        checkmines(r - 1, c + 1);

        //left and right
        checkmines(r, c - 1);
        checkmines(r, c + 1);

        //bottom 3

        checkmines(r + 1, c - 1);
        checkmines(r + 1, c);
        checkmines(r + 1, c + 1);
    }
    if (tilesClicked == rows * cols - minescount) {
        document.getElementById("mines-count").innerText == "Mines Cleared";
        gameOver = true;
    }
}

function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) {
        return 0;
    }
    if (mineslocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}

