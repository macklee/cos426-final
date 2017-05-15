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
        
        Phaser.Sprite.call(this, game, x, y, 'tank');
        game.add.existing(this);

        // sprite
        // this.tank = game.add.sprite(x, y, 'tank');

        // physics & movement
        this.game.physics.arcade.enable(this, Phaser.Physics.ARCADE);
        this.body.immovable = false;
        this.body.collideWorldBounds = true;
        this.body.gravity.y = 300;
        
        this.turret = game.add.sprite(this.x + 30, this.y + 14, 'turret');
        this.game.physics.enable(this.turret, Phaser.Physics.ARCADE);
        this.turret.body.immovable = false;
        this.turret.body.collideWorldBounds = true;
        this.turret.body.gravity.y = 300;
        // fires a flame when shooting
        this.flame = game.add.sprite(0, 0, 'flame');
        this.flame.anchor.set(0.5);
        this.flame.visible = false;

        // LIGHTSSSS
        this.state.lights.add(this);

        // physics & movement
        // this.game.physics.arcade.enable(this.tank, Phaser.Physics.ARCADE);
        // this.tank.body.immovable = false;
        // this.tank.body.collideWorldBounds = true;
        // this.tank.body.gravity.y = 300;
        // this.tank.mass = 400
        // this.turret = game.add.sprite(this.tank.x + 30, this.tank.y + 14, 'turret');
        // this.game.physics.enable(this.turret, Phaser.Physics.ARCADE);
        // this.turret.body.immovable = false;
        // this.turret.body.collideWorldBounds = true;
        // this.turret.body.gravity.y = 300;
        // // fires a flame when shooting
        // this.flame = game.add.sprite(0, 0, 'flame');
        // this.flame.anchor.set(0.5);
        // this.flame.visible = false;

        // this.tank.animations.add('left', [0, 1, 2, 3], 60, true);
        // this.tank.animations.add('right', [5, 6, 7, 8], 60, true);

        // angle for firing
        this.fireAngle = 45;

        // key check for firing
        this.fireKey = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
		this.fireKey.onDown.add(this.fireProjectile, this);
    }

    fireProjectile() {
        if (this.state.turn != this.player-1) return;
        let proj = new Projectile(this.game, this.state, this.x, this.y, this);
        this.state.projectiles.add(proj);
        proj.fire(this.x, this.y, 0-this.fireAngle, 0, 300);
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

    update(hit) {

        
        this.body.velocity.x = 0;
        if (this.state.cursors.left.isDown) {
            if (this.state.turn == this.player-1) this.body.velocity.x = -150;
            //this.tank.animations.play('left');
        }
        else if (this.state.cursors.right.isDown) {
            if (this.state.turn == this.player-1) this.body.velocity.x = 150;
            //this.tank.animations.play('left2');
        }
        else {
            this.animations.stop();
            this.frame = 4;
        }

        if (this.state.cursors.up.isDown && hit) {
            this.body.velocity.y = -150;
        }
        this.x = this.body.x;
        this.y = this.body.y;
    }

    endTurn() {
        this.animations.stop();
        this.body.velocity.x = 0;
        this.frame = 4;
    }


}

export default PlayerTank;

    