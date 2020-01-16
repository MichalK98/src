var WIDTH = 800;
var HEIGHT = 600;

var world = {
  width: WIDTH * 5,
  height: HEIGHT
};

var config = {
    type: Phaser.AUTO,
    width: WIDTH,
    height: HEIGHT,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
        render: render
    }
}

var game = new Phaser.Game(config);

var platforms;
var jump = true;

var start = 1000;;

function preload() {
    this.load.image('background', 'assets/img/sky.png');
    this.load.image('sheep', 'assets/img/sheep.png');
    this.load.image('platform', 'assets/img/platform.png');
}

function create() {
    //
    background = this.add.image(0, 0, 'background').setOrigin(0, 0);

    // Platforms
    platforms = this.physics.add.staticGroup().setOrigin(0, 0);

    // Pipes
    pipes = [
        [1000, 0],
        [1000, 500],
        [1500, 700],
        [1500, 200],
        [2000, 600],
        [2000, 100],
    ]

    pipes.forEach(pipe => {
        platforms.create(pipe[0], pipe[1], 'platform');
    });

    // Player
    player = this.physics.add.sprite(100, 200, 'sheep');
    
    player.setBounce(0.2);
    player.setScale(.5);
    player.setCollideWorldBounds(true);

    // Colliders
    this.physics.add.collider(player, platforms);

    // Camera
    this.cameras.main.startFollow(player);
    this.cameras.main.setBounds(0, 0, world.width, world.height);

    this.scene.scene.physics.world.setBounds(0, 0, world.width, world.height)

    textFps = this.add.text(16, 16, 'Fps: ' + game.loop.actualFps, { fontSize: '16px', fill: '#000' });
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    // Move background image to camera view
    background.x = this.cameras.main.worldView.x;
    
    // Move player automaticly
    player.setVelocityX(200);
    
    // Jump onlick
    if (cursors.up.isDown) {
        if (jump) {
            player.setVelocityY(-400);
            jump = false;
        }
    } else {
        jump = true;
    }

    // Player rotaion
    if (player.body.newVelocity.y > 1) {
        player.body.rotation = 10;
    } else if (player.body.newVelocity.y < -1) {
        player.body.rotation = -10;
    } else {
        player.body.rotation = 0;
    }

    // FPS
}

function render() {
    textFps.setText('Fps: ' + game.loop.actualFps);

}