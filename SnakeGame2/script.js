/** 
 * 
 * @type {HTMLCanvasElement}
 * 
*/

const canvas = document.getElementById('kanvasku')
const ctx = canvas.getContext('2d')
const GAME_WIDTH = canvas.width = 960
const GAME_HEIGHT = canvas.height = 600
const gridX = 48
const gridY = 30
const gridSize = GAME_WIDTH / gridX
let xVelocity = gridSize
let yVelocity = 0
let running = false
let score = 0
let foods = []
let snake = [
    {x: gridSize * 20, y: 240 },
    {x: gridSize * 19, y: 240},
    {x: gridSize * 18, y: 240},
]
let snakeColor = 'green'
let snakeBorder = 'black'
let scoreText = document.getElementById('scoreText')

document.addEventListener('keydown', changeDirection);

function drawGrid() {
    for(let i = 0; i <= gridX; i++) {
        for(let j = 0; j <= gridY; j++) {
            // ctx.fillStyle = j * i / -5 % 2 == 0 ? '#002288' : '#001b6d'
            ctx.fillStyle = (i + j) % 2 === 0 ? '#002288' : '#001b6d';
            ctx.fillRect(i * gridSize, j * gridSize, gridSize, gridSize)
        }
    }
}

drawGrid();
gameStart();

function gameStart(){
    running = true
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
    drawGrid();
}


class Food {
    constructor(context) {
        this.context = context
        this.x = Math.round((Math.random() * (GAME_WIDTH - gridSize)) / gridSize) * gridSize;
        this.y = Math.round((Math.random() * (GAME_HEIGHT - gridSize)) / gridSize) * gridSize;        
    }

    draw() {
        // console.log(this.x)
        this.context.fillStyle = 'red'
        this.context.fillRect(this.x, this.y, gridSize, gridSize)
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
        ctx.fillRect(snakePart.x, snakePart.y, gridSize, gridSize)
        ctx.strokeRect(snakePart.x, snakePart.y, gridSize, gridSize)
    })
}
function changeDirection(event){
    const keyPressed = event.keyCode
    const LEFT = 65
    const RIGHT = 68
    const UP = 87
    const DOWN = 83
    
    const goingUp = (yVelocity == -gridSize)
    const goingDown = (yVelocity == gridSize)
    const goingLeft = (xVelocity == -gridSize)
    const goingRight = (xVelocity == gridSize)

    switch(true) {
        case(keyPressed == DOWN && !goingUp && !running && !gameOver):
            gameStart();
            yVelocity = gridSize
            xVelocity = 0
            break;
        case((keyPressed == RIGHT || keyPressed == UP || keyPressed == LEFT) && !goingLeft && !running && !gameOver):
            gameStart();
            yVelocity = 0
            xVelocity = gridSize
            break;
        case(keyPressed == UP && !goingDown):
            yVelocity = -gridSize
            xVelocity = 0
            break;
        case(keyPressed == DOWN && !goingUp):
            yVelocity = gridSize
            xVelocity = 0
            break;
        case(keyPressed == LEFT && !goingRight):
            yVelocity = 0
            xVelocity = -gridSize
            break;
        case(keyPressed == RIGHT && !goingLeft):
            yVelocity = 0
            xVelocity = gridSize
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
        case(snake[0].x >= GAME_WIDTH):
            running = false
            break;
        case(snake[0].y < 0):
            running = false
            break;
        case(snake[0].y >= GAME_HEIGHT):
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
    ctx.fillText("GAME OVER!", GAME_WIDTH / 2, GAME_HEIGHT / 2)
    running = false
}
function resetGame(){
    score = 0
    xVelocity = gridSize
    yVelocity  = 0
    snake = [
        {x: gridSize * 4, y: 0},
        {x: gridSize * 3, y: 0},
        {x: gridSize * 2, y: 0},
        {x: gridSize * 1, y: 0},
        {x: 0, y: 0}
    ]
    gameStart();
}

foods.push(new Food(ctx))
