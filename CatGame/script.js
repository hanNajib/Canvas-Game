class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId)
        this.ctx = this.canvas.getContext('2d')
        this.CANVAS_WIDTH = this.canvas.width
        this.CANVAS_HEIGHT = this.canvas.height
        this.pisangGoreng = new Image()
        this.pisangGoreng.src = 'pisang-goreng.png'
        this.catImage = new Image()
        this.catImage.src = 'akmal.png'
        this.catImage.onload = () => {
            this.start()
        }

        this.player = {
            x: 0,
            y: this.CANVAS_HEIGHT - 120,
            width : 120
        }
        this.dropObjects = [
            new DropObject(this.pisangGoreng, this.canvas, this.ctx),
        ]
        
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
        
        this.canvas.addEventListener('mousemove', (e) => {
            this.player.x = e.offsetX - this.player.width / 2
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
    
    drawPlayer() {
        this.catImage.src = 'akmal.png'
        this.ctx.drawImage(this.catImage, this.player.x, this.player.y, this.player.width, this.player.width)
    }
    
    update(deltaTime) {
        
    }
    
    render() {
        this.ctx.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT)
        this.ctx.fillStyle = 'black'
        this.drawPlayer(),
        this.dropObjects.forEach(dropObject => dropObject.draw())
    }
}

class DropObject {
    constructor(img, canvas, ctx) {
        this.canvas = canvas
        this.ctx = ctx
        this.img = img
        this.x = Math.random() * (this.canvas.width - 50)
        this.y = 0
    }
    
    draw() {
        this.ctx.drawImage(this.img, this.x, this.y, 50, 50)
    }
    
    update() {
        this.y += 1
    }
    
    isOutOfScreen() {
        return this.y > this.CANVAS_HEIGHT
    }
}

const game = new Game('canvas')