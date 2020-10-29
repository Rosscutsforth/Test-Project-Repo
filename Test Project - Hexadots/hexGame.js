// Constructs game environment
let game;
let gameSettings = {
    hexSize: 71,
    fallSpeed: 100,
    destroySpeed: 200,
    boardOffset: {
        x: 87,
        y: 150
    }
}

window.onload = function() {
    let gameConfig = {
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.FIT,
//            autoCenter: Phaser. Scale.CENTER_BOTH,
            parent: 'thegame',
            width: 600,
            height: 800
        },
        scene: playGame
    }
    game = new Phaser.Game(gameConfig);
    window.focus();
}

// Constructor for game scene to test functions in

class playGame extends Phaser.Scene{
    constructor(){
        super('PlayGame');
    }
    preload(){
        this.load.spritesheet('hexagons', 'Assets/Hexagons.png', {
            frameWidth: gameSettings.hexSize,
            frameHeight: gameSettings.hexSize
        })
        this.load.image('line', 'Assets/Line.png')
    }
    create(){
        this.canPick = true;
        this.dragging = false;
        this.draw = new draw({
            rows: 6,
            columns: 6,
            items: 5
        });
        this.draw.generateField();
        this.drawField();
        this.input.on('pointerdown', this.hexSelect, this);
        this.input.on('pointermove', this.drawPath, this);
        this.input.on('pointerup', this.removeHex, this);
    }


// Horizontal and vertical matrix for game grid that randomly generates tiles

    drawField(){
        this.poolArray = [];
        this.arrowArray = [];
        for(let i = 0; i < this.draw.getRows(); i++){
            this.arrowArray[i] = [];
            for(let j = 0; j < this.draw.getColumns(); j++){
                if(i % 2 == 0) {
                    var posX = gameSettings.boardOffset.x + gameSettings.hexSize * j + gameSettings.hexSize;
                } else{
                    var posX = gameSettings.boardOffset.x + gameSettings.hexSize * j + gameSettings.hexSize / 2;
                }
                let posY = gameSettings.boardOffset.y + gameSettings.hexSize * i/1.25 + gameSettings.hexSize / 2;

                let hex = this.add.sprite(posX, posY, 'hexagons', this.draw.valueAt(i, j));
                let line = this.add.sprite(posX, posY, 'line');
                line.setDepth(2);
                line.visible = false;
                this.arrowArray[i][j] = line;
                this.draw.setCustomData(i, j, hex);
            }
        }
    }
    
    //Retrieves position of tile clicked on
    hexSelect(pointer){
        if(this.canPick){
            let row = Math.floor((pointer.y - gameSettings.boardOffset.y) / gameSettings.hexSize);
            let col = Math.floor((pointer.x - gameSettings.boardOffset.x) / gameSettings.hexSize);
            if(this.draw.validPick(row, col)){
                this.canPick = false;
                this.draw.putInChain(row, col)
                this.draw.customDataOf(row, col).alpha  = 0.5;
                this.dragging = true;
            }
        }
    }
    
    //draws path after click
    drawPath(pointer){
        if(this.dragging){
            let row = Math.floor((pointer.y - gameSettings.boardOffset.y) / gameSettings.hexSize);
            let col = Math.floor((pointer.x - gameSettings.boardOffset.x) / gameSettings.hexSize);
            if(this.draw.validPick(row, col)){
                let distance = Phaser.Math.Distance.Between(pointer.x, pointer.y, this.draw.customDataOf(row, col).x, this.draw.customDataOf(row, col).y);
                if(distance < gameSettings.gemSize * 0.4){
                    if(this.draw.continuesChain(row, col)){
                        this.draw.customDataOf(row, col).alpha = 0.5;
                        this.draw.putInChain(row, col);
                        this.displayPath()
                    }
                }
            }
        }
    }
    
    //removes hexes in chain
    removeHex(){
        if(this.dragging){
            this.hidePath();
            this.dragging = false;
            if(this.draw.getChainLength() < 3){
                let chain = this.draw.emptyChain();
                chain.forEach(function(item){
                    this.draw.customDataOf(item.row, item.column).alpha = 1;
                }.bind(this));
                this.canPick = true;
            }
            else{
                let hexToRemove = this.draw.destroyChain();
                let destroyed = 0;
                hexToRemove.forEach(function(hex){
                    this.poolArray.push(this.draw.customDataOf(hex.row, hex.column))
                    destroyed ++;
                    this.tweens.add({
                        targets:
                        this.draw.customDataOf(hex.row, hex.column),
                        alpha: 0,
                        duration: gameSettings.destroySpeed,
                        callbackScope: this,
                        onComplete: function(event, sprite){
                            destroyed --;
                            if(destroyed == 0){
                               this.makeHexFall();
                            }
                        }
                    });
                }.bind(this));
            }
        }
    }
}


//Function that allows pointer to click on tiles and draw

class draw{
    constructor(obj){
        if(obj == undefined){
            obj = {}
        }
        this.rows = (obj.rows != undefined) ? obj.rows : 6;
        this.columns = (obj.columns != undefined) ? obj.columns : 6;
        this.items = (obj.items != undefined) ? obj.items : 6;
        this.chain = [];
    }
    
    //returns rows in board
    getRows(){
        return this.rows;
    }
    
    //returns columns in board
    getColumns(){
        return this.columns;
    }
    
    //generates game field
    generateField(){
        this.gameArray = [];
        for(let i = 0; i < this.getRows(); i++){
            this.gameArray[i] = [];
            for(let j = 0; j < this.getColumns(); j++){
                let randomValue = Math.floor(Math.random() * this.items);
                this.gameArray[i][j] = {
                    value: randomValue,
                    isEmpty: false,
                    row: i,
                    column: j
                }
            }
        }
    }
    
    //returns true if item at (row, column) is defined in the generated field
    validPick(row, column){
        return row >= 0 && row < this.getRows()
        && column >= 0 &&
        this.gameArray[row] != undefined && this.gameArray[row][column] != undefined;
    }
    
    //returns value of item at (row, column)
    valueAt(row, column){
        if(!this.validPick(row, column)){
            return false;
        }
        return this.gameArray[row][column].value;
    }
    
    //gives each item at (row, column) custom data
    setCustomData(row, column, customData) {
        this.gameArray[row][column].customData = customData;
    }
    
    //returns custom data of item at (row, column)
    customDataOf(row, column){
        return this.gameArray[row][column].customData;
    }
    
    //puts item at (row, column) in draw chain
    putInChain(row, column){
        this.chain.push({
            row: row,
            column: column
        })
    }
}


// Backtrack function for drawing


// Destroy function that gets rid of tiles if conditions are met


// Function that tells remaining tiles how to move into empty spaces

    
