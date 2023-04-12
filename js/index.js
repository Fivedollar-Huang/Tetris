const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const menu = document.getElementById('menu')
const gameWindow = document.getElementById('gameWindow')
const inputRow = document.getElementById('inputRow')
const inputCol = document.getElementById('inputCol')

const startButton = document.querySelector('.startButton')
const menuTitle = document.querySelector('.menuTitle')

window.addEventListener('resize', resizeWindow)
startButton.addEventListener('click', startGameEvent)


var boardSize = {
    row: 20,
    col: 10,
    width: 0,
}

// resizeWindow() // fix the size 


function resizeWindow(){
    if(!gameRunning) return
    // canvas.width = 300
    // canvas.height = 600
    let width = window.innerWidth * 90 / 100
    let height = window.innerHeight * 90 / 100

    // console.log(boardSize)

    let totalRow = boardSize.row + 2
    let totalCol = boardSize.col + 7

    let boxWidth = width / totalCol
    let boxHeight = height / totalRow

    boardSize.width = boxWidth < boxHeight? boxWidth : boxHeight

    if(gameboard){
        gameboard.resize()
    }

    canvas.style.width = boardSize.width * totalCol + 'px'
    canvas.style.height = boardSize.width * totalRow + 'px'
    canvas.width = boardSize.width * totalCol
    canvas.height = boardSize.width * totalRow

    gameWindow.style.paddingTop = canvas.width*5/100 + 'px'
}

function showMenu(){
    menu.style.display = 'flex'
}
function hideMenu(){
    menu.style.display = 'none'
}

function startGameEvent(){
    let row = parseInt(inputRow.value || 20)
    let col = parseInt(inputCol.value || 10)
    if(row > 50) row = 50
    else if(row < 15) row = 15
    if(col > 50) col = 50
    else if(col < 5) col = 5

    menu.style.display = 'none'
    boardSize.row = row
    boardSize.col = col
    startGame(row, col)
    resizeWindow()

}

function showEndGame(score){
    menu.style.display = 'flex'
    startButton.textContent = 'Restart Game'
    menuTitle.innerHTML = `You Lose <br> Score: ${score}`
    gameRunning = false
}

