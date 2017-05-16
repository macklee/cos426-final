import PlayerTank from 'objects/PlayerTank';
import Projectile from 'objects/Projectile';

class GameState extends Phaser.State {

	constructor() {
		super();
		var platforms;
		var projectiles;
		
		var player;
		var player2;
		var cursors;
		var spaceKey;
		var turn;
		var land;
		var emitter;
		var map;
		var layer;
		var shadowTexture
		var lights;

		var timer;
		var timerEvent;

		var isProjAlive;
		var text;
		var delay;
	}

	create() {
		this.startTimer();

		// enable physics
		this.game.world.setBounds(0,0,1600,600);
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		
		this.map = this.game.add.tilemap('map')
		this.map.addTilesetImage('ground_1x1');
	    this.map.addTilesetImage('walls_1x2');
	    this.map.addTilesetImage('tiles2');
	    
	    this.layer = this.map.createLayer('Tile Layer 1');
	    //this.map.createLayer('Tile Layer 2');

	    this.layer.resizeWorld();
	    this.map.setCollisionBetween(1, 12);
	    //this.game.physics.convertTilemap(this.map, layer);
		// setup stage
		//this.game.add.sprite(0, 0, 'sky');

		// setup platforms + ground
		this.platforms = this.game.add.group();

		// Enable physics for the platforms group
		this.platforms.enableBody = true;

		// ALL LIGHTING STUFF

		this.LIGHT_RADIUS = 100;
		this.shadowTexture = this.game.add.bitmapData(1600, this.game.height);

		var lightSprite = this.game.add.image(0, 0, this.shadowTexture);
		this.lights = this.game.add.group();
		lightSprite.blendMode = Phaser.blendModes.MULTIPLY;
		// Create the ground
		// let ground = this.platforms.create(0, this.game.world.height-64, 'ground');
		// ground.scale.setTo(2, 2);
		// ground.body.immovable = true;

		// this.land = this.add.bitmapData(992, 480);
		// this.land.draw('ground');
		// this.land.update();
		// this.land.addToWorld();

        //  A small burst of particles when a target is hit
        this.emitter = this.add.emitter(0, 0, 0);
        this.emitter.makeParticles('flame');
        this.emitter.setXSpeed(-150, 150);
        this.emitter.setYSpeed(150, -150);
        this.emitter.setRotation();

		// Instantiate graphics
		this.graphics = this.game.add.graphics(0, 0);
        this.healthgraphics1 = this.game.add.graphics(0,0);
        this.healthgraphics2 = this.game.add.graphics(0,0);
        this.staminagraphics = this.game.add.graphics(0,0);
		// Initialize players

		let height = this.game.world.height;
		this.player = new PlayerTank(this.game, this, this.game.world.randomX, this.game.rnd.integerInRange(0, height-64), 1);
		this.player2 = new PlayerTank(this.game, this, this.game.world.randomX, this.game.rnd.integerInRange(0, height-64), 2);
		this.player.tint = "0x33B2FF";
		this.player2.tint = "0xFF6B66";

		// Setup group for tracking projectiles
		this.projectiles = this.game.add.group();
		this.projectiles.classType = Projectile;

		// input handlers
		this.cursors = this.game.input.keyboard.createCursorKeys();
		//this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		//this.spaceKey.onDown.add(this.toggleTurn, this);
		this.jumpKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.turn = 0;

		this.game.camera.follow(this.player);
	}

	startTimer() {
		this.timer = this.game.time.create();
		this.timerEvent = this.timer.add(Phaser.Timer.SECOND * 30, this.endTimer, this);
		this.timer.start();
	}

	render() {
		// If our timer is running, show the time in a nicely formatted way, else show 'Done!'
        if (this.timer.running) {
            this.game.debug.text(this.formatTime(Math.round((this.timerEvent.delay - this.timer.ms) / 1000)), 2, 14, "#ff0");
        	//this.game.debug.text("Done!", 2, 14, "#0f0");
        }
        else {
            this.game.debug.text("Done!", 2, 14, "#0f0");
        }
	}

	formatTime(s) {
        // Convert seconds (s) to a nicely formatted and padded time string
        var minutes = "0" + Math.floor(s / 60);
        var seconds = "0" + (s - minutes * 60);
        return minutes.substr(-2) + ":" + seconds.substr(-2);   
    }

	endTimer() {
        // Stop the timer when the delayed event triggers
        this.timer.stop();
        if (!this.isProjAlive) {
        	this.delay = this.game.time.create();
        	var delayEvent = this.delay.add(Phaser.Timer.SECOND * 1.5, this.stopDelay, this);
        	this.delay.start();
    	}
    }

    stopDelay() {
		this.delay.stop();
    	this.toggleTurn();
        this.startTimer();
    }

	toggleTurn() {
		this.turn = 1 - this.turn;
		if (this.turn == 0) {
			this.player.didFireThisTurn = false;
			this.player.projectileSpeed = 100;
			this.player2.stamina = 60;
			this.game.camera.follow(this.player);
			if (this.text) this.text.destroy();
		}
		else {
			this.player2.didFireThisTurn = false;
			this.player2.projectileSpeed = 100;
			this.player.stamina = 60;
			this.game.camera.follow(this.player2);
			if (this.text) this.text.destroy();
		}
		// if (this.turn == 0) {
		// 	this.player.update();
		// 	this.player2.endTurn();
		// 	this.game.camera.follow(this.player);
		// }
		// else if (this.turn == 1) {
		// 	this.player2.update();
		// 	this.player.endTurn();
		// 	this.game.camera.follow(this.player2);
		// }
	}

	update() {
		
		var hitPlatform = this.game.physics.arcade.collide(this.player, this.layer);
		var hitPlatform2 = this.game.physics.arcade.collide(this.player2, this.layer);
		
        this.graphics.clear();
		if (this.turn == 0) {
			this.player.update(hitPlatform);
			this.player2.endTurn();
			//if (!this.isProjAlive) this.game.camera.follow(this.player);	
		}
		else if (this.turn == 1) {
			this.player2.update(hitPlatform2);
			this.player.endTurn();
			//if (!this.isProjAlive) this.game.camera.follow(this.player2);
		}
		this.updateShadowTexture()
		this.player.drawHealthBar();
		this.player2.drawHealthBar();

	}
	updateShadowTexture() {
	    // This function updates the shadow texture (this.shadowTexture).
	    // First, it fills the entire texture with a dark shadow color.
	    // Then it draws a white circle centered on the pointer position.
	    // Because the texture is drawn to the screen using the MULTIPLY
	    // blend mode, the dark areas of the texture make all of the colors
	    // underneath it darker, while the white area is unaffected.


	    // Draw shadow
	    // change this to be 0,0,0 for it to become nothing
	    this.shadowTexture.context.fillStyle = 'rgb(0, 0, 0)';
	    this.shadowTexture.context.fillRect(0, 0, 1600, this.game.height);

	    // Iterate through each of the lights and draw the glow
	    this.lights.forEach(function(light) {
	        // Randomly change the radius each frame
	        var radius = this.LIGHT_RADIUS;

	        // Draw circle of light with a soft edge
	        var gradient =
	            this.shadowTexture.context.createRadialGradient(
	                light.x, light.y,this.LIGHT_RADIUS * 0.75,
	                light.x, light.y, radius);
	        gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
	        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');

	        this.shadowTexture.context.beginPath();
	        this.shadowTexture.context.fillStyle = gradient;
	        this.shadowTexture.context.arc(light.x, light.y, radius, 0, Math.PI*2);
	        this.shadowTexture.context.fill();
	    }, this);

	    // This just tells the engine it should update the texture cache
	    this.shadowTexture.dirty = true;
	};
}

export default GameState;