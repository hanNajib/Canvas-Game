class DynamicGame {
    constructor(canvasId, startButtonId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.startButton = document.getElementById(startButtonId);
        this.running = false; 
        this.paused = false; 
        this.timer = 0;       
        this.lastTime = 0;    

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.startButton.addEventListener('click', () => {
            if (!this.running) {
                this.start();
                this.startButton.disabled = true; 
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'p') this.togglePause();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'q') this.stop();
        });
    }

    start() {
        if (!this.running) {
            this.running = true;
            this.paused = false;
            this.lastTime = performance.now();
            this.timer = 0;
            this.gameLoop();
        }
    }

    stop() {
        this.running = false;
        this.paused = false;
        this.timer = 0;
        this.startButton.disabled = false;
        this.clearCanvas();
    }

    togglePause() {
        if (this.running) {
            this.paused = !this.paused;
        }
    }

    gameLoop(timestamp = 0) {
        if (!this.running) return; 
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        if (!this.paused) {
            this.update(deltaTime);
            this.render();
        }

        requestAnimationFrame((time) => this.gameLoop(time));
    }

    update(deltaTime) {
        this.timer += deltaTime / 1000;
    }

    render() {
        this.clearCanvas();
        this.drawBackground();
        this.drawTimer();
    }

    drawBackground() {
        this.ctx.fillStyle = 'lightblue'; 
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawTimer() {
        this.ctx.fillStyle = 'black';
        this.ctx.font = '30px Arial';
        this.ctx.fillText(`Timer: ${this.timer.toFixed(1)}s`, 10, 40);
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

const game = new DynamicGame('canvas', 'startButton');
