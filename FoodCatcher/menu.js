btnInstruction.forEach(btn => {
    btn.addEventListener('click', () => {
        instruction.classList.remove('hidden')
        leaderboardMenu.classList.add('hidden')
    })
})

btnLeadeboard.forEach(btn => {
    btn.addEventListener('click', () => {
        instruction.classList.add('hidden')
        leaderboardMenu.classList.remove('hidden')
    })
})

btnCloseInstruction.addEventListener('click', () => {
    instruction.classList.add('hidden')
})

btnCloseLeaderboard.addEventListener('click', () => {
    leaderboardMenu.classList.add('hidden')
})

btnStart.forEach(btn => {
    btn.addEventListener('click', () => {
        instruction.classList.add('hidden')
        leaderboardMenu.classList.add('hidden')
        startMenu.classList.add('hidden')
        canvas.classList.remove('hidden')
        stats.classList.remove('hidden')
        game.start();
    })
})

btnRestart.forEach(btn => {
    btn.addEventListener('click', () => {
        game.restart();
    }) 
})

const leaderboardData = JSON.parse(localStorage.getItem('leaderboard'))

leaderboardData?.forEach((val, index) => {
    document.getElementById('leaderboardData').insertAdjacentHTML('beforebegin', `
                   <tr>
                        <td>${index + 1}</td>
                        <td>${val.username === '' ? 'guest' : val.username}</td>
                        <td>${val.score}</td>
                    </tr>
        `)
})
