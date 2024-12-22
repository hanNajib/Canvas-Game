/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById('kanvasku')
const ctx = canvas.getContext('2d');
const GAME_WIDTH = 960
const GAME_HEIGHT = 600
const snakeColor = 'green'
const snakeBorder = 'black'
const foodColor = 'red'
const gridSize = GAME_WIDTH / 48
let xVelocity = gridSize
let yVelocity = 0
let score = 0;
let running = false
let foods = []
let snake = [
    {x: gridSize * 4, y: gridSize * 15},
    {x: gridSize * 3, y: gridSize * 15},
    {x: gridSize * 2, y: gridSize * 15},
    {x: gridSize * 1, y: gridSize * 15},
    {x: 0, y: gridSize * 15}
]

function drawGrid() {
    for(let i = 0; i < GAME_WIDTH; i += gridSize) {
        for(let j = 0; j < GAME_HEIGHT; j += gridSize) {
            ctx.fillStyle = (Math.floor(i / gridSize) + Math.floor(j / gridSize)) % 2 === 0 ? "#003083" : "#002056"
            ctx.fillRect(i, j, gridSize, gridSize)
        }
    }
}

document.addEventListener('keydown', changeDirection)

drawGrid()
drawSnake()

function gameStart() {
    running = true;
    nextTick();
}

function nextTick() {
    if(running) {
        setTimeout(() => {
            clearBoard()
            drawSnake();
            drawFood();
            moveSnake();
            checkGameOver();
            nextTick();
        }, 200);
    } else {
        
    }
}

function clearBoard() {
    drawGrid();
}

class Food {
    constructor(context) {
        this.context = context
        this.x = Math.round((Math.random() * (GAME_WIDTH - gridSize)) / gridSize) * gridSize
        this.y = Math.round((Math.random() * (GAME_HEIGHT - gridSize)) / gridSize) * gridSize
    }

    draw() {
        this.context.fillStyle = foodColor
        this.context.fillRect(this.x, this.y, gridSize, gridSize)
    }
}

function drawFood() {
    foods.forEach(food => food.draw());
}

function drawSnake() {
    snake.forEach(snakePart => {
        ctx.fillStyle = snakeColor
        ctx.fillRect(snakePart.x, snakePart.y, gridSize, gridSize)
        ctx.strokeRect(snakePart.x, snakePart.y, gridSize, gridSize)
    })
}

function moveSnake() {
    const head = {x: snake[0].x + xVelocity, y: snake[0].y + yVelocity}
    snake.unshift(head)
    let foodEaten = false
    for (let i = 0; i < foods.length; i++) {
        if(snake[0].x == foods[i].x && snake[0].y == foods[i].y) {
            score += 1
            foodEaten = true
            foods.splice(i, 1)
            foods.push(new Food(ctx))
            break;
        }
    }
    if(!foodEaten) {
        snake.pop();
    }
}

function changeDirection(event) {
    const keyPressed = event.keyCode
    const LEFT = 65,
    RIGHT = 68,
    UP = 87,
    DOWN = 83

    const goingUp = (yVelocity == -gridSize)
    const goingDown = (yVelocity == gridSize)
    const goingLeft = (xVelocity == gridSize)
    const goingRight = (xVelocity == -gridSize)

    switch(true) {
        case(keyPressed == RIGHT && !goingLeft && !running):
            gameStart();
            xVelocity = gridSize
            yVelocity = 0
            break;
        case(keyPressed == UP && !goingDown && !running):
            gameStart();
            xVelocity = 0
            yVelocity = -gridSize
            break;
        case(keyPressed == DOWN && !goingUp && !running):
            gameStart();
            xVelocity = 0
            yVelocity = gridSize
            break;
        case(keyPressed == LEFT && !goingRight):
            xVelocity = -gridSize
            yVelocity = 0
            break;
        case(keyPressed == RIGHT && !goingLeft):
            xVelocity = gridSize
            yVelocity = 0
            break;
        case(keyPressed == UP && !goingDown):
            xVelocity = 0
            yVelocity = -gridSize
            break;
        case(keyPressed == DOWN && !goingUp):
            xVelocity = 0
            yVelocity = gridSize
            break;
    }
}

function checkGameOver() {
    switch(true) {
        case(snake[0].x < 0):
            running = false
            break;
        case(snake[0].x > GAME_WIDTH):
            running = false
            break;
        case(snake[0].y < 0):
            running = false
            break;
        case(snake[0].y > GAME_HEIGHT):
            running = false
            break;
    }

    for(let i = 1; i < snake.length; i++) {
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
            running = false
            displayGameOver()
        }
    }
}

function displayGameOver() {
    ctx.font = '50px MV Boli'
    ctx.fillStyle ='black'
    ctx.textAlign = 'center'
    ctx.fillText('GAME OVER!', GAME_WIDTH / 2, GAME_HEIGHT / 2)
    running = false
}

foods.push(new Food(ctx))
drawFood();