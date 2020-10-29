let game;
let gameOptions = {
    hexSize: 75,
    fallSpeed: 100,
    destroySpeed: 200,
    boardOffset: {
        x: 100,
        y: 50
    }
}

window.onload = function(){
    let gameConfig = {
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.FIT,
//            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: "thegame",
            width: 600,
            height: 800
        },
        scene: playGame
    }
    game = new Phaser.Game(gameConfig);
    window.focus();
}

class playGame extends Phaser.Scene{
    constructor(){
        super('PlayGame');
    }
    
    preload(){
        this.load.image('black_hexagon', 'Assets/Black_Hex.png', {
            frameWidth: gameOptions.hexSize,
            frameHeight: gameOptions.hexSize
        });
        this.load.atlas('hexagons', 'Assets/Hexagon_Spritesheet.png', 'Assets/Hexagon_Spritesheet.json')
        this.load.image('line', 'Assets/Line.png',{
            frameWidth: 10,
            frameHeight: gameOptions.hexSize *3
        });
    }
    
    create(){
        this.add.image(300, 400, 'black_hexagon').setScale(.1);
        this.add.image(400, 400, 'black_hexagon').setScale(.1);
        this.make.sprite({
            x: 100,
            y: 100,
            key: 'hexagons'
        }).setScale(.1);
    }
}
