class Projectile extends Phaser.Sprite {

    constructor (game, state, x, y, source, isBullet) {
        if (isBullet) super(game, x, y, 'bullet');
        else super(game, x, y, 'star');

        this.maxBounce = 3;

        // basic position/status variables
        this.game = game;
        this.state = state;
        this.x = x;
        this.y = y;
        this.source = source;
        this.exists = false;


        if (isBullet) Phaser.Sprite.call(this, game, x, y, 'bullet');
        else Phaser.Sprite.call(this, game, x, y, 'star');
        game.add.existing(this);
        this.type = isBullet;

        // sprite
        // this.bullet = game.add.sprite(x, y, 'bullet');

        // physics & movement
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.setCircle(3.5);
        this.body.immovable = false;
        if (!isBullet)
            this.body.bounce = new Phaser.Point(1, 1);
        //this.body.checkWorldBounds = true;
        this.body.collideWorldBounds = true;
        this.body.outOfBoundsKill = true;
        if (isBullet)
            this.body.gravity.y = 300;
        this.angle = source.fireAngle;
        this.tracking = false;
        this.scaleSpeed = 0;

        // bullet properties
        this.strength = 1;
        this.speed = 400;

    }

    fire(x, y, angle, gx, gy) {
        gx = gx || 0;
        gy = gy || 0;
        //this.reset(x, y);
        this.scale.set(1);
        this.game.physics.arcade.velocityFromAngle(angle, this.speed, this.body.velocity);
        
        this.angle = angle;
        if (this.type)
            this.body.gravity.set(gx, gy);

        this.state.isProjAlive = true;
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
        bullet.game.camera.follow(bullet.state.turn == 0 ? bullet.state.player : bullet.state.player2);
        bullet.kill();
        bullet.state.isProjAlive = false;
        bullet.state.endTimer();
    }

    onHitGround(bullet, layer) {
        
        //bullet.state.lights.remove(this);
        bullet.state.emitter.at(bullet);
        bullet.state.emitter.explode(200, 10);
        console.log(bullet.type);
        if ((!bullet.type && --bullet.maxBounce <= 0) || bullet.type) {
            //ray
            bullet.kill();
            bullet.state.isProjAlive = false;
            bullet.state.endTimer();
        }
    }

}

export default Projectile;