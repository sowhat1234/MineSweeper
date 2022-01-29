'use strict';


var gTimer = 0;
var gElTimer;
var gIntervalId;

const FLAG = '🚩';
const SIGN = ' ';
const BOMB = '💣';



var gBoard;
var gUpdateText = document.querySelector('h2 span');
var gUpdateStatus = document.querySelector('h3');
var gUpdateLives = document.querySelector('h4');
var gGame = {};

var gLevel = {
    size: 4,
    mines: 2,
    lives: 1
}


function init() {
    buildBoard(gLevel.size)
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        timer: false
    }
    gUpdateLives.innerText = 'lifes ' + gLevel.lives;
    gUpdateText.innerText = '😊';
    gUpdateStatus.innerText = '';
    renderBoard(gBoard)

}


function buildBoard(size) {
    gBoard = [];
    for (var i = 0; i < size; i++) {
        gBoard[i] = []
        for (var j = 0; j < size; j++) {
            gBoard[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            };
        };
    };
    // gBoard[1][1].isMine = true;
    // gBoard[1][2].isMine = true;
    createMines(gLevel.mines);
    return gBoard;
};


function onClickCell(elCell, i, j) {
    var currCell = gBoard[i][j];
    if (!gGame.timer) {
        startTimer();
        gGame.timer = true;
    }
    if (!gGame.isOn) return;

    if (currCell.isMarked) return;
    if (!currCell.isMine && !currCell.isShown) {
        elCell.classList.add('unoccupied')
        elCell.classList.remove('occupied');
        currCell.isShown = true;
        gGame.shownCount++;
        cellRecursion(gBoard, i, j)
        var minesCount = setMinesNegsCount(gBoard, i, j);
        elCell.innerText = minesCount === 0 ? '' : minesCount;
    }
    if (currCell.isMine) {
        elCell.classList.add('unoccupied')
        elCell.classList.remove('occupied');
        elCell.innerText = BOMB;
        gLevel.lives--;
        gUpdateLives.innerText = 'lifes ' + gLevel.lives;
        gameOver()
    }
    checkWin();
}






function onCellMarked(elCell, i, j) {
    if (!gGame.timer) {
        startTimer();
        gGame.timer = true;
    }
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
    var count = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > mat[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var currCell = mat[i][j]
            if (currCell.isMine) {
                count++;
            }
        }
    }
    return count;
}

function cellRecursion(mat, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > mat[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var currCell = mat[i][j]
            var cell = document.querySelector(`.cell-${i}-${j}`);
            var minesCount = setMinesNegsCount(gBoard, i, j);
            if (!currCell.isMine && !currCell.isShown) {
                cell.classList.add('unoccupied')
                cell.classList.remove('occupied');
                cellRecursion(rowIdx, colIdx);
                currCell.isShown = true;
                gGame.shownCount++;
                cell.innerText = minesCount === 0 ? '' : minesCount;
                // recursion not working properly only opening 1 st neighbot.
            }
        }
    }
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
                // elCell.style.backgroundColor = 'red';
            }
        }
    }
}

function gameOver() {
    if (gLevel.lives === 0) {
        gUpdateText.innerText = '🤯'
        gUpdateStatus.innerText = 'LOSER'
        gUpdateLives.innerText = 'lifes ' + gLevel.lives
        clearInterval(gIntervalId)
        onGameOverExplode()
    }
    // onGameOverExplode(elCell) - make the cell red
}


function checkWin() {
    if (gGame.markedCount === gLevel.mines && gGame.shownCount === (gLevel.size ** 2) - gLevel.mines) {
        gGame.isOn = false;
        gUpdateText.innerText = '😎';
        gUpdateStatus.innerText = 'WINNER';
        clearInterval(gIntervalId)
    }
}

function updateLevel(size, mines, lives) {
    gLevel.size = size;
    gLevel.mines = mines;
    gLevel.lives = lives
    restartGame()
}

function resetParams() {
    gGame.timer = false;
    clearInterval(gIntervalId);
    gIntervalId = null;
    gTimer = 0;
    gElTimer = document.querySelector('.timer');
    gElTimer.innerText = 0;
}


function restartGame(lives) {
    init();
    resetParams()
}

