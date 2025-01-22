const username = document.getElementById('username')
const instruction = document.getElementById('instruction')
const stats = document.getElementById('stats')
const canvas = document.getElementById('canvas')
const startMenu = document.getElementById('menu')
const leaderboardMenu = document.getElementById('leaderboard')
const btnStart = document.querySelectorAll('#btn-start')
const btnInstruction = document.querySelectorAll('#btn-instruction')
const btnCloseInstruction = document.getElementById('btn-closeInstruction')
const btnLeadeboard = document.querySelectorAll('#btn-leaderboard')
const btnRestart = document.querySelectorAll('#btn-restart')
const btnCloseLeaderboard = document.getElementById('btn-closeLeaderboard')
const basketImage = document.getElementById('basketImage')
let hp = 5
let score = 0
let basket = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 50,
    width : 70,
    movement: 11
}

const foodData = [
    {
        path: './assets/apple.png',
        point: 1,
        hp: 0
    },
    {
        path: './assets/avocado.png',
        point: 1,
        hp: 0
    },
    {
        path: './assets/golden_apple.png',
        point: 3,
        hp: 1
    },
    {
        path: './assets/trash.png',
        point: -5,
        hp: -1
    },
    {
        path: './assets/bomb.png',
        point: 0,
        hp: -999
    },
]

class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId)
        this.ctx = this.canvas.getContext('2d')
        this.backgroundColor = document.getElementById('background-color')
        this.CANVAS_WIDTH = this.canvas.width
        this.CANVAS_HEIGHT = this.canvas.height
        this.running = false
        this.paused = false
        this.timer = 0
        this.lastTime = 0
        this.foodInterval = null
        this.food = [
            new Food(canvas)
        ]

    }

    setupEventListener() {
        document.addEventListener('keydown', (e) => {
            if(e.key === 'Escape') {
                this.togglePause();
            }
            switch(e.key) {
                case 'a':
                    if(basket.x <= 0) return;
                    basket.x -= basket.movement 
                    break;
                case 'd':
                    if(basket.x >= canvas.width - basket.width * 2) return;
                    basket.x += basket.movement
                    break;
            }
        })
    }

    togglePause() {
        if(this.running) {
            this.paused = !this.paused
            document.getElementById('pauseMenu').classList.toggle('hidden')
        }
    }

    start() {
        if(!this.running) {
            const highscore = JSON.parse(localStorage.getItem('leaderboard'))?.find((val, index) => {
                return val.username === username.value
            })
            this.running = true
            this.paused = false
            this.lastTime = performance.now()
            this.timer = 0
            document.getElementById('stats-username').innerHTML = username.value
            document.getElementById('stats-highscore').innerHTML = highscore?.score ?? '0   '
            this.setupEventListener();
            this.gameloop()
            this.foodInterval = setInterval(() => {
                if(!this.paused) {
                    this.food.push(new Food(this.canvas))
                }
            }, document.getElementById('difficulty').value)
        }
    }

    stop() {
        this.running = false
        this.paused = false
        this.timer = 0
        clearInterval(this.foodInterval)
    }

    checkHit() {
        this.food.forEach((food, index) => {
            if (
                food.position.y + food.width >= basket.y &&
                food.position.y <= basket.y + basket.width &&
                food.position.x + food.width >= basket.x &&
                food.position.x <= basket.x + basket.width - 5
            ) {
                hp += food.foodData.hp;
                score += food.foodData.point;
                this.food.splice(index, 1); 
                
            }
        });
    }

    checkGameOver() {
        if(hp <= 0) {
            this.stop();
            document.getElementById('gameOver').classList.remove('hidden')
            this.setLeaderboard()
        }
    }
    
    restart() {
        this.running = false
        this.paused = false
        this.timer = 0
        this.lastTime = 0
        this.foodInterval = null
        this.food = [
            new Food(canvas)
        ]
        hp = 5
        score = 0
        basket = {
            x: canvas.width / 2 - 20,
            y: canvas.height - 50,
            width : 70,
            movement: 11
        }
        this.stop();
        document.getElementById('gameOver').classList.add('hidden')
        document.getElementById('pauseMenu').classList.add('hidden')
        this.start();
    }

    gameloop(timestamp = 0) {
        if(!this.running) return;
        const dTime = timestamp - this.lastTime
        this.lastTime = timestamp

        if(!this.paused) {
            this.update(dTime);
            this.checkHit();
            this.checkGameOver();
            this.render();
        }

        requestAnimationFrame((time) => this.gameloop(time))
    }

    update(dTime) {
        this.timer += dTime / 1000
        this.food.forEach(obj => {
            obj.update();
        });
        document.getElementById('stats-lives').innerHTML = hp
        document.getElementById('stats-score').innerHTML = score
    }

    setLeaderboard() {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard'))?.sort((a, b) => {
            return b.score - a.score
        })
        if(!leaderboard) {
            localStorage.setItem('leaderboard', JSON.stringify([
                {
                    'username': username.value ?? 'guest',
                    'score' : score
                }
            ]))
        } else {
            const userLeaderboard = leaderboard.find(function(val, index) {
                return val.username === username.value ?? 'guest'
            })
            if(!userLeaderboard) {
                leaderboard.push({
                    'username': username.value ?? 'guest',
                    'score' : score
                })
                localStorage.setItem('leaderboard', JSON.stringify(leaderboard))
            } else {
                userLeaderboard.score = Math.max(score, userLeaderboard.score)
                localStorage.setItem('leaderboard', JSON.stringify(leaderboard))
            }
        }
    }

    render() {
        this.clearCanvas();
        this.drawBackground();
        this.drawBasket();
        this.food.forEach(obj => {
            obj.drawFood();
        });
    }

    drawBackground() {
        this.ctx.fillStyle = this.backgroundColor.value ?? 'lightblue'
        this.ctx.fillRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT)
        this.ctx.fillStyle = this.backgroundColor.value == '#000000' ? 'white' : 'black'
        this.ctx.fillRect(0, this.CANVAS_HEIGHT - 30, this.CANVAS_WIDTH, 30)
    }
 
    drawBasket() {
        this.ctx.drawImage(basketImage, basket.x, basket.y - basket.width / 2 + 5, basket.width, basket.width)
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT)
    }
}

class Food {
    constructor(canvas) {
        this.canvas = document.getElementById('canvas')
        this.ctx = this.canvas.getContext('2d')
        this.width = 40
        this.position = {
            x: (Math.random() * (canvas.width - this.width * 2)),
            y: 0
        }
        this.foodData = foodData[Math.floor(Math.random() * foodData.length)]
        this.foodImage = new Image()
        this.foodImage.src = this.foodData.path
    }
    
    drawFood() {
        this.ctx.drawImage(this.foodImage, this.position.x, this.position.y, this.width, this.width)
    }

    update() {
        this.position.y += 2
    }
}

const game = new Game('canvas')