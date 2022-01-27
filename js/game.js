'use strict';


var gTimer = 0;
var gElTimer;
var gIntervalId;

const FLAG = '🚩';
const SIGN = ' ';
const BOMB = '💣';


var gUpdateText = document.querySelector('h2 span');
var gGame = {};

var gLevel = {
    size: 4,
    mines: 2
}

var gBoard;

function init() {
    buildBoard(gLevel.size)
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        timer: false
    }
    renderBoard(gBoard)

}


function buildBoard(size) {
    gBoard = []
    for (var i = 0; i < size; i++) {
        gBoard[i] = []
        for (var j = 0; j < size; j++) {
            gBoard[i][j] = {
                minesAroundCount: 4,
                isShown: false,
                isMine: false,
                isMarked: false
            };
        };
    };
    // gBoard[1][1].isMine = true;
    // gBoard[2][2].isMine = true;
    createMines(gLevel.mines);
    console.log(gBoard)
    return gBoard;
};


function onClickCell(elCell, i, j) {
    if(!gGame.timer){
        startTimer();
        gGame.timer = true;
    }
    if (!gGame.isOn) return;
    var currCell = gBoard[i][j];
    if (currCell.isMarked) return;
    if (!currCell.isMine && !currCell.isShown) {
        elCell.classList.add('unoccupied')
        elCell.classList.remove('occupied');
        currCell.isShown = true;
        gGame.shownCount++;

        var minesCount = setMinesNegsCount(gBoard, i, j);
        elCell.innerText = minesCount === 0 ? '' : minesCount;
    }
    if (currCell.isMine) {
        elCell.classList.add('unoccupied')
        elCell.classList.remove('occupied');
        elCell.innerText = BOMB;
        gameOver()

    }
    checkWin();

}






function onCellMarked(elCell, i, j) {
    var currCell = gBoard[i][j];
    window.oncontextmenu = function (e) { e.preventDefault() }
    if (!gGame.isOn) return;
    if (currCell.isShown) return;
    if (!currCell.isMarked && !currCell.isShown) {
        elCell.innerText = FLAG;
        currCell.isMarked = true;
        gGame.markedCount++;

    } else {
        elCell.innerText = SIGN;
        currCell.isMarked = false;
        gGame.markedCount--;
    }
    checkWin();
}


function setMinesNegsCount(mat, rowIdx, colIdx) {
    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > mat[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var currCell = mat[i][j]
            if (currCell.isMine) {
                count++
            }
        }
    }
    return count;
}



function createMines(mines) {
    for (var i = 0; i < mines; i++) {
        var emptyCells = getEmptyCell(gLevel.size)
        var emptyCell = emptyCells[getRandomInt(0, emptyCells.length)];


        gBoard[emptyCell.i][emptyCell.j].isMine = true;

    }
}

function getEmptyCell(size) {
    var emptyCells = []
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {

            if (!gBoard[i][j].isMine) {
                emptyCells.push({ i: i, j: j });
            }
        }
    }
    return emptyCells;
};


function onGameOverExplode(elCell) {
    gGame.isOn = false;

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j];
            if (currCell.isMine) {
                var cell = document.querySelector(`.cell-${i}-${j}`);
                cell.classList.add('unoccupied')
                cell.classList.remove('occupied');
                cell.innerText = BOMB;

            }
        }
    }
}

function gameOver() {
    gUpdateText.innerText = 'LOSER'
    onGameOverExplode()
    resetParams()

}


function checkWin() {
    if (gGame.markedCount === 2 && gGame.shownCount === 14) {
        gGame.isOn = false;

        gUpdateText.innerText = 'WIN';
        resetParams()
    }
}

function updateLevel(size, mines) {
    gLevel.size = size;
    gLevel.mines = mines;
    resetParams()
    init();
}

function resetParams() {
    
    var gElTimer = document.querySelector('.timer');
    gElTimer.innerText = 0;
    clearInterval(gIntervalId);
    gGame.timer = false;

}


function restartGame(){
    init();
    resetParams();
    gUpdateText.innerText = '';
}

