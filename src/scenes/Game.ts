import Phaser from 'phaser';
import { Bullet } from '../entities/Bullet';
import { Enemy } from '../entities/Enemy';
import { Player } from '../entities/Player';
import { WavesManager } from '../managers/WavesManager';
import { bloodExplosionConfig } from '../utils';

export class Game extends Phaser.Scene {
  gameOver!: boolean;
  player!: Player;
  enemies!: Phaser.Physics.Arcade.Group;
  wavesManager!: WavesManager;

  constructor() {
    super('Game');
  }

  create() {
    this.gameOver = false;

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

    this.wavesManager = new WavesManager(this, this.enemies, this.player);
    this.wavesManager.start();

    this.scene.launch('WorldUI', {
      player: this.player,
      wavesManager: this.wavesManager,
    });
  }

  onCollideBulletEnemy(bullet: Bullet, enemy: Enemy) {
    enemy.takeDamage(bullet.damage);
    bullet.destroy();
  }

  onCollidePlayerEnemy(player: Player, enemy: Enemy) {
    enemy.destroy();
    player.handleHit();

    if (player.health <= 0) {
      this.gameOver = true;
    }
  }

  // explodeAt(x: number, y: number) {
  //   const blood = this.add.sprite(x, y, 'blood');
  //   blood.play('blood-explode');
  //   this.add.particles(x, y, 'redPixel', bloodParticlesConfig).explode(100);
  // }

  update(time: number, delta: number): void {
    if (this.gameOver) {
      this.scene.switch('GameOver');
      return;
    }

    this.player.update();
    this.wavesManager.update();

    this.enemies.children.iterate((obj) => {
      obj.update();
      return true;
    });
  }
}
