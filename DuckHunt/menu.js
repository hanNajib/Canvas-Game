const btnStart = document.querySelectorAll('#btn-start')
const btnLeaderboard = document.querySelectorAll('#btn-leaderboard')
const btnMenu = document.querySelectorAll('#btn-menu')
const btnContinue = document.querySelectorAll('#btn-continue')
const menu = document.getElementById('menu')
const leaderboard = document.getElementById('leaderboard')
const gameOver = document.getElementById('gameOver')
const pause = document.getElementById('pause')
const scoreboardData = JSON.parse(localStorage.getItem('scoreboard'))
const scoreboardList = document.getElementById('scoreboardBody')

scoreboardData?.forEach((val, index) => {
    scoreboardList.insertAdjacentHTML('beforeEnd', `
        <td>${index + 1}</td>
        <td>${val.nama !== '' ? val.nama : 'guest' }</td>
        <td>${val.score}</td>
    `)
});



btnStart.forEach(btn => {
    btn.addEventListener('click', () => {
    menu?.classList.add('hidden')
    leaderboard?.classList.add('hidden')
    gameOver?.classList.add('hidden')
    game.startGame();
})})

btnLeaderboard.forEach(btn => {
    btn.addEventListener('click', () => {
    menu?.classList.add('hidden')
    leaderboard?.classList.remove('hidden')
    gameOver?.classList.add('hidden')
})})

btnMenu.forEach(btn => {
    btn.addEventListener('click', () => {
    location.reload();
    menu?.classList.remove('hidden')
    leaderboard?.classList.add('hidden')
    gameOver?.classList.add('hidden')
    pause?.classList.add('hidden')
})})

btnContinue.forEach(btn => {
    btn.addEventListener('click', () => {
    menu?.classList.add('hidden')
    leaderboard?.classList.add('hidden')
    gameOver?.classList.add('hidden')
    game.pause();
})})

