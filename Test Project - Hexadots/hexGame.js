// Constructs game environment
let game;
let gameSettings = {
    hexSize: 75,
    fallSpeed: 100,
    destroySpeed: 200,
    boardOffset: {
        x: 100,
        y: 50
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
        this.load.spritesheet('hexagons', 'assets/Hexagon_Spritesheet.json', {
            frameWidth: gameSettings.hexSize,
            frameHeight: gameSettings.hexSize
        });
        this.load.image('line', 'assets/Line.png')
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
                let posX = gameSettings.boardOffset.x + gameSettings.hexSize * j + gameSettings.hexSize / 2;
                let posY = gameSettings.boardOffset.y + gameSettings.hexSize * i + gameSettings.hexSize / 2;

                let hex = this.add.sprite(posX, posY, 'hexagons', this.draw.valueAt(i, j));
                let arrow = this.add.sprite(posX, posY, 'line');
                line.setDepth(2);
                line.visible = false;
                this.arrowArray[i][j] = line;
                this.draw.setCustomData(i, j, hex);
            }
        }
    }
}


// Function that allows pointer to click on tiles and draw

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
    
    //returns true if item at (row, column) is valid
    validPick(row, column){
        return row >= 0 &amp;&amp; row < this.getRows() &amp;&amp; column >= 0 &amp;&amp; this.gameArray[row] != undefined &amp;&amp; this.gameArray[row][column] != undefined;
    }
    
    //returns value of item at (row, column)
    valueAt(row, column){
        if(!this.validPick(row, column)){
            return false;
        }
        return this.gameArray[row][column].value;
    }
}


// Backtrack function for drawing


// Destroy function that gets rid of tiles if conditions are met


// Function that tells remaining tiles how to move into empty spaces

    
