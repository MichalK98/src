// Canvas size
var WIDTH = 800;
var HEIGHT = 600;

// Game world size
var world = {
  width: WIDTH * Number.MAX_VALUE,
  height: HEIGHT
};

// Game settings
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
        update: update
    }
}

var game = new Phaser.Game(config);

// Platforms
var platforms;

// Jump
var jump = true;

// Pipe
var pipes = [];
// Pipe settings
var pipeMin = -250;
var pipeMax = 150;
var pipeGap = 700;
// Pipe variables
var pipeRandom;
var pipeNumberNew;
var pipeNumberOld = 0;

// Camera
var cameraPosition;

function preload() {
    // Load game assets
    this.load.image('background', 'assets/img/sky.png');
    this.load.image('title', 'assets/img/title.png');
    this.load.image('platform', 'assets/img/platform.png');
    this.load.image('sheep', 'assets/img/sheep.png');
    this.load.spritesheet(
        'sheep-slide',
        'assets/img/sheep-slide.png',
        {frameWidth: 100, frameHeight: 84}
    );
}

function create() {
    // Background
    background = this.add.image(-100, 0, 'background').setOrigin(0, 0);
    this.add.image(0, 0, 'title').setOrigin(0, 0);

    // Platforms
    platforms = this.physics.add.staticGroup().setOrigin(0, 0);

    // Player
    player = this.physics.add.sprite(100, 580, 'sheep');
    // Player settings
    player.setBounce(0.2);
    player.setScale(.5);
    player.setCollideWorldBounds(true);
    // Player animations
    this.anims.create({
        key: 'sheep-slide',
        frames: this.anims.generateFrameNumbers('sheep-slide', { start: 0, end: 4 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'sheep-turn',
        frames: this.anims.generateFrameNumbers('sheep-slide', { start: 0, end: 0 }),
        frameRate: 10,
    });

    // Colliders
    this.physics.add.collider(player, platforms);

    // Camera
    this.cameras.main.startFollow(player);
    this.cameras.main.setBounds(0, 0, world.width, world.height);
    this.scene.scene.physics.world.setBounds(0, 0, world.width, world.height);

    // Cursors
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    // Get the camera position
    cameraPosition = this.cameras.main.worldView.x;
    // Move background image to camera view
    background.x = cameraPosition - 100;

    // Get the number of pipes 
    pipeNumberNew = Math.floor(cameraPosition / 500);
    
    // Chceck if need more pipes
    if (pipeNumberNew > pipeNumberOld) {
        
        // Randomize a new pipe location
        pipeRandom = Phaser.Math.Between(pipeMin, pipeMax);
        // Add to pipe array
        pipes.push(
            [Math.floor(cameraPosition + 1000), pipeRandom],
            [Math.floor(cameraPosition + 1000), pipeRandom + pipeGap]
        );

        // Remove old pipes
        if (pipes.length > 10) {
            pipes.splice(0, 2);
        }

       // Draw pipes from array
        pipes.forEach(pipe => {
            platforms.create(pipe[0], pipe[1], 'platform');
        });

        // Set old pipe to new
        pipeNumberOld = pipeNumberNew;
    }

    // Player
    // Prevent spam jump
    if (cursors.up.isDown) {
        // Jump
        if (jump) {
            player.setVelocityX(200);
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
    // Blood animations
    if (player.body.speed >= 100) {
        if (player.body.touching.down || player.body.y >= 508) {
            player.anims.play('sheep-slide', true);
        } else {
            player.anims.play('sheep-turn');
        }
    } else {
        player.anims.play('sheep-turn');
    }
}