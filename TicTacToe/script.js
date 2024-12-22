/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById('kanvasku')
const ctx = canvas.getContext('2d')
const GAME_WIDTH = canvas.width = 300
const GAME_HEIGHT = canvas.height = 300
const gridSize = canvas.width / 3
let currentPlayer = 'X'
const board = Array(9).fill(null)


function drawBoard() {
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            ctx.lineWidth = 3
            ctx.strokeRect(i * gridSize, j * gridSize, gridSize, gridSize)
        }
    }

    board.forEach((cell, i) => {
        if(cell) {
            const x = (i % 3) * gridSize + gridSize / 2
            const y = (gridSize * 0.63) + gridSize * Math.floor(i / 3)
            ctx.font = '40px Arial'
            ctx.textAlign = "center"
            ctx.textBaseline = 'center'
            ctx.fillText(cell, x, y)
        }
    })
}
drawBoard()

canvas.addEventListener('click', function(event) {
    const x = Math.floor(event.offsetX / gridSize)
    const y = Math.floor(event.offsetY / gridSize)
    const index = y * 3 + x

    if(!board[index]) {
        board[index] = currentPlayer;
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X'
        const winner = checkWinner();
        if(winner) {
            alert(winner === 'Draw' ?  'Seri!' : `${winner} Menang!`);
            board.fill(null)
        }
        drawBoard();
    }
})

function checkWinner() {
    const winPattern = [[0,1,2], [3,4,5], [6,7,8],
                        [0,3,6], [1,4,7], [2,5,8],
                        [0,4,8], [2,4,6]];

    for(const pattern of winPattern) {
        const [a,b,c] = pattern;
        if(board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    return board.includes(null) ? null : 'Draw';
}
