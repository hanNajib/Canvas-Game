/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const instruction = document.getElementById('instruction');
const pauseMenu = document.getElementById('pause')
const gameOver = document.getElementById('gameOver')
const btnPlay = document.querySelectorAll('#btn-play')
const btnRestart = document.querySelectorAll('#btn-restart')
const btnContinue = document.querySelectorAll('#btn-continue')
const btnQuit = document.querySelectorAll('#btn-quit')
const statsPanel = document.getElementById('stats')
const username = document.getElementById('username')
const timeText = document.getElementById('time')
const scoreText = document.getElementById('score')
const failText = document.getElementById('fail')
const playerName = document.getElementById('playerName')

class Game {
    constructor(kanvas, konteks) {
        this.ctx = konteks
        this.canvas = kanvas
        this.CANVAS_WIDTH = kanvas.width
        this.CANVAS_HEIGHT = kanvas.height

        this.count = 3
        this.score = 0
        this.fail = 0
        this.time = 0
        this.timer = null
        this.running = false
        this.pause = false
        this.virus = [
            new Virus(this.canvas, this.ctx),
        ]
        this.countdownInterval = null
        this.startTimeout = null
        this.spawnInterval = null
        this.gameLoop = this.gameLoop.bind(this)

        // image
        this.hitLabel = new Image()
        this.virusImage = document.getElementById('virusImage')
        


    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'd':
                    this.checkHit(0)
                    break;
                case 'f':
                    this.checkHit(1)
                    break;
                case 'j':
                    this.checkHit(2)
                    break;
                case 'k':
                    this.checkHit(3)
                    break;
                case 'Escape':
                    pauseMenu.classList.toggle('hidden')
                    this.togglePause();
                    break;
            }
        })

    }

    checkHit(panel) {
        let panelSize = this.CANVAS_WIDTH / 4;
        this.virus.forEach((virus, index) => {
            if (virus.y > this.CANVAS_HEIGHT - 90 && virus.y < this.CANVAS_HEIGHT - 35 && virus.x >= panelSize * panel && virus.x < panelSize * (panel + 1)) {
                this.score++;
                this.virus.splice(index, 1);
            }
        });
    }

    togglePause() {
        if(this.running) {
            this.paused = !this.paused
            if(!this.paused) {
                this.lastFrameTime = performance.now()
                requestAnimationFrame(this.gameLoop)
            }
        }
    }

    countdown() {
        ctx.font = '10px Arial'
        let panelSize = this.CANVAS_WIDTH / 4
        this.countdownInterval = setInterval(() => {
            for(let i = 0; i < 4; i++) {
                ctx.fillStyle = '#262626'
                ctx.fillRect((panelSize * i), 0, panelSize, this.CANVAS_HEIGHT)
            }
            ctx.fillStyle = 'white'
            ctx.fillText(this.count, this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2)
            this.count--
            if(this.count < 0) {
                clearInterval(countdownInterval)
            }
        }, 1000);
    }

    start() {
        this.countdown()
        playerName.innerHTML = username.value
        this.startTimeout = setTimeout(() => {
            this.setupEventListeners()
            this.running = true
            this.paused = false
            this.timer = setInterval(() => this.incrementTime(), 1000); 
            this.lastFrameTime = performance.now()
            this.spawnVirus();
            requestAnimationFrame(this.gameLoop)     
        }, 4000);
    }

    spawnVirus() {
        this.spawnInterval = setInterval(() => {
            if(!this.running || this.paused) return;
            this.virus.push(new Virus(this.canvas, this.ctx))
        }, 1000)
    }

    restart() {
        this.stop();
        clearInterval(this.spawnInterval);
        clearInterval(this.countdownInterval);
        clearTimeout(this.startTimeout);
        this.count = 3;
        this.score = 0;
        this.fail = 0;
        this.time = 0;
        this.virus = [];
        this.start();
    }

    stop() {
        this.running = false;
        clearInterval(this.spawnInterval);
        clearInterval(this.countdownInterval);
        clearTimeout(this.startTimeout);
        clearInterval(this.timer); 
    }

    incrementTime() {
        this.time++;
    }

    gameLoop() {
        if(!this.running || this.paused) return;
        this.displayUpdate();
        this.render()
        ctx.fillStyle = '#ff00005a'
        ctx.fillRect(0, this.CANVAS_HEIGHT - 90, this.CANVAS_WIDTH, this.CANVAS_HEIGHT / 2 - 22) // zona berbahayya
        this.virus.forEach((virus, index) => {
            if (virus.y > this.CANVAS_HEIGHT - 35) {
                this.fail++;
                this.virus.splice(index, 1);
            }
        });
        this.checkGameOver();
        requestAnimationFrame(this.gameLoop)
    }
    
    checkGameOver() {
        if(this.fail >= 3) {
            this.stop()
            document.getElementById('final-score').innerHTML = this.score
            document.getElementById('final-time').innerHTML = this.time
            document.getElementById('final-playerName').innerHTML = username.value
            gameOver.classList.toggle('hidden')
            this.togglePause()
        }
    }

    displayUpdate() {
        let minutes = Math.floor(this.time / 60);
        let seconds = this.time % 60;
        timeText.innerHTML = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        scoreText.innerHTML = this.score;
        failText.innerHTML = this.fail;
    }

    render() {
        if(!this.running || this.paused) return;
        this.ctx.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT)
        this.hitLabel.src = './images/d.png'
        let panelSize = this.CANVAS_WIDTH / 4
        for(let i = 0; i < 4; i++) {
            ctx.fillStyle = '#262626'
            ctx.fillRect((panelSize * i), 0, panelSize, this.CANVAS_HEIGHT)
        }
        this.virus.forEach(virus => {
            virus.update()
            virus.draw()
        })
        for(let i = 0; i < 4; i++) {
            ctx.strokeStyle = '#464646'
            ctx.strokeRect((panelSize * i), 0, panelSize, this.CANVAS_HEIGHT)
            ctx.fillStyle = i % 2 === 0 ? '#6161b2' : '#3c8bb0'
            ctx.fillRect((panelSize * i), this.CANVAS_HEIGHT - 35, panelSize, 35)
            ctx.fillStyle = '#505050'
            ctx.fillRect(0, this.CANVAS_HEIGHT - 37, this.CANVAS_WIDTH, 5)
            ctx.drawImage(this.hitLabel, 5, this.CANVAS_HEIGHT - 30, this.CANVAS_WIDTH - 10, 25)
        }
    }
}

class Virus {
    constructor(canvas, ctx, image) {
        this.canvas = canvas
        this.ctx = ctx
        this.x = canvas.width / 4 * Math.floor(Math.random() * 4)
        this.y = -25
        this.speed = 1
        this.img = new Image()
        this.img.src = './images/coronavirus-gaedba68d4_1280.png'
    }
    
    draw() {
        this.ctx.mozImageSmoothingEnabled = true;
        this.ctx.webkitImageSmoothingEnabled = true;
        this.ctx.msImageSmoothingEnabled = true;
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.drawImage(this.img, this.x + 5, this.y, 65, 25)
    }

    update() {
        this.y += this.speed
    }
}

const game = new Game(canvas, ctx)