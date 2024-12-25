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
let cursorImg = new Image();
cursorImg.src = './hammer.png'
cursorImg.style.mixBlendMode = 'multiply'


let moles = {
    x: 50,
    y: 50
}
let cursor = {
    x: -100,
    y: -100,
    width: 75
}
let score = 0
let time = 30
let heart = 10
let interval;

function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    displayUpdate();
    drawBackground();
    drawGrid();
    spawnMole();
    hammer();
    checkGameOver();
    requestAnimationFrame(animate)
}

function drawBackground() {
    ctx.beginPath();
    ctx.fillStyle = '#9d4f00'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    ctx.closePath();
}

function drawGrid() {
    ctx.beginPath();
    ctx.fillStyle = '#5b2d00'
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

function start() {
    animate();
    interval = setInterval(() => {
        time -= 1
        changePosition();
    }, 1000);
}

canvas.addEventListener('click', (e) => {
    if(interval) {
        checkHit(e.offsetX, e.offsetY)
    }
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
        setScoreboard();
    } else if(time < 1) {
        displayWaktuHabis();
        setScoreboard();
    }
}

function displayGameOver() {
    ctx.fillStyle = 'white'
    clearInterval(interval)
    interval = null
    ctx.font = '50px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('GAME OVER!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
    ctx.font = '20px Arial'
    ctx.fillText('Your Score : ' + score, CANVAS_WIDTH / 2, (CANVAS_HEIGHT / 2) + 50)
}

function displayWaktuHabis() {
    ctx.fillStyle = 'white'
    clearInterval(interval)
    interval = null
    ctx.font = '50px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('WAKTU HABIS!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
    ctx.font = '20px Arial'
    ctx.fillText('Your Score : ' + score, CANVAS_WIDTH / 2, (CANVAS_HEIGHT / 2) + 50)
}

function hammer() {
    ctx.drawImage(cursorImg, cursor.x, cursor.y, cursor.width, cursor.width)
}

canvas.addEventListener('mousemove', function(e) {
    cursor.x = e.offsetX - cursor.width / 2
    cursor.y = e.offsetY - cursor.width / 2
})


function setScoreboard() {
    const scoreboard = JSON.parse(localStorage.getItem('scoreboard'))?.sort((a, b) => {
        return b.score - a.score
    })

    if(!scoreboard) {
        localStorage.setItem('scoreboard', JSON.stringify([{
            'nama' : usernameInput.value ?? 'guest',
            'score' : score
        }]))
    } else {
        const userScoreboard = scoreboard.find(function(val, index) {
            return val.nama == usernameInput.value ?? 'guest'
        })
        if(!userScoreboard) {
            scoreboard.push({
                'nama' : usernameInput.value ?? 'guest',
                'score' : score
            })
            localStorage.setItem('scoreboard', JSON.stringify(scoreboard))
        } else {
            userScoreboard.score = Math.max(score, userScoreboard.score)
            localStorage.setItem('scoreboard', JSON.stringify(scoreboard))
        }
    }
}

