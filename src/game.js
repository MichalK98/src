var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
}

var game = new Phaser.Game(config);
var text;

function preload() {
    this.load.image('sky', 'assets/img/sky.png');
    this.load.image('sheep', 'assets/img/sheep.png');
}

function create() {
    this.add.image(0, 0, 'sky').setOrigin(0, 0);

    var player = this.physics.add.image(0, 0, 'sheep');
    player.setScale(.5);
    player.setBounce(.2);
    player.setCollideWorldBounds(true);

    scoreText = this.add.text(16, 16, 'fps', { fontSize: '32px', fill: '#000' });
}

function update() {
    scoreText.setText('Fps: ' + game.loop.actualFps);
}