const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const menu = document.getElementById('menu')
const gameWindow = document.getElementById('gameWindow')
const inputRow = document.getElementById('inputRow')
const inputCol = document.getElementById('inputCol')

const startButton = document.querySelector('.startButton')

window.addEventListener('resize', resizeWindow)
startButton.addEventListener('click', startGameEvent)
resizeWindow() // fix the size 

function resizeWindow(){
    canvas.width = 300
    canvas.height = 600
    // const width = window.innerWidth;
    // const height = window.innerHeight;
    // canvas.style.width = width/2+'px'
    // canvas.style.height = height/2+'px'
    // ctx.fillStyle = 'lightgray'
    // ctx.fillRect(0, 0, canvas.width, canvas.height)
    // menu.style.left = 0;
}

function showMenu(){
    menu.style.display = 'flex'
}
function hideMenu(){
    menu.style.display = 'none'
}

function startGameEvent(){
    let row = inputRow.value || 20
    let col = inputCol.value || 10
    if(row > 50) row = 50
    else if(row < 4) row = 4
    if(col > 100) col = 100
    else if(col < 4) col = 4
    // console.log(canvas.offsetWidth)
    menu.style.display = 'none'
    startGame(row, col)
}

function showEndGame(){
    menu.style.display = 'flex'
}

