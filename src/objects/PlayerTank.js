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
        
        // this.turret = game.add.sprite(this.x + 30, this.y + 14, 'turret');
        // this.game.physics.enable(this.turret, Phaser.Physics.ARCADE);
        // this.turret.body.immovable = false;
        // this.turret.body.collideWorldBounds = true;
        // this.turret.body.gravity.y = 300;
        // fires a flame when shooting
        this.flame = game.add.sprite(0, 0, 'flame');
        this.flame.anchor.set(0.5);
        this.flame.visible = false;

        // LIGHTSSSS
        this.state.lights.add(this);

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

    drawAngleIndicator() {
        // fireAngle indicator
        if (this.state.turn == this.player-1) {
            this.state.graphics.clear();
            // draw arc
            this.state.graphics.lineStyle(1, 0xFF3300);
            this.state.graphics.beginFill(0xFFFFFF, 0.2);
            this.state.graphics.arc(this.x+12, this.y-2, 36, this.game.math.degToRad(2), this.game.math.degToRad(-90.0), true);
            this.state.graphics.endFill();

            // draw aiming needle
            this.state.graphics.moveTo(this.x+12, this.y-2);
            this.state.graphics.lineTo(this.x+12+36*Math.cos(this.game.math.degToRad(this.fireAngle)), this.y-2-36*Math.sin(this.game.math.degToRad(this.fireAngle)));
            this.state.graphics.moveTo(0, 0);
        }
    }

    update(hit) {
        this.drawAngleIndicator();
        this.body.velocity.x = 0;
        if (this.state.turn == this.player-1) {
            if (this.state.cursors.left.isDown) {
                this.body.velocity.x = -150;
            }
            else if (this.state.cursors.right.isDown) {
                this.body.velocity.x = 150;
            }
            else {
                this.animations.stop();
            }
            if (this.state.cursors.up.isDown) {
                if (this.fireAngle < 90) {
                    this.fireAngle += 0.3;
                }
            }
            if (this.state.cursors.down.isDown) {
                if (this.fireAngle > 0) {
                    this.fireAngle -= 0.3;
                }
            }
        }
        if (this.state.jumpKey.isDown && hit) {
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

    