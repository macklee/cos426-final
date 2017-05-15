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
        this.text;
        this.final_timer = this.game.time.create();
        this.final_timerEvent = this.final_timer.add(Phaser.Timer.QUARTER, this.endTimer, this);
        this.index = 0;
        this.didFireThisTurn = false;
        this.stamina = 60;
        this.released = true;

        this.facingRight = true;
        var blurX_1 = this.game.add.filter('BlurX');
        var blurX_2 = this.game.add.filter('BlurX');
        var blurX_3 = this.game.add.filter('BlurX');
        var blurX_4 = this.game.add.filter('BlurX');
        var blurX_5 = this.game.add.filter('BlurX');

        blurX_1.blur = 10;
        blurX_2.blur = 50;
        blurX_3.blur = 100;
        blurX_4.blur = 150;
        blurX_5.blur = 200;

        this.array = [blurX_1, blurX_2, blurX_3, blurX_4, blurX_5];
        this.rayAmmo = 3;
        
        Phaser.Sprite.call(this, game, x, y, 'tank');
        game.add.existing(this);

        // sprite
        // this.tank = game.add.sprite(x, y, 'tank');

        // physics & movement
        this.game.physics.arcade.enable(this, Phaser.Physics.ARCADE);
        this.body.immovable = false;
        this.body.collideWorldBounds = true;
        this.body.gravity.y = 700;
        this.anchor.setTo(0.5,0.5);

        // fires a flame when shooting
        this.flame = game.add.sprite(0, 0, 'flame');
        //this.flame.anchor.setTo(0.5, 0.5);


        this.flame.visible = false;

        // LIGHTSSSS
        this.state.lights.add(this);

        // angle for firing
        this.fireAngle = -45;
        this.fireAngleOffset = 45;

        // key check for firing
        this.fireKey = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
		this.fireKey.onDown.add(this.fireProjectile, this);

        this.fireRay = this.game.input.keyboard.addKey(Phaser.Keyboard.C);
        this.fireRay.onDown.add(this.fireRayProjectile, this);
    }

    fireProjectile() {
        if (this.state.text){
            this.state.text.destroy();
        }
        if (this.state.isProjAlive || (this.state.delay && this.state.delay.running)) return;
        if (this.state.turn != this.player-1) return;
        if (this.body.velocity.y != 0) return;
        this.didFireThisTurn = true;
        let x = (this.facingRight ? this.body.x : this.body.x+48);
        let proj = new Projectile(this.game, this.state, x, this.body.y-2, this, true);
        this.state.projectiles.add(proj);
        this.state.lights.add(proj);
        proj.fire(x, this.body.y-2, this.fireAngle, 0, 300);
        this.game.camera.follow(proj);
    }

    fireRayProjectile() {
        if (this.state.isProjAlive || (this.state.delay && this.state.delay.running)) return;
        if (this.state.turn != this.player-1) return;
        if (this.body.velocity.y != 0) return;
        if (this.state.text){
            this.state.text.destroy();
        }

        if (this.rayAmmo-- > 0) {
            this.didFireThisTurn = true;
            let x = (this.facingRight ? this.body.x : this.body.x+48);
            let proj = new Projectile(this.game, this.state, x, this.body.y-2, this, false);
            this.game.camera.follow(proj);
            this.state.projectiles.add(proj);
            this.state.lights.add(proj);
            proj.fire(x, this.body.y-2, this.fireAngle, 0, 300);
            this.state.text = this.game.add.text(this.game.camera.width / 2, this.game.camera.height / 2, 
                this.rayAmmo + " more ray tracers", {font: "30px Arial", fill: "#ffffff", stroke: '#000000', strokeThickness: 3});
        } else {
            this.state.text = this.game.add.text(this.game.camera.width / 2, this.game.camera.height / 2, 
                "No more ray tracers", {font: "30px Arial", fill: "#ffffff", stroke: '#000000', strokeThickness: 3});
        }
        this.state.text.anchor.setTo(0.5, 0.5);
        this.state.text.fixedToCamera = true;

    }

    damage() {
        this.health -= 1;
        console.log("player " + this.player + " was hit");
        if (this.health <= 0) {
            var text = this.game.add.text(this.game.camera.width / 2, this.game.camera.height / 2, 
                "Game Over", {font: "65px Arial", fill: "#ffffff", stroke: '#000000', strokeThickness: 3});
            text.anchor.setTo(0.5, 0.5);
            text.fixedToCamera = true;
            this.alive = false;
            this.kill();

            this.blurY = this.game.add.filter('BlurY');

            this.blurY.blur = 1;

            this.final_timer.start();


            return true;
        }
        return false;
    }

    endTimer() {
        console.log("endTimer");
        this.final_timer.stop();
        if (this.index >= this.array.length) {
            return;
        }

        var blur = this.array[this.index++];
        this.game.world.filters = [blur, this.blurY];

        this.final_timer = this.game.time.create();
        this.final_timerEvent = this.final_timer.add(Phaser.Timer.QUARTER, this.endTimer, this);
        this.final_timer.start();
    }

    drawAngleIndicator() {
        // fireAngle indicator
        if (this.state.turn == this.player-1) {
            this.state.graphics.clear();

            // determine offset based on direction
            let xo = this.body.x + (this.facingRight ? 12 : 48);
            let thetai = (this.facingRight ? this.game.math.degToRad(2) : this.game.math.degToRad(-88));
            let thetaf = (this.facingRight ? this.game.math.degToRad(-90) : this.game.math.degToRad(-180));
            let sign = (this.facingRight ? 1 : -1);

            // draw arc
            this.state.graphics.lineStyle(1, 0xFF3300);
            this.state.graphics.beginFill(0xFFFFFF, 0.2);
            this.state.graphics.arc(xo, this.body.y-2, 36, thetai, thetaf, true);
            this.state.graphics.endFill();

            // draw aiming needle
            this.state.graphics.moveTo(xo, this.body.y-2);
            this.state.graphics.lineTo(xo+sign*36*Math.cos(this.game.math.degToRad(this.fireAngleOffset)), this.body.y-2-36*Math.sin(this.game.math.degToRad(this.fireAngleOffset)));
            this.state.graphics.moveTo(0, 0);
        }
    }

    drawHealthBar() {
        
        if (this.player == 1) {
            this.state.healthgraphics1.clear();
            //draw rectangle
            this.state.healthgraphics1.lineStyle(0);
            this.state.healthgraphics1.beginFill(0xFFFF0000, 1);
            this.state.healthgraphics1.drawRect(this.body.x -15, this.body.y-5+30 , 10, -30);
            this.state.healthgraphics1.endFill();

            this.state.healthgraphics1.lineStyle(0);
            this.state.healthgraphics1.beginFill(0x32CD32, 1);
            this.state.healthgraphics1.drawRect(this.body.x -15, this.body.y-5+30, 10, -30*(this.health)/3);
            this.state.healthgraphics1.endFill();
        }
        else if (this.player == 2) {
            this.state.healthgraphics2.clear();
            //draw rectangle
            this.state.healthgraphics2.lineStyle(0);
            this.state.healthgraphics2.beginFill(0xFFFF0000, 1);
            this.state.healthgraphics2.drawRect(this.body.x -15, this.body.y-5+30 , 10, -30);
            this.state.healthgraphics2.endFill();

            this.state.healthgraphics2.lineStyle(0);
            this.state.healthgraphics2.beginFill(0x32CD32, 1);
            this.state.healthgraphics2.drawRect(this.body.x -15, this.body.y-5+30, 10, -30*(this.health)/3);
            this.state.healthgraphics2.endFill();
        }
    }

    drawStaminaBar() {
        if (this.state.turn == this.player-1) {
            this.state.staminagraphics.clear();
            this.state.staminagraphics.lineStyle(0);
            this.state.staminagraphics.beginFill(0xffff00, 1);
            // if (this.body.velocity.x != 0 || this.body.velocity.y != 0) {
            //     if (this.stamina > 0) {
            //         this.stamina = this.stamina - 0.3;
            //     }
            // }
            if (this.stamina < 0) {
                this.stamina = 0;
            }

            this.state.staminagraphics.drawRect(this.body.x, this.body.y+45 , this.stamina, 5);
            this.state.staminagraphics.endFill();
        }
    }

    update(hit) {
        this.drawStaminaBar();
        this.drawAngleIndicator();
        this.body.velocity.x = 0;
        if (this.state.turn == this.player-1 && !this.didFireThisTurn) {
            if (this.state.cursors.left.isDown) {
                if (this.stamina > 0) {
                    this.body.velocity.x = -150;
                    this.stamina -= 0.2
                }
                if (this.facingRight) {
                    this.scale.x = this.scale.x* -1;
                    this.facingRight = false;
                    this.fireAngle = -180+this.fireAngleOffset;
                }
            }     
            else if (this.state.cursors.right.isDown) {
                if (this.stamina > 0) {
                    this.body.velocity.x = 150;
                    this.stamina -= 0.2
                }
                if (!this.facingRight) {
                    this.scale.x = this.scale.x* -1;
                    this.facingRight = true;
                    this.fireAngle = 0-this.fireAngleOffset;
                }

            }
            else {
                this.animations.stop();
            }
            if (this.state.cursors.up.isDown) {
                if (this.fireAngleOffset < 90) {
                    this.fireAngleOffset += 0.3;
                    this.fireAngle = (this.facingRight ? 0-this.fireAngleOffset : -180+this.fireAngleOffset);
                }
            }
            if (this.state.cursors.down.isDown) {
                if (this.fireAngleOffset > 0) {
                    this.fireAngleOffset -= 0.3;
                    this.fireAngle = (this.facingRight ? 0-this.fireAngleOffset : -180+this.fireAngleOffset);
                }
            }
        }
        if (this.state.jumpKey.isDown && hit && this.stamina > 0) {
            if (this.stamina > 10 && this.released) {
                this.released = false;
                this.body.velocity.y = -350;
                this.stamina -= 5;
            }
        }

        if (this.state.jumpKey.isUp) {
            this.released = true;
        }

        //this.x = this.body.x;
        //this.y = this.body.y;
    }

    endTurn() {
        this.animations.stop();
        this.body.velocity.x = 0;
        this.frame = 4;
    }


}

export default PlayerTank;