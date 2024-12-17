/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById('kanvas')
const ctx = canvas.getContext('2d')
const backgroundImage = document.getElementById('backgroundGame')
const pointerImage = new Image()
pointerImage.src = './Sprites/pointer.png'
const targetImage = {
    one: document.getElementById('targetOne'),
    two: document.getElementById('targetTwo'),
    three: document.getElementById('targetThree')
}
let gunImage = {
    one : document.getElementById('gunOne'),
    two : document.getElementById('gunTwo')
}

let pointer = {
    x : 450,
    y : 300
}

let gunPointer = {
    x: 400
}

window.onload = init

function init() {
    gameLoop()
    pointerGun()
    setInterval(spawnTarget, 3000); 
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    ctx.drawImage(backgroundImage, 0, 0)    
    ctx.fillStyle = '#00000080'
    ctx.fillRect(0, 0, 1000, 40)
    targets.forEach(target => target.draw())
    requestAnimationFrame(gameLoop)
}

function pointerGun() {
    ctx.drawImage(pointerImage, pointer.x, pointer.y)
    ctx.drawImage(gunImage.two, gunPointer.x -50, 380, 450, 280)
    requestAnimationFrame(pointerGun)
}

canvas.addEventListener('mousemove', function(e) {
    pointer.x = e.offsetX - 24,
    pointer.y = e.offsetY - 24
    
    gunPointer.x = e.offsetX
})

document.addEventListener('keydown', function(e) {
    if(e.key === 'Escape') {
        alert('yaampun')
    }
})


class Target {
    constructor(context, canvasWidth, canvasHeight) {
        this.ctx = context
        this.x = Math.random() * (canvasWidth - 150)
        this.y = Math.random() * (canvasHeight - 150) + 100
        this.scale = 0 
    }
    
    draw() {
        if (this.scale < 1) this.scale += 0.05
        this.ctx.save()
        this.ctx.translate(this.x, this.y)
        this.ctx.scale(this.scale, this.scale)
        this.ctx.drawImage(targetImage.one, -75, -75, 150, 150) 
        this.ctx.restore()
    }}
    
    let targets = [
        new Target(ctx, canvas.width, canvas.height),
        new Target(ctx, canvas.width, canvas.height),
        new Target(ctx, canvas.width, canvas.height)
    ]
    
    function spawnTarget() {
        const newTarget = new Target(ctx, canvas.width, canvas.height)
        targets.push(newTarget)
}

canvas.addEventListener('click', (e) => {
    pointerImage.src = './Sprites/boom.png'
    setTimeout(() => {
        pointerImage.src = './Sprites/pointer.png'
    }, 100)
    for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        const distance = Math.hypot(target.x - e.offsetX, target.y - e.offsetY);

        if (distance <= 75) {  
            targets.splice(i, 1);
            break; 
        }
    }
});

