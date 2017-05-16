import GameState from './GameState';

class Preload extends Phaser.State {
    init() {

    }

    preload() {
        this.game.load.image('sky', 'assets/sky.png');
        this.game.load.image('star', 'assets/star.png');
        this.game.load.image('bullet', 'assets/bullet164.png');
        this.game.load.image('tank', 'assets/tank.png', 32, 48);    
        this.game.load.image('turret', 'assets/turret.png')
        this.game.load.image('flame', 'assets/flame.png');
        this.game.load.tilemap('map', 'assets/cos426tiles2.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('ground_1x1', 'assets/ground_1x1.png');
        this.game.load.image('walls_1x2', 'assets/walls_1x2.png');
        this.game.load.image('tiles2', 'assets/tiles2.png');
        this.game.load.script('BlurX', 'https://cdn.rawgit.com/photonstorm/phaser/master/v2/filters/BlurX.js');
        this.game.load.script('BlurY', 'https://cdn.rawgit.com/photonstorm/phaser/master/v2/filters/BlurY.js');
    }

    create() {
        this.state.start('GameState');
    }
}

export default Preload;