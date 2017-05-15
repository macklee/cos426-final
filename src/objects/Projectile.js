class Projectile extends Phaser.Sprite {

    constructor (game, state, x, y, source) {
        super(game, x, y, 'bullet');

        // basic position/status variables
        this.game = game;
        this.state = state;
        this.x = x;
        this.y = y;
        this.source = source;
        this.exists = false;

        Phaser.Sprite.call(this, game, x, y, 'bullet');
        game.add.existing(this);

        // sprite
        // this.bullet = game.add.sprite(x, y, 'bullet');

        // physics & movement
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.setCircle(3.5);
        this.body.immovable = false;
        this.body.checkWorldBounds = true;
        this.body.outOfBoundsKill = true;
        this.body.gravity.y = 300;
        this.angle = source.fireAngle;
        this.tracking = false;
        this.scaleSpeed = 0;

        // bullet properties
        this.strength = 1;
        this.speed = 300;
      
    }

    fire(x, y, angle, gx, gy) {
        gx = gx || 0;
        gy = gy || 0;
        //this.reset(x, y);
        this.scale.set(1);
        this.game.physics.arcade.velocityFromAngle(angle, this.speed, this.body.velocity);
        
        this.angle = angle;
        this.body.gravity.set(gx, gy);
    }



    update() {
        //this.bullet.body.velocity.x = 300;
        var hitTank;
        // check for collision with p2 if fired by p1
        if (this.source.player == 1) {
            hitTank = this.game.physics.arcade.overlap(this, this.state.player2, this.onHitPlayer);
        }
        else if (this.source.player == 2) {
            hitTank = this.game.physics.arcade.overlap(this, this.state.player, this.onHitPlayer);
        }

        // check for collision with platforms
        var hitPlatform = this.game.physics.arcade.collide(this, this.state.layer, this.onHitGround);
    }

    /* doesn't work, has to reference the parent obj and not the sprite 3itself */
    onHitPlayer(bullet, target) {
        
        //bullet.state.lights.remove(this);
        target.damage();
        bullet.kill();
    }

    onHitGround(bullet, layer) {
        
        //bullet.state.lights.remove(this);
        bullet.state.emitter.at(bullet);
        bullet.state.emitter.explode(200, 10);
        bullet.kill();
    }

}

export default Projectile;