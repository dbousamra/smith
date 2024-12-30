import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { Constants } from '../utils';
import { Bullet } from '../entities/Bullet';

export class Game extends Phaser.Scene {
  player!: Player;
  enemies!: Phaser.Physics.Arcade.Group;

  constructor() {
    super('Game');
  }

  create() {
    const width = this.sys.game.config.width as number;
    const height = this.sys.game.config.height as number;
    this.add.rectangle(width / 2, height / 2, width, height, 0x60577a);

    this.enemies = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: true,
    });

    this.player = new Player(this, width / 2, height / 2);
    this.player.setScale(1.5); // Scale the player up by 2x
    this.add.existing(this.player);

    // Add collision between player and enemies
    this.physics.add.collider(
      this.player.bullets,
      this.enemies,
      this.onCollideBulletEnemy as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this,
    );

    // Add collision between player and enemies
    this.physics.add.collider(
      this.player,
      this.enemies,
      this.onCollidePlayerEnemy as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this,
    );

    this.spawnEnemy();

    // Add a timer to shoot every 1 second
    this.time.addEvent({
      delay: 200,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true,
    });

    this.scene.launch('WorldUI', {
      player: this.player,
    });
  }

  onCollideBulletEnemy(bullet: Bullet, enemy: Enemy) {
    bullet.destroy();
    enemy.destroy();
  }

  onCollidePlayerEnemy(player: Player, enemy: Enemy) {
    console.log('Player collided with enemy');
    enemy.destroy();
    player.handleHit();
  }

  update(time: number, delta: number): void {
    this.player.update();

    this.enemies.children.iterate((obj) => {
      obj.update();
      return true;
    });
  }

  spawnEnemy() {
    const x = Phaser.Math.Between(0, this.scale.width);
    const y = Phaser.Math.Between(0, this.scale.height);
    const enemy = new Enemy(this, x, y, this.player);
    this.enemies.add(enemy);
  }
}
