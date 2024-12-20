const canvas = document.getElementById('kanvasku');
const ctx = canvas.getContext('2d')
const CANVAS_WIDTH = canvas.width = 600
const CANVAS_HEIGHT = canvas.height = 600

const playerImage = new Image();
playerImage.src = 'image.png'
const spriteWidth = 575
const spriteHeight = 523
let gameFrame = 0
const staggerFrames = 5

const spriteAnimation = []
const animationStates = [
    {
        name: 'idle',
        frames: 7
    },
    {
        name: 'jump',
        frames: 7
    }
]

animationStates.forEach((state, index) => {
    let frames = {
        loc: [],
    }
    for (let j = 0; j < state.frames; j++) {
        let positionX = j * spriteWidth;
        let positionY = index * spriteHeight
        frames.loc.push({x: positionX, y: positionY})
    }
    spriteAnimation[state.name] = frames;
})

console.log(spriteAnimation)

function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    let position = Math.floor(gameFrame/staggerFrames) % spriteAnimation['jump'].loc.length;
    frameY = spriteAnimation['jump'].loc[position].y
    frameX = spriteAnimation['jump'].loc[position].x
    ctx.drawImage(playerImage, frameX, frameY, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight)

    gameFrame++
    requestAnimationFrame(animate)
}

animate()
