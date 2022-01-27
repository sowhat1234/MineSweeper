'use strict';




function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
    elCell.innerHTML = value;
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}


function renderBoard(board) {
    var strHTML = '<table border="5" cellpadding="10"><tbody>'
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            var tdToShow = '';
            // var cell = {
            //     location: board[i][j],
            //     minesAroundCount: 4,
            //     isShown: true,
            //     isMine: false,
            //     isMarked: true
            // };
            // var myString = JSON.stringify(cell);
            // var className = cell ? 'occupied' : '';
            var className = `cell cell-${i}-${j}`;
            strHTML += `<td class="${className} 
            occupied
            "
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
    var stopWatch = Number(gTimer).toFixed(3) + ''
    gElTimer.innerText = stopWatch;
}

function startTimer() {
    gIntervalId = setInterval(function () {
        //global var
        gTimer += 1
        renderTimer()
    }, 1000)
}