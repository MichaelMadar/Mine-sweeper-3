'use strict'
const MINE = '💣';
const FLAG = '🚩'
var gLivesCount;
var counter;
var gBoard;
var gFirstClick;
var gLastclick = []
var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOff: false,
    shownCount: 0,
    markedCount: 0
}

function init() {
    gLivesCount = 3;
    renderLives();
    gBoard = createBoard();
    addMines();
    gLastclick = []
    MinesAroundCount();
    renderBoard(gBoard, '.board')
}
function upGradeBoard(element) {
    var elDifficult = element.value
    if (elDifficult === '1') {
        gLevel = {
            SIZE: 4,
            MINES: 2
        };
    }
    if (elDifficult === '2') {
        gLevel = {
            SIZE: 6,
            MINES: 8
        };
    }

    if (elDifficult === '3') {
        gLevel = {
            SIZE: 8,
            MINES: 12
        }
    }
    init();
}


function createBoard() {
    var SIZE = gLevel.SIZE;
    var board = [];
    for (var i = 0; i < SIZE; i++) {
        board.push([]);
        for (var j = 0; j < SIZE; j++) {
            board[i][j] = createCell();

        }
    }
    return board;
}
function createCell() {
    var gBoard = {
        minesAroundCount: 4,
        isShown: false,
        isMine: false,
        isMarked: false
    }
    return gBoard
}

function renderBoard(board) {

    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {

            var className = 'cell cell-' + i + '-' + j;

            strHTML += '<td class="' + className +
                '" oncontextmenu = markCell(event,' + i + ',' + j +
                ') onclick = cellClicked(this,' + i + ',' + j + ')>'
            //strHTML += ' '
            strHTML += '\t</td>\n';
        }
        strHTML += '</tr>\n';
        var elBoard = document.querySelector('.board');
        elBoard.innerHTML = strHTML;

    }
}
function cellClicked(elCell, i, j) {
    var cell = gBoard[i][j]
    if (gGame.isOff) return
    if (cell.isShown) return
    if (gFirstClick) {
        gFirstClick = false;
    }
    cell.isShown = true
    var value = ''
    if (cell.isMine) value = MINE;
    if (value === MINE) {
        mineClick()
    }
    else (value = cell.minesAroundCount)
    elCell.innerHTML = value
    if (value === 0) {
        value =''
        elCell.classList.add('mark');
        expandShown(gBoard, i, j)
        elCell.innerHTML = value = ''

    }
}
function addMines() {
    for (var i = 0; i < gLevel.MINES; i++) {
        var minePosI = getRandomInt(0, gBoard.length - 1);
        var minePosJ = getRandomInt(0, gBoard[0].length - 1);
        gBoard[minePosI][minePosJ].isMine = true;

    }
}
function setMinesNegsCount(board, rowIdx, colIdx) {
    var counter = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var cell = board[i][j];
            if (cell.isMine) counter++

        }
    }
    return counter
}
function expandShown(board, iCell, jCell) {
    for (var i = iCell - 1; i <= iCell + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = jCell - 1; j <= jCell + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            if (i === iCell && j === jCell) continue
            var cell = board[i][j];
            if (!cell.isShown) {
                cell.isShown = true
                var location = { i: i, j: j }

                var cellSelector = '.' + getClassName(location)
                var elCell2 = document.querySelector(cellSelector);
                elCell2.classList.add('mark');
                if (cell.minesAroundCount === 0) expandShown(gBoard, i, j);
                else renderCell(location, cell.minesAroundCount)
            }
        }
    }
}

function MinesAroundCount() {
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            var currCell = gBoard[i][j]
            currCell.minesAroundCount = setMinesNegsCount(gBoard, i, j)
        }
    }
}

function renderLives() {
    var str = ''
    for (var i = 0; i < gLivesCount; i++) {
        str += '💚'
    }
    var lives = document.querySelector('.lives');
    lives.innerText = str;
}
function mineClick() {
    gLivesCount--;
    if (gLivesCount === 0) {
        renderLives()
    }
}
function renderCell(location, value) {
    if (value === 0) value = ''
    var cellSelector = '.' + getClassName(location)
    var elCell = document.querySelector(cellSelector);
    elCell.innerHTML = value;
}

// Returns the class name for a specific cell
function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
}