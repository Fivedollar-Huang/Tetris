const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = 512
canvas.height = 1024

gameboard = new Gameboard(20, 10)
// gameboard.board[0][0] = 1
// gameboard.board[4][3] = 1
// gameboard.board[3][5] = 1
// gameboard.board[10][9] = 1
ctx.fillStyle = 'lightgray'
ctx.fillRect(0, 0, canvas.width, canvas.height)
function update(){
    window.requestAnimationFrame(update)
    if(gamePaused) return

    gameboard.update()
}


update()
