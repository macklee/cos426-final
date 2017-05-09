/************* CLASS FOR EACH TANK ****************/
PlayerTank = function (game, player) {

    var x = game.world.randomX;
    var y = game.world.randomY;

    this.game = game;
    this.health = 3;
    this.player = player;
    //this.hpBar = this.add.bitmapData(3, 1);
    //this.animations = this.tank.animations;
    //this.bullets = bullets;
    this.alive = true;

    //this.shadow = game.add.sprite(x, y, 'enemy', 'shadow');
    this.tank = game.add.sprite(x, y,'tank');
    //this.turret = game.add.sprite(x, y, 'enemy', 'turret');

    // this.shadow.anchor.set(0.5);
    // this.tank.anchor.set(0.5);
    // this.turret.anchor.set(0.3, 0.5);

    //this.tank.name = index.toString();
    game.physics.enable(this.tank, Phaser.Physics.ARCADE);
    this.tank.body.immovable = false;
    this.tank.body.collideWorldBounds = true;
    //this.tank.body.bounce.setTo(1, 1);
    this.tank.body.gravity.y = 300;
    this.tank.animations.add('left', [0, 1, 2, 3], 10, true);
    this.tank.animations.add('right', [5, 6, 7, 8], 10, true);
    //var hitPlatform = game.physics.arcade.collide(this.tank, platforms);
    // this.tank.angle = game.rnd.angle();

    // game.physics.arcade.velocityFromRotation(this.tank.rotation, 100, this.tank.body.velocity);

    // stuff for tracking angle of fire, measured in radians
    this.angle = 45;

};

PlayerTank.prototype.damage = function() {

    this.health -= 1;

    if (this.health <= 0)
    {
        this.alive = false;
        this.tank.kill();
        // this.turret.kill();

        return true;
    }

    return false;

}

PlayerTank.prototype.endTurn = function() {
    //  Stand still
    this.tank.animations.stop();
    this.tank.body.velocity.x = 0;
    this.tank.frame = 4;
}

PlayerTank.prototype.update = function() {

    // this.shadow.x = this.tank.x;
    // this.shadow.y = this.tank.y;
    // this.shadow.rotation = this.tank.rotation;

    // this.turret.x = this.tank.x;
    // this.turret.y = this.tank.y;
    // this.turret.rotation = this.game.physics.arcade.angleBetween(this.tank, this.player);

    // if (this.game.physics.arcade.distanceBetween(this.tank, this.player) < 300)
    // {
    //     if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
    //     {
    //         this.nextFire = this.game.time.now + this.fireRate;

    //         var bullet = this.bullets.getFirstDead();

    //         bullet.reset(this.turret.x, this.turret.y);

    //         bullet.rotation = this.game.physics.arcade.moveToObject(bullet, this.player, 500);
    //     }
    // }
        //collide iwth platforms
    var hitPlatform = game.physics.arcade.collide(this.tank, platforms);
    //var hitPlatform2 = game.physics.arcade.collide(player2, platforms);
//  Reset the players velocity (movement)

    this.tank.body.velocity.x = 0;
 
    if (cursors.left.isDown)
    {
                    //  Move to the left
        this.tank.body.velocity.x = -150;

        this.tank.animations.play('left');

    }
    else if (cursors.right.isDown)
    {
 
                    //  Move to the left
        this.tank.body.velocity.x = 150;

        this.tank.animations.play('right');

    }


    else
    {
        //  Stand still
        this.tank.animations.stop();
        this.tank.frame = 4;        
        
    }

    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && this.tank.body.touching.down)
    {
        this.tank.body.velocity.y = -350;
    }

};

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var cursors;
var platforms;

function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.image('bullet', 'assets/bullet164.png');
    game.load.image('tank', 'assets/advanced_wars_tank.png', 32, 48);    
}
var spaceKey;
var player;
var player2;
var turn;

function toggleTurn() {
    turn = 1 - turn;
    if (turn == 0) {
        player.update();
        player2.endTurn();
    }
    else if (turn == 1) {
        player2.update();
        player.endTurn();
    }
}

function create() {
    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    var ledge = platforms.create(400, 400, 'ground');

    ledge.body.immovable = true;

    ledge = platforms.create(-150, 250, 'ground');

    ledge.body.immovable = true;

    // The player and its settings
    player = new PlayerTank(game, 1);
    player2 = new PlayerTank(game, 2);

    //player = game.add.sprite(32, game.world.height - 150, 'tank');
    //player2 = game.add.sprite(game.world.width - 32, game.world.height - 150, 'tank');

    //  We need to enable physics on the player
    //game.physics.arcade.enable(player);
    //game.physics.arcade.enable(player2);

    //  Player physics properties. Give the little guy a slight bounce.
    // player.body.bounce.y = 0.2;
    // player.body.gravity.y = 300;
    // player.body.collideWorldBounds = true;

    // player2.body.bounce.y = 0.2;
    // player2.body.gravity.y = 300;
    // player2.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.

    cursors = game.input.keyboard.createCursorKeys();
    this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.spaceKey.onDown.add(toggleTurn, this);
    // game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
    turn = 0;
}

function update() {
    var hitPlatform = game.physics.arcade.collide(player.tank, platforms);
    var hitPlatform2 = game.physics.arcade.collide(player2.tank, platforms);
    // if (this.spaceKey.justPressed(2000))
    // {
    //     turn = 1 - turn;      
    // }

    if (turn == 0) {
        player.update();
        player2.endTurn();
    }
    else if (turn == 1) {
        player2.update();
        player.endTurn();
    }

}

function bulletHitPlayer (tank, bullet) {

    bullet.kill();

}

function fire () {

    if (game.time.now > nextFire && bullets.countDead() > 0)
    {
        nextFire = game.time.now + fireRate;

        var bullet = bullets.getFirstExists(false);

        bullet.reset(turret.x, turret.y);

        bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000, game.input.activePointer, 500);
    }

}