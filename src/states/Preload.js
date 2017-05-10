import GameState from './GameState';

class Preload extends Phaser.State {
    init() {

    }

    preload() {
        this.game.load.image('sky', 'assets/sky.png');
        this.game.load.image('ground', 'assets/platform.png');
        this.game.load.image('star', 'assets/star.png');
        this.game.load.image('bullet', 'assets/bullet164.png');
        this.game.load.image('tank', 'assets/advanced_wars_tank.png', 32, 48);    
    }

    create() {
        this.state.start('GameState');
    }
}

export default Preload;