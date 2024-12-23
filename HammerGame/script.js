/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById('kanvasku')
const ctx = canvas.getContext('2d')
const CANVAS_WIDTH = canvas.width = 600
const CANVAS_HEIGHT = canvas.height = 600
const gridMargin = 50
const gridSize = (CANVAS_WIDTH / 3) - gridMargin
const textScore = document.getElementById('score')
const textTime = document.getElementById('timer')
const textHeart = document.getElementById('miss')
let moleImage = new Image();
moleImage.src = './tikus.png'

let moles = {
    x: 50,
    y: 50
}
let score = 0
let time = 30
let heart = 3

function animate() {
    displayUpdate();
    drawBackground();
    drawGrid();
    changePosition();
    spawnMole();
    checkGameOver();
}

function drawBackground() {
    ctx.beginPath();
    ctx.fillStyle = 'lightblue'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    ctx.closePath();
}

function drawGrid() {
    ctx.beginPath();
    ctx.fillStyle = 'red'
    ctx.fillRect(50, 50, gridSize, gridSize)
    ctx.fillRect(225, 50, gridSize, gridSize)
    ctx.fillRect(400, 50, gridSize, gridSize)
    
    ctx.fillRect(50, 225, gridSize, gridSize)
    ctx.fillRect(225, 225, gridSize, gridSize)
    ctx.fillRect(400, 225, gridSize, gridSize)

    ctx.fillRect(50, 400, gridSize, gridSize)
    ctx.fillRect(225, 400, gridSize, gridSize)
    ctx.fillRect(400, 400, gridSize, gridSize)
    
    ctx.closePath();
}

function spawnMole() {
    ctx.drawImage(moleImage, moles.x, moles.y, gridSize, gridSize)
}

function changePosition() {
    const position = [50, 225, 400]
    const randomX = Math.floor(Math.random() * position.length)
    const randomY = Math.floor(Math.random() * position.length)
    
    moles.x = position[randomX]
    moles.y = position[randomY]
}

animate();

const interval = setInterval(() => {
    time -= 1
    animate();
}, 1000);

canvas.addEventListener('click', (e) => {
    checkHit(e.offsetX, e.offsetY)
})

function checkHit(x, y) {
    const kiri = moles.x
    const kanan = moles.x + gridSize
    const atas = moles.y
    const bawah = moles.y + gridSize

    if(
        x > kiri && x < kanan &&
        y > atas && y < bawah
    ) {
        score += 1
    } else {
        heart -= 1
    }
}

function displayUpdate() {
    textTime.innerText = time
    textScore.innerText = score
    let heartDisplay = Array(heart).fill("❤️")
    textHeart.innerHTML = heartDisplay.toString().replaceAll(',', ' ')
}

function checkGameOver() {
    if(heart <= 0) {
        displayGameOver();
    } else if(time < 1) {
        displayWaktuHabis();
    }
}

function displayGameOver() {
    ctx.fillStyle = 'black'
    clearInterval(interval)
    ctx.font = '50px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('GAME OVER!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
    ctx.font = '20px Arial'
    ctx.fillText('Your Score : ' + score, CANVAS_WIDTH / 2, (CANVAS_HEIGHT / 2) + 50)
}

function displayWaktuHabis() {
    ctx.fillStyle = '#464646'
    clearInterval(interval)
    ctx.font = '50px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('WAKTU HABIS!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
    ctx.font = '20px Arial'
    ctx.fillText('Your Score : ' + score, CANVAS_WIDTH / 2, (CANVAS_HEIGHT / 2) + 50)
}