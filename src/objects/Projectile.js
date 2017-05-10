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

        // sprite
        this.bullet = game.add.sprite(x, y, 'bullet');

        // physics & movement
        this.game.physics.enable(this.bullet, Phaser.Physics.ARCADE);
        this.bullet.body.immovable = false;
        this.bullet.body.checkWorldBounds = true;
        this.bullet.body.outOfBoundsKill = true;
        this.bullet.body.gravity.y = 300;
        this.angle = source.angle;
        this.tracking = false;
        this.scaleSpeed = 0;

        // bullet properties
        this.strength = 1;
        this.speed = 200;
    }

    fire(x, y, angle, gx, gy) {
        gx = gx || 0;
        gy = gy || 0;
        this.reset(x, y);
        this.scale.set(1);
        this.game.physics.arcade.velocityFromAngle(angle, this.speed, this.bullet.body.velocity);
        
        this.angle = angle;
        this.bullet.body.gravity.set(gx, gy);
    }

    update() {
        //this.bullet.body.velocity.x = 300;
        var hitTank;
        // check for collision with p2 if fired by p1
        if (this.source.player == 1) {
            hitTank = this.game.physics.arcade.collide(this.bullet, this.state.player2.tank, this.onHit);
        }
        else if (this.source.player == 2) {
            hitTank = this.game.physics.arcade.collide(this.bullet, this.state.player.tank, this.onHit);
        }

        // check for collision with platforms
        var hitPlatform = this.game.physics.arcade.collide(this.bullet, this.state.platforms);
    }

    /* doesn't work, has to reference the parent obj and not the sprite itself */
    onHit(bullet, target) {
        target.damage();
        bullet.kill();
    }

}

export default Projectile;