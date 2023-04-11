
var gameboard
var gamePaused = false
var gameRunning = false

ctx.fillStyle = 'lightgray'
ctx.fillRect(0, 0, canvas.width, canvas.height)

function startGame(row, col){
    gameboard = new Gameboard(row, col)
    gameRunning = true
    update()
}

function update(){
    if(gameRunning){
        window.requestAnimationFrame(update)
        if(gamePaused) return

        gameboard.update()
    }
}




