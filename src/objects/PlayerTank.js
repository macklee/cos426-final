import Projectile from './Projectile'

class PlayerTank extends Phaser.Sprite {

    constructor(game, state, x, y, player) {
        super(game, x, y, 'tank');

        // basic position/status variables
        this.x = x;
        this.y = y;
        this.game = game;
        this.state = state;
        this.health = 3;
        this.player = player;
        this.alive = true;
        
        // sprite
        this.tank = game.add.sprite(x, y, 'tank');

        // physics & movement
        this.game.physics.arcade.enable(this.tank, Phaser.Physics.ARCADE);
        this.tank.body.immovable = false;
        this.tank.body.collideWorldBounds = true;
        this.tank.body.gravity.y = 300;
        this.tank.mass = 400
        this.turret = game.add.sprite(this.tank.x + 30, this.tank.y + 14, 'turret');
        this.game.physics.enable(this.turret, Phaser.Physics.ARCADE);
        this.turret.body.immovable = false;
        this.turret.body.collideWorldBounds = true;
        this.turret.body.gravity.y = 300;
        // fires a flame when shooting
        this.flame = game.add.sprite(0, 0, 'flame');
        this.flame.anchor.set(0.5);
        this.flame.visible = false;
        // this.tank.animations.add('left', [0, 1, 2, 3], 60, true);
        // this.tank.animations.add('right', [5, 6, 7, 8], 60, true);

        // angle for firing
        this.angle = 45;

        // key check for firing
        this.fireKey = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
		this.fireKey.onDown.add(this.fireProjectile, this);
    }

    fireProjectile() {
        if (this.state.turn != this.player-1) return;
        let proj = new Projectile(this.game, this.state, this.x, this.y, this);
        this.state.projectiles.add(proj);
        proj.fire(this.x, this.y, 0-this.angle, 0, 300);
    }

    damage() {
        this.health -= 1;
        console.log("player " + this.player + " was hit");
        if (this.health <= 0) {
            this.alive = false;
            this.kill();
            return true;
        }
        return false;
    }

    checkLand() {
        //  Simple bounds check
        //console.log("sup")
        if (this.tank.body.x < 0 || this.tank.body.x > this.game.world.width || this.tank.body.y > this.game.height)
        {
            this.removeBullet();
            return;
        }

        var x = Math.floor(this.tank.body.x);
        var y = Math.floor(this.tank.body.y);

        var rgba = this.state.land.getPixel(x, y);
        var rgba2 = this.state.land.getPixel(x+1, y+1);
        var rgba3 = this.state.land.getPixel(x-1, y-1);
        var rgba4 = this.state.land.getPixel(x-1, y+1);
        if (rgba.a > 0 || rgba2.a > 0 || rgba3.a || rgba4.a)
        {
            //console.log("lol")  
            // this.state.land.blendDestinationOut();
            // this.state.land.circle(x, y, 16, 'rgba(0, 0, 0, 255');
            // this.state.land.blendReset();
            // this.state.land.update();

            //  If you like you could combine the above 4 lines:
            //this.state.land.blendDestinationOut().circle(x, y, 16, 'rgba(0, 0, 0, 255').blendReset().update();

            this.tank.body.velocity.y = 0;
        }
    }

    update() {
        var hitPlatform = this.game.physics.arcade.collide(this.tank, this.state.platforms);
        
        this.tank.body.velocity.x = 0;
        if (this.state.cursors.left.isDown) {
            this.tank.body.velocity.x = -150;
            //this.tank.animations.play('left');
        }
        else if (this.state.cursors.right.isDown) {
            this.tank.body.velocity.x = 150;
            //this.tank.animations.play('left2');
        }
        else {
            this.tank.animations.stop();
            this.tank.frame = 4;
        }

        // if (this.state.cursors.up.isDown && this.tank.body.touching.down) {
        //     this.tank.body.velocity.y = -350;
        // }
        this.x = this.tank.body.x;
        this.y = this.tank.body.y;
    }

    endTurn() {
        this.tank.animations.stop();
        this.tank.body.velocity.x = 0;
        this.tank.frame = 4;
    }


}

export default PlayerTank;

    