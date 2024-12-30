class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId)
        this.ctx = this.canvas.getContext('2d')
        this.CANVAS_WIDTH = this.canvas.width
        this.CANVAS_HEIGHT = this.canvas.height

        this.player = {
            x: 0,
            y: 0,
            width : 50
        }
        this.dropObjects = []

        this.running = false 
        this.paused = false
        this.lastFrameTime = 0
        this.gameLoop = this.gameLoop.bind(this)
        this.togglePause = this.togglePause.bind(this)
        this.setupEventListeners()
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if(e.key === 'Escape' || e.key === 'P') this.togglePause()
        })
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

    start() {
        this.running = true
        this.paused = false
        this.lastFrameTime = performance.now()
        requestAnimationFrame(this.gameLoop)
    }

    stop() {
        this.running = false
    }

    gameLoop(timestamp) {
        if(!this.running || this.paused) return
        
        const deltaTime = timestamp - this.lastFrameTime
        this.lastFrameTime = timestamp

        this.update(deltaTime)
        this.render()

        requestAnimationFrame(this.gameLoop)
    }

    player() {
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.width)
    }

    update(deltaTime) {
        
    }

    render() {
        this.ctx.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT)
        this.ctx.fillstyle = 'black'
    }
}

const game = new Game('canvas')
game.start()