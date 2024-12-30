btnPlay.forEach(btn => {
    btn.addEventListener('click', () => {
        canvas.classList.remove('hidden')
        instruction.classList.add('hidden')
        statsPanel.classList.remove('hidden')
        game.start();
    })
})

btnContinue.forEach(btn => {
    btn.addEventListener('click', () => {

    })
})

btnRestart.forEach(btn => {
    btn.addEventListener('click', () => {
        canvas.classList.remove('hidden')
        instruction.classList.add('hidden')
        statsPanel.classList.remove('hidden')
        gameOver.classList.add('hidden')
        game.restart();
    })
})

btnQuit.forEach(btn => {
    btn.addEventListener('click', () => {
        location.reload();
    })
})




function checkUsername() {
    const username = document.getElementById('username').value;
    const playButton = document.getElementById('btn-play');
    playButton.disabled = username.trim() === '';
}