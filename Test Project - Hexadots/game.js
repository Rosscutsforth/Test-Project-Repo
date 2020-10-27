// Constructs game environment
let game;
let gameSettings = {
    hexSize: 75,
    fallSpeed: 100,
    destroySpeed: 200,
    boardOffset: {
        x: 100,
        y: 200
    }
}

window.onload = function() {
    let gameConfig = {
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser. Scale.CENTER_BOTH,
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
}

// Horizontal and vertical array for game grid that randomly generates tiles


// Function that allows pointer to click on tiles and draw


// Backtrack function for drawing


// Destroy function that gets rid of tiles if conditions are met


// Function that tells remaining tiles how to move into empty spaces

