
const keys={
    a: false,
    s: false,
    d: false,
    w: false,
}

window.addEventListener('keydown', keydown)
window.addEventListener('keyup', keyup)

function keydown(event){
    switch(event.key){
        case 'a':
            keys.a = true
            gameboard.moveLeft()
            break;
        case 'd':
            keys.d = true
            gameboard.moveRight()
            break;
        case 's':
            keys.s = true
            gameboard.fastDrop()
            break;
        case 'w':
            keys.w = true
            gameboard.rotate()
            break;
        case 'p':
            // keys.p = true
            gamePaused = !gamePaused
            break;
        case 'h':
            gameboard.holdCurrentTetromino()
            break;
        case ' ':
            gameboard.bottomDrop()
    }
}
function keyup(event){
    switch(event.key){
        case 'a':
            keys.a = false
            break;
        case 'd':
            keys.d = false
            break;
        case 's':
            keys.s = false
            gameboard.normalDrop()
            break;
        case 'w':
            keys.w = false
            break;
        case 'h':
            hideMenu()
            break;
    }
}