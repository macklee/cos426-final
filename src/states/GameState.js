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
	}

	create() {
		// enable physics
		this.game.world.setBounds(0,0,1000,600);
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		
		this.map = this.game.add.tilemap('map')
		this.map.addTilesetImage('ground_1x1');
	    this.map.addTilesetImage('walls_1x2');
	    this.map.addTilesetImage('tiles2');
	    
	    this.layer = this.map.createLayer('Tile Layer 1');
	    this.map.createLayer('Tile Layer 2');

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
		this.shadowTexture = this.game.add.bitmapData(this.game.width, this.game.height);

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
        this.emitter = this.add.emitter(0, 0, 30);
        this.emitter.makeParticles('flame');
        this.emitter.setXSpeed(-120, 120);
        this.emitter.setYSpeed(-100, -200);
        this.emitter.setRotation();

		// Create 2 ledges
		// let ledge = this.platforms.create(400, 400, 'ground');
		// ledge.body.immovable = true;
		// ledge = this.platforms.create(-150, 250, 'ground');
		// ledge.body.immovable = true;

		// Initialize players


		let height = this.game.world.height;
		this.player = new PlayerTank(this.game, this, this.game.world.randomX, this.game.rnd.integerInRange(0, height-64), 1);
		this.player2 = new PlayerTank(this.game, this, this.game.world.randomX, this.game.rnd.integerInRange(0, height-64), 2);

		// Setup group for tracking projectiles
		this.projectiles = this.game.add.group();
		this.projectiles.classType = Projectile;

		// input handlers
		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.spaceKey.onDown.add(this.toggleTurn, this);
		this.turn = 0;
	}

	toggleTurn() {
		this.turn = 1 - this.turn;
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
		//console.log(hitPlatform);
        //this.player.checkLand();
        //this.player2.checkLand();
        
		if (this.turn == 0) {
			this.player.update(hitPlatform);
			this.player2.endTurn();
			this.game.camera.follow(this.player);
			
		}
		else if (this.turn == 1) {
			this.player2.update(hitPlatform2);
			this.player.endTurn();
			this.game.camera.follow(this.player2);
		}
		this.updateShadowTexture()

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
	    this.shadowTexture.context.fillRect(0, 0, this.game.width, this.game.height);

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
