const menu = document.getElementById('menu')
const leaderboard = document.getElementById('leaderboard')
const instruction = document.getElementById('instruction')
const pause = document.getElementById('pause')
const gameOver = document.getElementById('gameOver')
const btnInstruction = document.getElementById('btn-instruction')
const btnClose = document.getElementById('btn-close')
const btnPlay = document.querySelectorAll('#btn-play')
const btnContinue = document.getElementById('btn-continue')
const btnRetry = document.querySelectorAll('#btn-retry')
const btnMenu = document.querySelectorAll('#btn-menu')
const scoreboardData = JSON.parse(localStorage.getItem('scoreboard'))
const leaderboardTable = document.getElementById('leaderboardTable')

btnInstruction.addEventListener('click', function() {
    instruction.classList.remove('hidden')
})

btnMenu.forEach(btn => {
    btn.addEventListener('click', function() {
     location.reload();
})})

btnClose.addEventListener('click', function() {
    instruction.classList.add('hidden')
})

btnPlay.forEach(btn => {
    btn.addEventListener('click', function() {
        pause.classList.add('hidden')
        menu.classList.add('hidden')
        instruction.classList.add('hidden')
        canvas.classList.remove('hidden')
        leaderboard.classList.remove('hidden')
        game.startGame();
    })
})

btnRetry.forEach(btn => {
    btn.addEventListener('click', function() {
        pause.classList.add('hidden')
        menu.classList.add('hidden')
        instruction.classList.add('hidden')
        canvas.classList.remove('hidden')
        leaderboard.classList.remove('hidden')
        gameOver.classList.add('hidden')
        game.retry();
    })
})

btnContinue.addEventListener('click', function() {
    game.continue()
})

scoreboardData.forEach((val, index) => {
    leaderboardTable.insertAdjacentHTML('beforeend', `
            <tr>
                    <td><b>${val.nama}</b><br>Score : ${val.score}</td>
                    <td><button>DETAIL</button></td>
            </tr>
        `)
})


