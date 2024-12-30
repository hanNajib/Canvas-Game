/** 
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

class Game {
    constructor (canvas, ctx) {
        this.canvas = canvas
        this.ctx = ctx
        this.CANVAS_WIDTH = this.canvas.width
        this.CANVAS_HEIGHT = this.canvas.height
        this.paused = false
        this.running = true
        this.lastFrameTime = 0

        this.background = new Image()
        this.background.src = './Sprites/General/Background.jpg'

        this.gameLoop = this.gameLoop.bind(this) // Bind metode gameLoop

        this.setupEventListeners()
        this.start()
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            let { key } = e
            if(key === 'Escape') {
                alert('dor')
            }
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

    gameLoop() {
        if(!this.running || this.paused) return;
        this.render()
        requestAnimationFrame(this.gameLoop)
    }

    render() {
        this.ctx.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT)
        
        // Hitung skala untuk mempertahankan rasio aspek
        const scale = Math.min(this.CANVAS_WIDTH / this.background.width, this.CANVAS_HEIGHT / this.background.height)
        const x = (this.CANVAS_WIDTH / 2) - (this.background.width / 2) * scale
        const y = (this.CANVAS_HEIGHT / 2) - (this.background.height / 2) * scale

        this.ctx.drawImage(this.background, x, y, this.background.width * scale, this.background.height * scale)
    }
}

const game = new Game(canvas, ctx)