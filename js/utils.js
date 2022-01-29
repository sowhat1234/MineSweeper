'use strict';

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); 
}

function renderBoard(board) {
    var strHTML = '<table border="5" cellpadding="10"><tbody>'
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var tdToShow = '';
            var className = `cell cell-${i}-${j}`;
            strHTML += `<td class="${className} occupied"
            oncontextmenu="onCellMarked(this,${i},${j})"  onclick="onClickCell(this,${i},${j})">${tdToShow}</td>`;
        };
        strHTML += '</tr>';
    };
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector('.board');
    elContainer.innerHTML = strHTML;
};

function renderTimer() {
    var gElTimer = document.querySelector('.timer');
    var stopWatch = Number(gTimer)
    gElTimer.innerText = stopWatch;
}

function startTimer() {
    gIntervalId = setInterval(function () {
        gTimer += 1
        renderTimer()
    }, 1000)
}