const menu = document.getElementById('menu')
const game = document.getElementById('game')
const scoreboard = document.getElementById('scoreboard')
const scoreboardData = JSON.parse(localStorage.getItem('scoreboard'))
const scoreboardList = document.getElementById('scoreboardBody')
const htp = document.getElementById('howToPlay')
const usernameInput = document.getElementById('input-username')
const usernameText = document.getElementById('username')
const btnPlay = document.getElementById('btn-play')
const btnHowToPlay = document.getElementById('btn-htp')
const btnKembali = document.getElementById('btn-kembali')
const btnScoreboard = document.getElementById('btn-scoreboard')

btnPlay.addEventListener('click', function () {
    game.style.display = 'block'
    menu.classList.add('none')
    htp.classList.add('none')
    usernameText.innerHTML = usernameInput.value !== '' ? usernameInput.value : 'guest'
    start()
})

btnScoreboard.addEventListener('click', function () {
        scoreboard.classList.remove('none')
        menu.classList.add('none')
        htp.classList.add('none')
})

btnHowToPlay.addEventListener('click', function() {
    htp.classList.toggle('none')
})

btnKembali.addEventListener('click', function() {
    menu.classList.remove('none')
    scoreboard.classList.add('none')
})


scoreboardData?.forEach((val, index) => {
    scoreboardList.insertAdjacentHTML('beforeEnd', `
        <td>${index + 1}</td>
        <td>${val.nama !== '' ? val.nama : 'guest' }</td>
        <td>${val.score}</td>
    `)
});
