
window.addEventListener('keydown', keydown)
window.addEventListener('keyup', keyup)

function keydown(event){
    switch(event.key){
        case 'a':
        case 'ArrowLeft':
            gameboard.moveLeft()
            break;
        case 'd':
        case 'ArrowRight':
            gameboard.moveRight()
            break;
        case 's':
        case 'ArrowDown':
            gameboard.fastDrop()
            break;
        case 'w':
        case 'ArrowUp':
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
        case 'ArrowDown':
            gameboard.normalDrop()
            break;
    }
}