/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById('kanvasku')
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 1000
const CANVAS_HEIGHT = canvas.height = 600
const username = document.getElementById('username')
const level = document.getElementById('level')
const background = new Image();
background.src = './Sprites/background.jpg'
const cursorImage = new Image();
cursorImage.src = './Sprites/pointer.png'
const gunImage = new Image()
const targetImage = new Image()
let targetImageSrc


class Game {
    constructor(kanvas, context) {
        this.kanvas = kanvas
        this.ctx = context
        // var
        this.cursor = {
            x: CANVAS_WIDTH / 2,
            y: CANVAS_HEIGHT / 2,
            width : 60
        }
        this.running = true 
        this.targets = [
            new Target(kanvas, context),
            new Target(kanvas, context),
            new Target(kanvas, context)
        ]
        this.time = 30
        this.score = 0
        this.targetInterval = null
        this.timerInterval = null

        // init
        this.init();
    }
    
    init() {
        this.drawBackground();
    }
    
    startGame() {
        const selectedGun = document.querySelector('input[name="gun"]:checked')
        const selectedTarget = document.querySelector('input[name="target"]:checked')
        gunImage.src = `./Sprites/${selectedGun.value}.png`
        targetImageSrc = `./Sprites/${selectedTarget.value}.png`
        this.running = true
        this.time = level.value
        this.timer();
        this.gameLoop();
        this.targetSpawn();
        this.setupEventListener();
    }

    timer() {
            this.timerInterval = setInterval(() => {
                this.time -= 1
            },1000)
    }

    
    drawBackground() {
        background.onload = () => {
            ctx.drawImage(background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        }
    }
    
    setupEventListener() {
        if(this.running) {
            this.kanvas.addEventListener('mousemove', (e) => {
                if(!this.running) return;
                this.cursor.x = e.offsetX - this.cursor.width / 2
                this.cursor.y = e.offsetY - this.cursor.width / 2
            })
            
            this.kanvas.addEventListener('click', (e) => this.checkHit(e))
        } else {
            console.log(this.running)
        }
        
        document.addEventListener('keydown', (e) => {
            if(e.key == 'Escape') {
                this.running = !this.running
                document.getElementById('pause').classList.toggle('hidden')
                if (!this.running) {
                    clearInterval(this.timerInterval);
                    clearInterval(this.targetInterval);
                } else {
                    this.gameLoop();
                    this.timer();
                    this.targetSpawn();
                }
            }
        })
    }

    continue() {
        this.running = !this.running
                document.getElementById('pause').classList.toggle('hidden')
                if (!this.running) {
                    clearInterval(this.timerInterval);
                    clearInterval(this.targetInterval);
                } else {
                    this.gameLoop();
                    this.timer();
                    this.targetSpawn();
                }
    }

    retry() {
        this.running = true;
        this.time = level.value;
        this.score = 0;
        this.targets = [
            new Target(this.kanvas, this.ctx),
            new Target(this.kanvas, this.ctx),
            new Target(this.kanvas, this.ctx)
        ];
        document.getElementById('pause').classList.add('hidden');
        clearInterval(this.timerInterval);
        clearInterval(this.targetInterval);
        this.timer();
        this.gameLoop();
        this.targetSpawn();
    }

    targetSpawn() {
            this.targetInterval = setInterval(() => {
                this.targets.push(new Target(this.kanvas, this.ctx))
            }, 3000);
    }

    checkHit(e)  {
        if(this.running) {
            let hit = false;
            this.targets.forEach((val, index) => {
                if(
                    e.offsetX >= val.position.x && e.offsetX <= val.position.x + val.width &&
                    e.offsetY >= val.position.y && e.offsetY <= val.position.y + val.width
                ) {
                    cursorImage.src = './Sprites/boom.png'
                    setTimeout(() => {
                        cursorImage.src = './Sprites/pointer.png'
                    }, 100);
                    this.targets.splice(index, 1)
                    this.score += 1
                    hit = true;
                }
            });
            if (!hit) {
                this.time -= 5;
            }
        } else {
            // alert('pause')
        }
    }

    checkGameOver() {
        if(this.time <= 0) {
            this.running = false;
            clearInterval(this.timerInterval);
            clearInterval(this.targetInterval);
            document.getElementById('gameOver').classList.remove('hidden');
            document.getElementById('score').innerText = 'Your Score : ' + this.score;
            this.setScoreboard();
        }
    }

    setScoreboard() {
        const scoreboard = JSON.parse(localStorage.getItem('scoreboard'))?.sort((a, b) => {
            return b.this.score - a.this.score
        })
    
        if(!scoreboard) {
            localStorage.setItem('scoreboard', JSON.stringify([{
                'nama' : username.value ?? 'guest',
                'score' : this.score
            }]))
        } else {
            const userScoreboard = scoreboard.find(function(val, index) {
                return val.nama == username.value ?? 'guest'
            })
            if(!userScoreboard) {
                scoreboard.push({
                    'nama' : username.value ?? 'guest',
                    'score' : this.score
                })
                localStorage.setItem('scoreboard', JSON.stringify(scoreboard))
            } else {
                userScoreboard.score = Math.max(this.score, userScoreboard.score)
                localStorage.setItem('scoreboard', JSON.stringify(scoreboard))
            }
        }
    }

    drawTarget() {
        this.targets?.forEach(val => {
            val.draw();
        });
    }

    gunMove() {
        ctx.drawImage(gunImage, this.cursor.x + 10, 350, 275, 275)
    }

    drawCursor() {
        ctx.drawImage(cursorImage, this.cursor.x, this.cursor.y, this.cursor.width, this.cursor.width)
    }

    displayStats() {
        ctx.fillStyle = '#24242480'
        ctx.fillRect(0, 0, CANVAS_WIDTH, 40)
        ctx.fillStyle = 'white'
        ctx.font = 'bold 20px Arial'
        ctx.fillText(username.value, 20, 25)
        ctx.fillText('Score : ' + this.score, CANVAS_WIDTH / 2 - 20, 25)
        ctx.fillText('Time : ' + this.time, CANVAS_WIDTH - 100, 25)
    }

    gameLoop() {
        if(!this.running) {
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
            ctx.drawImage(background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        } else {
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
            ctx.drawImage(background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
            this.drawTarget();
            this.displayStats();
            this.gunMove();
            this.drawCursor();
            this.checkGameOver();
            requestAnimationFrame(() => this.gameLoop())
        }
    }
}

class Target {
    constructor(kanvas, context) {
        this.canvas = kanvas
        this.ctx = context
        this.width = 150
        this.position = {
            x: Math.random() * (kanvas.width - this.width),
            y: Math.random() * (kanvas.height - 50 - this.width)
        }
    }

    draw() {
        targetImage.src = targetImageSrc
        this.ctx.drawImage(targetImage, this.position.x, this.position.y, this.width, this.width)
    }
}

const game = new Game(canvas, ctx)