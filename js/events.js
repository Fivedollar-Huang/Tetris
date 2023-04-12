
window.addEventListener('keydown', keydown)
window.addEventListener('keyup', keyup)

function keydown(event){
    switch(event.key){
        case 'a':
            gameboard.moveLeft()
            break;
        case 'd':
            gameboard.moveRight()
            break;
        case 's':
            gameboard.fastDrop()
            break;
        case 'w':
            gameboard.rotate()
            break;
        case 'p':
            gamePaused = !gamePaused
            break;
        case 'h':
            gameboard.holdCurrentTetromino()
            break;
        case ' ':
            if(gameRunning){
                gameboard.bottomDrop()
            }
    }
}
function keyup(event){
    switch(event.key){
        case 's':
            gameboard.normalDrop()
            break;
    }
}