class Gameboard{

    constructor(row, col){
        this.dropSpeed = 1000

        this.dimension = {
            row,
            col
        }
        this.board = []
        for(let i = 0; i < this.dimension.row; i++){
            this.board.push([])
            for(let j = 0; j < this.dimension.col; j++){
                this.board[i].push(0)
            }
        }
        this.blockWidth = 10
        
        this.tetromino = {
            position: [], 
            color: 0,
            shape: [],
        }

        this.nextTetromino = {
            position: [], 
            color: 0,
            shape: [],
        }

        this.holdTetromino = {
            position: [], 
            color: 0,
            shape: [],
        }

        this.createNewTetromino()
        this.createNewTetromino()

        this.lastExecute = performance.now()
        this.timePassed = this.lastExecute
        this.running = true
        
        this.hold = false

        this.score = 0
        this.resize()
    }


    // ****** what to do each frame ******
    update(){
        if(this.running){
            this.fall()
            this.draw()
        }
    }
    draw(){
        // reset screen
        ctx.fillStyle = 'gray'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = colors[0]
        ctx.fillRect(this.blockWidth, this.blockWidth,
                     this.blockWidth * this.dimension.col,
                     this.blockWidth * this.dimension.row)

        this.drawNextTetromino()
        this.drawHoldTetromino()
        this.drawText('next: ', 1)
        this.drawText('hold: ', 7)
        this.drawText('score: ', 13)
        this.drawText(this.score, 14)

        // draw occupied blocks
        for(let i = 0; i < this.dimension.row; i++){
            for(let j = 0; j < this.dimension.col; j++){
                if(this.board[i][j] != 0){
                    this.drawBlock(i, j, this.board[i][j])
                }
            }
        }
        this.drawFallingBlock()
    }
    fall(){
        // Check if tetromino exist
        if(this.tetromino.position == -1) return

        // Check time frame
        this.timePassed = performance.now()
        if(this.timePassed - this.lastExecute < this.dropSpeed){
            return
        }
        this.lastExecute = this.timePassed

        // check if there are empty spaces
        let fallable = this.checkFallable()
        if(fallable){
            this.tetromino.position[0]++;
            return
        }

        this.stablizeTetromino()

        this.tetromino.position = -1
        this.createNewTetromino()
    }

    // ****** contents to be display ******
    drawBlock(row, col, color){
        if(row < 0) return
        ctx.fillStyle = colors[color]
        ctx.fillRect(
            this.blockWidth * (col+1), this.blockWidth * (row+1),
            this.blockWidth, this.blockWidth
        )
    }
    drawText(text, row){
        ctx.font = `${this.blockWidth}px Arial`
        ctx.fillStyle = 'black'

        ctx.textAlign = 'left'
        ctx.textBaseline = 'bottom'
        ctx.fillText(
            text, 
            this.blockWidth * (this.dimension.col + 2),
            this.blockWidth * (row + 1)
        )
    }
    drawFallingBlock(){
        if(this.tetromino.position == -1) return
        for(let i = 0; i < this.tetromino.shape.length; i++){
            for(let j = 0; j < this.tetromino.shape.length; j++){
                if(this.tetromino.shape[i][j] != 0){
                    this.drawBlock(
                        this.tetromino.position[0] + i,
                        this.tetromino.position[1] + j,
                        this.tetromino.color
                    )
                    // ctx.fillStyle = colors[this.tetromino.color]
                    // ctx.fillRect(
                    //     this.blockWidth * (j + this.tetromino.position[1]+1),
                    //     this.blockWidth * (i + this.tetromino.position[0]+1),
                    //     this.blockWidth, this.blockWidth
                    // )
                }
            }
        }
    }
    drawHoldTetromino(){
        ctx.fillStyle = colors[0]
        ctx.fillRect(this.blockWidth * (this.dimension.col + 2),
                     this.blockWidth * 8,
                     this.blockWidth * this.holdTetromino.shape.length,
                     this.blockWidth * this.holdTetromino.shape.length)

        for(let i = 0; i < this.holdTetromino.shape.length; i++){
            for(let j = 0; j < this.holdTetromino.shape.length; j++){
                if(this.holdTetromino.shape[i][j] != 0)
                    this.drawBlock(i + 7, j + this.dimension.col + 1, this.holdTetromino.color)
            }
        }
    }
    drawNextTetromino(){
        ctx.fillStyle = colors[0]
        ctx.fillRect(this.blockWidth * (this.dimension.col + 2),
                     this.blockWidth * 2,
                     this.blockWidth * this.nextTetromino.shape.length,
                     this.blockWidth * this.nextTetromino.shape.length)

        for(let i = 0; i < this.nextTetromino.shape.length; i++){
            for(let j = 0; j < this.nextTetromino.shape.length; j++){
                if(this.nextTetromino.shape[i][j] != 0)
                    this.drawBlock(i + 1, j + this.dimension.col + 1, this.nextTetromino.color)
            }
        }
    }



    // ****** block reaches bottom ******
    // stablize tetromino, put tetromino into the board
    stablizeTetromino(){
        for(let i = 0; i < this.tetromino.shape.length; i++){
            for(let j = 0; j < this.tetromino.shape.length; j++){
                if(this.tetromino.shape[i][j] != 0){
                    let row = this.tetromino.position[0] + i
                    let col = this.tetromino.position[1] + j
                    if(row < 0){
                        this.running = false
                    }
                    else{
                        this.board[row][col] = this.tetromino.color
                    }
                }
            }
        }
        this.draw()
        
        if(!this.running){
            console.log("gameOver")
            showEndGame(this.score)
            return
        }

        let rows = this.findFilledRows()
        if(rows.length > 0){
            this.running = false
            this.blingBlingBling(6, rows)
        }
        // this.clearRows()
    }
    blingBlingBling(count, rows){
        if(count > 0){
            if(count % 2){
                for(let i = 0; i < rows.length; i++){
                    for(let j = 0; j < this.dimension.col; j++){
                        this.drawBlock(rows[i], j, this.board[rows[i]][j])
                    }
                }
            }
            else{
                for(let i = 0; i < rows.length; i++){
                    for(let j = 0; j < this.dimension.col; j++){
                        this.drawBlock(rows[i], j, 0)
                    }
                }
            }
            setTimeout(()=>this.blingBlingBling(count-1, rows), 200)
        }
        else{
            this.clearRows(rows)
            this.running = true
        }
    }
    clearRows(rows){
        for(let i = 0; i < rows.length; i++){
            let row = rows[i]
            while(row > 0){
                for(let col = 0; col < this.dimension.col; col++){
                    this.board[row][col] = this.board[row-1][col]
                }
                row--
                for(let col = 0; col < this.dimension.col; col++){
                    this.board[0][col] = 0
                }
            }
        }
        switch(rows.length){
            case 4:
                this.score += 800
                break;
            case 3:
                this.score += 500
                break;
            case 2:
                this.score += 300
                break;
            case 1:
                this.score += 100
                break;
        }
    }



    // ****** what user can do ******
    rotate(){
        let newShape = []
        for(let i = 0; i < this.tetromino.shape.length; i++){
            newShape.push([])
            for(let j = 0; j < this.tetromino.shape.length; j++){
                newShape[i].push(
                    this.tetromino.shape[this.tetromino.shape.length - j - 1][i]
                )
            }
        }
        if(this.checkCollision(newShape, this.tetromino.position)){
            this.tetromino.shape = newShape
            return
        }

        // *** wall kicks ***
        // kick left:
        if(this.checkCollision(newShape, this.tetromino.position, -1)){
            this.tetromino.shape = newShape
            this.tetromino.position[1]--
            return
        }

        //kick right:
        if(this.checkCollision(newShape, this.tetromino.position, 1)){
            this.tetromino.shape = newShape
            this.tetromino.position[1]++
            return
        }

        // *** double kicks ***
        // kick left:
        if(this.checkCollision(newShape, this.tetromino.position, -2)){
            this.tetromino.shape = newShape
            this.tetromino.position[1] -= 2
            return
        }

        //kick right:
        if(this.checkCollision(newShape, this.tetromino.position, 2)){
            this.tetromino.shape = newShape
            this.tetromino.position[1] += 2
            return
        }
        

    }
    moveLeft(){
        if(this.checkMoveable(true)){
            this.tetromino.position[1]--;
        }
    }
    moveRight(){
        if(this.checkMoveable(false)){
            this.tetromino.position[1]++;
        }
    }
    // fast/slow drop to change falling speed
    fastDrop(){
        this.dropSpeed = 100
    }
    normalDrop(){
        this.dropSpeed = 1000
    }
    // hold current tetromino
    holdCurrentTetromino(){
        if(this.hold) return
        let posCol = -2 + Math.ceil(this.dimension.col/2)
        if(this.holdTetromino.position.length == 0){
            console.log("Hold current block")
            this.holdTetromino.position = [
                this.tetromino.position[0],
                posCol,
            ]
            this.holdTetromino.color = this.tetromino.color
            for(let i = 0; i < this.tetromino.shape.length; i++){
                this.holdTetromino.shape.push([])
                for(let j = 0; j < this.tetromino.shape.length; j++){
                    this.holdTetromino.shape[i].push(this.tetromino.shape[i][j])
                }
            }
            this.createNewTetromino()
        }
        else{
            let temp = this.tetromino
            this.tetromino = this.holdTetromino
            this.holdTetromino = temp

            if(this.tetromino.shape.length == 4){
                // I block (long one)
                this.tetromino.position = [-2, posCol]
            }
            else{
                this.tetromino.position = [-3, posCol]
            }
        }
        this.hold = true
    }
    // drop to bottom
    bottomDrop(){
        while(this.checkFallable()){
            this.tetromino.position[0]++;
        }

        this.stablizeTetromino()

        this.tetromino.position = -1
        this.createNewTetromino()
        this.lastExecute = this.timePassed
    }



    // ****** helper functions ******
    createNewTetromino(){
        let temp = this.tetromino
        this.tetromino = this.nextTetromino

        this.nextTetromino = temp
        const randomIndex = Math.floor(Math.random() * blocks.length);
        let newTetromino = blocks[randomIndex];
        this.nextTetromino.position = [
            newTetromino.position[0], 
            newTetromino.position[1] + Math.ceil(this.dimension.col/2),
        ]
        this.nextTetromino.color = newTetromino.color
        this.nextTetromino.shape = []
        for(let i = 0; i < newTetromino.shape.length; i++){
            this.nextTetromino.shape.push([])
            for(let j = 0; j < newTetromino.shape.length; j++){
                this.nextTetromino.shape[i].push(newTetromino.shape[i][j])
            }
        }
        this.hold = false

    }
    checkCollision(shape, pos, kick=0){
        for(let i = 0; i < shape.length; i++){
            for(let j = 0; j < shape.length; j++){
                let row = pos[0] + i
                let col = pos[1] + j + kick
                if(shape[i][j] != 0){
                    if(row >= this.dimension.row ||
                        col < 0 || col >= this.dimension.col){
                        return false
                    }
                    if(row >= 0 && this.board[row][col] != 0){
                        return false
                    }
                }
            }
        }
        return true
    }
    checkFallable(){
        let fallable = true
        for(let i = 0; i < this.tetromino.shape.length; i++){
            for(let j = 0; j < this.tetromino.shape.length; j++){
                if(this.tetromino.shape[i][j] != 0){
                    let row = this.tetromino.position[0] + i + 1
                    let col = this.tetromino.position[1] + j
                    if( row >= this.dimension.row || col >= this.dimension.col ||
                        (row >= 0 && col >= 0 && this.board[row][col] != 0))
                    {
                        fallable = false
                        break;
                    }
                }
            }
        }
        return fallable
    }
    checkMoveable(left=false){
        let moveable = true
        if(left){ // moving left
            for(let i = 0; i < this.tetromino.shape.length; i++){
                for(let j = 0; j < this.tetromino.shape[i].length; j++){
                    if(this.tetromino.shape[i][j] != 0){
                        let row = this.tetromino.position[0] + i
                        let col = this.tetromino.position[1] + j - 1
    
                        if(col < 0 || row >= 0 && this.board[row][col] != 0 ){
                            moveable = false
                            break;
                        }

                    }
                }
            } 
        }
        else{ // moving right
            for(let i = 0; i < this.tetromino.shape.length; i++){
                for(let j = 0; j < this.tetromino.shape[i].length; j++){
                    if(this.tetromino.shape[i][j] != 0){
                        let row = this.tetromino.position[0] + i
                        let col = this.tetromino.position[1] + j + 1
    
                        if( col >= this.dimension.col || 
                            row >= 0 && this.board[row][col] != 0 )
                        {
                            moveable = false
                            break;
                        }
                        
                    }
                }
            }             
        }
        return moveable
    }
    findFilledRows(){
        let rows = []
        for(let i = 0; i < this.tetromino.shape.length; i++){
            let clear = true
            let row = i + this.tetromino.position[0]
            if(row < 0 || row >= this.dimension.row){
                console.log("Outside the board")
                break
            }
            for(let col = 0; col < this.dimension.col; col++){
                if(this.board[row][col] == 0){
                    clear = false
                    break
                }
            }
            if(clear){
                rows.push(row)
            }
        }
        
        return rows
    }


    // ****** what to do when window size change ******
    resize(){
        this.blockWidth = boardSize.width
    }
}
