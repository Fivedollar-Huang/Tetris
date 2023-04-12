
var gameboard
var gamePaused = false
var gameRunning = false

function startGame(row, col){
    gameboard = new Gameboard(row, col)
    console.log(gameboard)
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




