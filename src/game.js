var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
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

var platforms;

function preload() {
    this.load.image('sky', 'assets/img/sky.png');
    this.load.image('sheep', 'assets/img/sheep.png');
    this.load.image('platform', 'assets/img/platform.png');
}

function create() {
    this.add.image(0, 0, 'sky').setOrigin(0, 0);

    platforms = this.physics.add.staticGroup();

    platforms.create(600, 400, 'platform');

    player = this.physics.add.sprite(100, 450, 'sheep');

    player.setBounce(0.2);
    player.setScale(.5);
    player.setCollideWorldBounds(true);

    this.physics.add.collider(player, platforms);

    textFps = this.add.text(16, 16, 'Fps: ' + game.loop.actualFps, { fontSize: '16px', fill: '#000' });
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    textFps.setText('Fps: ' + game.loop.actualFps);

    if (cursors.up.isDown) {
        player.setVelocityY(-300);
        player.setVelocityX(160);
    }

    if (player.body.newVelocity.y > 1) {
        player.body.rotation = 10;
    } else if (player.body.newVelocity.y < -1) {
        player.body.rotation = -10;
    } else {
        player.body.rotation = 0;
    }
}