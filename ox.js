'use strict';
const _PLAYER = "o";
const _BOT = "x";
const winCase = [
    [0, 1, 2, 1],
    [3, 4, 5, 3],
    [6, 7, 8, 5],
    [0, 3, 6, -1],
    [1, 4, 7, -3],
    [2, 5, 8, -5],
    [0, 4, 8, 0],
    [2, 4, 6, 8],
]
var io = document.createElement("img");
io.src = "./img/o.JPG";
var ix = document.createElement("img");
ix.src = "./img/x.JPG";
var lineColor = "#342A31";
var endLineColor = "#C70039 ";
var canvas = document.getElementById('ox-board');
var context = canvas.getContext('2d');
var boardSize = 500;
var sectionSize = boardSize / 3;
canvas.width = boardSize;
canvas.height = boardSize;
context.translate(0.5, 0.5);
var ans = [];
var mainBoard = []
var turn;

async function excuteOX(x, y, pos, player) {
    var xCordinate = x * sectionSize;
    var yCordinate = y * sectionSize;

    let indexOf = ans.findIndex(f => x == f[0] && y == f[1]);
    if (player === _PLAYER && indexOf == -1) {
        alert("เลือกที่ว่างเท่านั้น");
        return false;
    }
    let _get = ans.splice(indexOf, 1);
    let res_message;
    if (player === _PLAYER) {
        turn = _BOT
        res_message = "You win!";
        mainBoard[_get[0][2]] = _PLAYER;
        OX(xCordinate, yCordinate, io);
    } else {
        turn = _PLAYER
        res_message = "You lost!";
        mainBoard[_get[0][2]] = _BOT;
        OX(xCordinate, yCordinate, ix);
    }

    return await new Promise((s, j) => {
        setTimeout(async() => {
            var winForm = isWin(mainBoard);
            if (winForm) {
                await endLine(winForm[3]);
                alert(res_message);
                newInit()
                s(false);
            } else if (!mainBoard.filter(f => typeof f === 'number').length) {
                alert("Equal")
                newInit()
                s(false);
            }
            s(true)
        }, 100);
    })
}

function OX(xCordinate, yCordinate, img) {
    clearPlayingArea(xCordinate, yCordinate);
    var halfSectionSize = (0.33 * sectionSize);
    var centerX = xCordinate + halfSectionSize;
    var centerY = yCordinate + halfSectionSize;
    context.drawImage(img, centerX, centerY, 50, 50);
    drawLines(10, lineColor);
}

function drawLines(lineWidth, strokeStyle) {
    var lineStart = 4;
    var lineLenght = boardSize - 5;
    context.lineWidth = lineWidth;
    context.strokeStyle = strokeStyle;
    context.beginPath();
    for (var y = 1; y <= 2; y++) {
        context.moveTo(lineStart, y * sectionSize);
        context.lineTo(lineLenght, y * sectionSize);
    }
    for (var x = 1; x <= 2; x++) {
        context.moveTo(x * sectionSize, lineStart);
        context.lineTo(x * sectionSize, lineLenght);
    }
    context.stroke();
}

async function endLine(val) {
    var lineStart = 30;
    var lineLenght = boardSize - 30;
    context.lineWidth = 5;
    context.strokeStyle = endLineColor;
    context.beginPath();
    if (val == 1 || val == 3 || val == 5) {
        context.moveTo(val * sectionSize * 0.5, lineStart);
        context.lineTo(val * sectionSize * 0.5, lineLenght);
    }
    if (val == -1 || val == -3 || val == -5) {
        context.moveTo(lineStart, Math.abs(val) * sectionSize * 0.5);
        context.lineTo(lineLenght, Math.abs(val) * sectionSize * 0.5);
    }
    if (val == 0) {
        context.moveTo(lineStart, lineStart);
        context.lineTo(lineLenght, lineLenght);
    }
    if (val == 8) {
        context.moveTo(lineStart, lineLenght);
        context.lineTo(lineLenght, lineStart);
    }
    context.stroke();
    return await new Promise((s, j) => {
        setTimeout(() => { s(1) }, 1000);
    })
}

function clearPlayingArea(xCordinate, yCordinate) {
    context.fillStyle = "#fff";
    context.fillRect(
        xCordinate,
        yCordinate,
        sectionSize,
        sectionSize
    );
}

function newInit() {
    ans = [
        [0, 0, 0],
        [0, 1, 1],
        [0, 2, 2],
        [1, 0, 3],
        [1, 1, 4],
        [1, 2, 5],
        [2, 0, 6],
        [2, 1, 7],
        [2, 2, 8]
    ];
    mainBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    context.clearRect(0, 0, canvas.width, canvas.height);
    turn = _PLAYER;
    drawLines(10, lineColor);
}

function getCanvasMousePosition(event) {
    var rect = canvas.getBoundingClientRect();
    var xCordinate;
    var yCordinate;
    var mx = event.clientX - rect.left
    var my = event.clientY - rect.top
    for (var x = 0; x < 3; x++) {
        for (var y = 0; y < 3; y++) {
            xCordinate = x * sectionSize;
            yCordinate = y * sectionSize;

            if (
                mx >= xCordinate && mx <= xCordinate + sectionSize &&
                my >= yCordinate && my <= yCordinate + sectionSize
            ) {
                return {
                    x,
                    y
                }
            }
        }
    }

}

function isWin(board) {
    for (let i = 0; i < winCase.length; i++) {
        let wc = winCase[i];
        let item1 = board[wc[0]];
        let item2 = board[wc[1]];
        let item3 = board[wc[2]];
        if (item1 === item2 && item2 === item3 && typeof item3 == "string") {
            return wc;
        }
    }
    return false;
}

function runBot(board, player) {
    var canDo = board.filter(f => typeof f === 'number').sort(() => Math.random() - 0.5);

    if (isWin(board))
        switch (player) {
            case _BOT:
                return {
                    val: -1
                };
                break;
            case _PLAYER:
                return {
                    val: 1
                }
                break;
        }
    else if (canDo.length == 0) return {
        val: 0
    };
    var _cases = [];
    for (let i = 0; i < canDo.length; i++) {
        var _case = {
            id: board[canDo[i]],
            val: null
        };
        board[canDo[i]] = player;
        let term = runBot(board, player === _BOT ? _PLAYER : _BOT);
        _case.val = term.val;
        board[canDo[i]] = _case.id
        _cases.push(_case);
    }
    if (player === _BOT) {
        return _cases.sort((a, b) => b.val - a.val)[0];
    } else {
        return _cases.sort((a, b) => a.val - b.val)[0];
    }
}

newInit();

canvas.addEventListener('mouseup', async function(event) {
    if (turn === _PLAYER) {
        var positon = getCanvasMousePosition(event);
        if (await excuteOX(positon.x, positon.y, null, _PLAYER)) {
            setTimeout(async() => {
                let tempBoard = (new Array()).concat(mainBoard)
                let best = runBot(tempBoard, _BOT)
                await excuteOX(...ans.find(f => f[2] == best.id), _BOT);
            }, 250);
        }
    }
});