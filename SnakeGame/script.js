/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById('kanvas')
const ctx = canvas.getContext('2d')
let snakeScoreData = localStorage.getItem('snake-score')
const playerName = document.getElementById('nama')
let leaderboard = JSON.parse(snakeScoreData).sort((a, b) => a.level - b.level || b.score - a.score) || [{name: 'hanNajib', score: '0'}]
const scoreText = document.getElementById('score')
const resetBtn = document.getElementById('btn-reset')
const startBtn = document.getElementById('btn-start')
const gameSceneContainer = document.getElementById('gameScene')
const mainMenuContainer = document.getElementById('mainMenu')
const username = document.getElementById('username')
let level
const gameWidth = canvas.width
const gameHeight = canvas.height
const boardBackground = 'white'
const snakeColor = 'lightgreen'
const snakeBorder = 'black'
const foodColor = 'red'
let pause = false
let gameOver = false
const unitSize = 25
let xVelocity = unitSize
let yVelocity = 0
let running = false
let score = 0
let foods = []
let snake = [
    {x: unitSize * 4, y: 0},
    {x: unitSize * 3, y: 0},
    {x: unitSize * 2, y: 0},
    {x: unitSize * 1, y: 0},
    {x: 0, y: 0}
]

function leaderboardData() {
    const levelData = [
        'Alien',
        'Hard',
        'Medium',
        'Easy'
    ]
    let leaderboardLoop = leaderboard?.slice(0, 7).map((data, index) => {
     return `
            <tr>
                        <td>${index + 1}</td>
                        <td>${data.name}</td>
                        <td>${levelData[data.level] ?? '-'}</td>
                        <td>${data.score}</td>
            </tr>
        `
    })
    document.getElementById('leaderboard-data').innerHTML = leaderboardLoop?.toString().replaceAll(',', '')
}

leaderboardData()

resetBtn.addEventListener('click', resetGame)
startBtn.addEventListener('click', gameScene)

drawSnake()

function gameScene() {
    username.innerHTML = 'nama : ' + playerName.value
    level = parseInt(document.getElementById('level').value)
    console.log(level)
    gameSceneContainer.classList.remove('none')
    mainMenuContainer.classList.add('none')
    window.addEventListener('keydown', changeDirection)
    for(let i = 1; i <= level; i ++) {
        foods.push(new Food(ctx))
    }
}

function gameStart(){
    running = true
    console.log(username.value)
    scoreText.textContent = score
    nextTick();
}
function nextTick(){
    if(running) {
        setTimeout(() => {
            clearBoard();
            moveSnake();
            drawSnake();
            drawFood();
            checkGameOver();
            nextTick();
        }, 200)
    } else {
        displayGameOver()
    }
}
function clearBoard() {
    ctx.fillStyle = boardBackground
    ctx.fillRect(0, 0, gameWidth, gameHeight)
}


class Food {
    constructor(context) {
        this.context = context
        this.x = Math.round((Math.random() * (gameWidth - unitSize)) / unitSize) * unitSize;
        this.y = Math.round((Math.random() * (gameHeight - unitSize)) / unitSize) * unitSize;        
    }

    draw() {
        // console.log(this.x)
        this.context.fillStyle = foodColor
        this.context.fillRect(this.x, this.y, unitSize, unitSize)
    }
}


function drawFood() {
    foods.forEach(food => food.draw())
}

function moveSnake(){
    const head = {x: snake[0].x + xVelocity, y: snake[0].y + yVelocity}
    snake.unshift(head)
    let foodEaten = false;
    for (let i = 0; i < foods.length; i++) {
        if (snake[0].x == foods[i].x && snake[0].y == foods[i].y) {
            score += 1;
            scoreText.textContent = score;
            foodEaten = true;
            foods.splice(i, 1);
            foods.push(new Food(ctx)); 
            break;
        }
    }
    if (!foodEaten) {
        snake.pop(); 
    }
    
}
function drawSnake(){
    ctx.fillStyle = snakeColor
    ctx.strokeStyle = snakeBorder
    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize)
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize)
    })
}
function changeDirection(event){
    const keyPressed = event.keyCode
    const LEFT = 65
    const RIGHT = 68
    const UP = 87
    const DOWN = 83
    
    const goingUp = (yVelocity == -unitSize)
    const goingDown = (yVelocity == unitSize)
    const goingLeft = (xVelocity == -unitSize)
    const goingRight = (xVelocity == unitSize)

    switch(true) {
        case(keyPressed == DOWN && !goingUp && !running && !gameOver):
            gameStart();
            yVelocity = unitSize
            xVelocity = 0
            break;
        case((keyPressed == RIGHT || keyPressed == UP || keyPressed == LEFT) && !goingLeft && !running && !gameOver):
            gameStart();
            yVelocity = 0
            xVelocity = unitSize
            break;
        case(keyPressed == UP && !goingDown):
            yVelocity = -unitSize
            xVelocity = 0
            break;
        case(keyPressed == DOWN && !goingUp):
            yVelocity = unitSize
            xVelocity = 0
            break;
        case(keyPressed == LEFT && !goingRight):
            yVelocity = 0
            xVelocity = -unitSize
            break;
        case(keyPressed == RIGHT && !goingLeft):
            yVelocity = 0
            xVelocity = unitSize
            break;
        case(keyPressed == 27):
            pause = true
            break;
        
    }
}
function checkGameOver(){
    switch(true) {
        case(snake[0].x < 0):
            running = false
            break;
        case(snake[0].x >= gameWidth):
            running = false
            break;
        case(snake[0].y < 0):
            running = false
            break;
        case(snake[0].y >= gameHeight):
            running = false
            break;
    }

    for(let i = 1; i < snake.length; i += 1) {
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
            running = false
            break;
        }
    }
}
function displayGameOver(){
    gameOver = true
    ctx.font = '50px MV Boli'
    ctx.fillStyle = 'black'
    ctx.textAlign = 'center'
    ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2)
    running = false
    let setScore = [
        ...leaderboard,
        {name: playerName.value, 'level': parseInt(document.getElementById('level').value), 'score': score}
    ]
    localStorage.setItem('snake-score', JSON.stringify(setScore))
}
function resetGame(){
    score = 0
    xVelocity = unitSize
    yVelocity  = 0
    snake = [
        {x: unitSize * 4, y: 0},
        {x: unitSize * 3, y: 0},
        {x: unitSize * 2, y: 0},
        {x: unitSize * 1, y: 0},
        {x: 0, y: 0}
    ]
    gameStart();
}
