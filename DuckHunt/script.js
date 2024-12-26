const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 1280;
const CANVAS_HEIGHT = canvas.height = 720;
const difficulty = document.getElementById('difficulty')
const shootSound = document.getElementById('snd-shoot')
const username = document.getElementById('username')

class Game {
    constructor(canvas, context) {
        this.context = context;
        this.canvas = canvas;
        this.ducks = [
        ];
        this.spawnInterval = 1000;
        this.running = false
        this.score = 0;
        this.heart = 5;
        this.shootCooldown = 1000
        this.lastShootTime = 0
        this.difficulty = 'easy';
        this.background = new Image();
        this.background.src = './Background.png'; 
        this.cursorImage = new Image();
        this.cursorImage.src = './target.png';
        this.cursor = { x: -1000, y: 0, width: 60};
        this.duckInterval;
        this.setupEventListeners();
        this.gameLoop();
    }

    setupEventListeners() {
        this.canvas.addEventListener('click', this.shoot);

        document.addEventListener('keydown', (e) => {
            switch(true) {
                case(e.key === 'Escape') :
                    this.pause();
                    break;
            }
        })

        this.canvas.addEventListener('mousemove', (e) => {
            this.cursor.x = e.offsetX - (this.cursor.width / 2);
            this.cursor.y = e.offsetY - (this.cursor.width / 2);
        });
        
        
    }

    pause () {
        this.running = !this.running
        document.getElementById('pause').classList.toggle('hidden')
        this.spawnInterval = this.spawnInterval === difficulty.value ? 10000 : difficulty.value
    }

    startGame() {
        this.resetGame();
        document.getElementById('stats').classList.remove('hidden')
        document.getElementById('pause').classList.add('hidden')
        this.running = true
        this.spawnInterval = parseInt(difficulty.value)
        this.spawnDuck();
        document.getElementById('name').innerHTML = document.getElementById('username').value
    }

    resetGame() {
        this.ducks = [];
        this.spawnInterval = 1000;
        this.running = false;
        this.score = 0;
        this.heart = 5;
        this.lastShootTime = 0;
        this.cursor = { x: -1000, y: 0, width: 60 };
    }

    drawBackground() {
        this.context.drawImage(this.background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }


    gameLoop() {
        this.context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        this.drawBackground();
        this.context.drawImage(this.cursorImage, this.cursor.x, this.cursor.y, this.cursor.width, this.cursor.width);
        this.ducks.forEach(duck => {
            duck.draw();
            if(!this.running) return;
            duck.update();
        })
        this.displayUpdate();
        this.checkGameOver();
            requestAnimationFrame(() => this.gameLoop());
        
    }

    spawnDuck() {
        if(this.running) {
            this.duckInterval = setInterval(() => {
                this.ducks.push(new Duck(this.context))
            }, this.spawnInterval);
        } else {
            duckInterval = null
        }
    }

    displayUpdate() {
        const scoreText = document.getElementById('score')
        const heartText = document.getElementById('heart')
        const duckText = document.getElementById('duck')

        scoreText.innerHTML = this.score
        heartText.innerHTML = Array(this.heart)?.fill('❤️').toString().replaceAll(',', ' ')
        duckText.innerHTML = Array(this.score)?.fill('🦆').toString().replaceAll(',', ' ')
    }

    displayGameOver() {
        document.getElementById('gameOver').classList.remove('hidden')
        document.getElementById('scoreFinal').innerHTML = this.score
    }

    checkGameOver() {
        if(this.heart == 0) {
            // alert('gameoverygy')
            this.running = false
            this.displayGameOver()
            clearInterval(this.duckInterval)
            this.ducks = []
            this.setLeaderboard();
        }
    }

    setLeaderboard() {
        const scoreboard = JSON.parse(localStorage.getItem('scoreboard'))?.sort((a, b) => {
            return b.score - a.score
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

    shoot = (e) => {
        const currentTime = Date.now();
        if(!this.running) return;
        if (currentTime - this.lastShootTime < this.shootCooldown) return;
        this.lastShootTime = currentTime;
        shootSound.play();
        let hit = false;
        this.ducks.forEach((duck, index) => {
            if (
                e.offsetX >= duck.position.x &&
                e.offsetX <= duck.position.x + duck.width &&
                e.offsetY >= duck.position.y &&
                e.offsetY <= duck.position.y + duck.width
            ) {
                this.ducks.splice(index, 1);
                this.score++
                hit = true;
            }
        });
        if (!hit) {
            this.heart--; 
        }
    }

}

class Duck {
    constructor(context) {
        this.context = context
        this.duckImage = new Image();
        this.duckImage.src = './duckhunt_various_sheet_cr-removebg-preview.png';
        this.width = 80;
        this.speed = 5
        this.position = {
            x: CANVAS_WIDTH,
            y: Math.random() * 400
        }
    }

    update() {
        this.position.x -= this.speed;
    }

    draw() {
        this.context.drawImage(this.duckImage, this.position.x, this.position.y, this.width, this.width)
    }
}

const game = new Game(canvas, ctx);