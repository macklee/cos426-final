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
	}

	create() {
		// enable physics
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		// setup stage
		this.game.add.sprite(0, 0, 'sky');

		// setup platforms + ground
		this.platforms = this.game.add.group();

		// Enable physics for the platforms group
		this.platforms.enableBody = true;

		// Create the ground
		let ground = this.platforms.create(0, this.game.world.height-64, 'ground');
		ground.scale.setTo(2, 2);
		ground.body.immovable = true;

		// Create 2 ledges
		let ledge = this.platforms.create(400, 400, 'ground');
		ledge.body.immovable = true;
		ledge = this.platforms.create(-150, 250, 'ground');
		ledge.body.immovable = true;

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
		if (this.turn == 0) {
			this.player.update();
			this.player2.endTurn();
		}
		else if (this.turn == 1) {
			this.player2.update();
			this.player.endTurn();
		}
	}

	update() {
		var hitPlatform = this.game.physics.arcade.collide(this.player.tank, this.platforms);
		var hitPlatform2 = this.game.physics.arcade.collide(this.player2.tank, this.platforms);
		if (this.turn == 0) {
			this.player.update();
			this.player2.endTurn();
		}
		else if (this.turn == 1) {
			this.player2.update();
			this.player.endTurn();
		}
	}

}

export default GameState;
