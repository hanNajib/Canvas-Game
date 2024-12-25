/** 
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const CANVAS_WIDTH = canvas.width = 1024
const CANVAS_HEIGHT = canvas.height = 1024
const background = new Image
background.src = './Sprites/General/Background.jpg'

function init() {
    ctx.drawImage(background, 0, 0, background.width, background.height, 0, 200, background.width, background.height)
}

window.onload = init