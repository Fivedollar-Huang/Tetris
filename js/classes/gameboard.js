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
        this.blockWidth = this.getBlockWidth()
        
        this.tetromino = {
            position: [], 
            color: 0,
            shape: [[]],
        }
        this.createTetromino()

        this.lastExecute = performance.now()
        this.timePassed = this.lastExecute
        this.running = true
    }
    update(){
        if(this.running){
            this.draw()
            this.fall()
            this.drawFallingBlock()
        }
    }

    drawBlock(row, col, color){
        ctx.fillStyle = colors[color]
        ctx.fillRect(
            this.blockWidth * col, this.blockWidth * row,
            this.blockWidth, this.blockWidth
        )
    }

    draw(){
        // reset screen
        ctx.fillStyle = 'lightgray'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // draw occupied blocks
        for(let i = 0; i < this.dimension.row; i++){
            for(let j = 0; j < this.dimension.col; j++){
                if(this.board[i][j] != 0){
                    this.drawBlock(i, j, this.board[i][j])
                }
            }
        }
        // draw grid
        // ctx.beginPath();
        // for(let i = 0; i < this.dimension.row; i++){
        //     ctx.strokeStyle = 'gray'
        //     ctx.moveTo(0, this.blockWidth*i)
        //     ctx.lineTo(this.blockWidth * this.dimension.col, this.blockWidth*i)
        // }
        // for(let i = 0; i < this.dimension.col; i++){
        //     ctx.strokeStyle = 'gray'
        //     ctx.moveTo(this.blockWidth*i, 0)
        //     ctx.lineTo(this.blockWidth*i, this.blockWidth * this.dimension.row)
        // }
        // ctx.stroke()
    }

    drawFallingBlock(){
        if(this.tetromino.position == -1) return
        for(let i = 0; i < this.tetromino.shape.length; i++){
            for(let j = 0; j < this.tetromino.shape.length; j++){
                if(this.tetromino.shape[i][j] != 0){
                    ctx.fillStyle = colors[this.tetromino.color]
                    ctx.fillRect(
                        this.blockWidth * (j + this.tetromino.position[1]),
                        this.blockWidth * (i + this.tetromino.position[0]),
                        this.blockWidth, this.blockWidth
                    )
                }
            }
        }
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
        this.createTetromino()
    }

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
            showEndGame()
            return
        }

        let rows = this.findFilledRows()
        if(rows.length > 0){
            this.running = false
            this.blingBlingRows(6, rows)
        }
        // this.clearRows()
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
    }

    blingBlingRows(count, rows){
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
                        ctx.fillStyle = colors[0]
                        ctx.fillRect(
                            0, this.blockWidth * rows[i],
                            this.blockWidth * this.dimension.col, 
                            this.blockWidth
                        )
                    }
                }
            }
            setTimeout(()=>this.blingBlingRows(count-1, rows), 200)
        }
        else{
            this.clearRows(rows)
            this.running = true
        }
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

    checkFallable(){
        let fallable = true
        for(let i = 0; i < this.tetromino.shape.length; i++){
            for(let j = 0; j < this.tetromino.shape[i].length; j++){
                if(this.tetromino.shape[i][j] != 0){
                    let row = this.tetromino.position[0] + i + 1
                    let col = this.tetromino.position[1] + j

                    if( row >= this.dimension.row || col >= this.dimension.col ||
                        (row >= 0 && this.board[row][col] != 0))
                    {
                        fallable = false
                        break;
                    }
                }
            }
        }
        return fallable
    }





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
    fastDrop(){
        this.dropSpeed = 100
    }
    normalDrop(){
        this.dropSpeed = 1000
    }

    checkCollision(shape, pos){
        for(let i = 0; i < shape.length; i++){
            for(let j = 0; j < shape.length; j++){
                let row = pos[0] + i
                let col = pos[1] + j
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



    createTetromino(){
        const randomIndex = Math.floor(Math.random() * blocks.length);
        let newTetromino = blocks[randomIndex];
        this.tetromino.position = [
            newTetromino.position[0], 
            newTetromino.position[1] + this.dimension.col/2,
        ]
        this.tetromino.color = newTetromino.color
        this.tetromino.shape = []
        for(let i = 0; i < newTetromino.shape.length; i++){
            this.tetromino.shape.push([])
            for(let j = 0; j < newTetromino.shape.length; j++){
                this.tetromino.shape[i].push(newTetromino.shape[i][j])
            }
        }

    }

    getBlockWidth(){
        let min = canvas.width / this.dimension.col
        if(min > canvas.height / this.dimension.row){
            min = canvas.height/this.dimension.row
        }
        return min
    }
}
