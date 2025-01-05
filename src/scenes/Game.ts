import Phaser from 'phaser';
import { Bullet } from '../entities/Bullet';
import { Coin } from '../entities/Coin';
import { Enemy } from '../entities/Enemy';
import { Player } from '../entities/Player';
import { WavesManager } from '../managers/WavesManager';
import { constants } from '../utils';
import { BulletFragment } from '../entities/BulletFragment';

export class Game extends Phaser.Scene {
  gameOver!: boolean;
  gameComplete!: boolean;
  player!: Player;
  enemies!: Phaser.Physics.Arcade.Group;
  coins!: Phaser.Physics.Arcade.Group;
  wavesManager!: WavesManager;

  constructor() {
    super('Game');
  }

  create() {
    this.gameOver = false;
    this.gameComplete = false;

    const width = this.sys.game.config.width as number;
    const height = this.sys.game.config.height as number;
    this.add.rectangle(width / 2, height / 2, width, height, 0x60577a);

    this.enemies = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: true,
    });

    this.coins = this.physics.add.group({
      classType: Coin,
      runChildUpdate: true,
    });

    this.player = new Player(this, width / 2, height / 2);
    this.player.setScale(1.5); // Scale the player up by 2x
    this.add.existing(this.player);

    // Add collision between bullets and enemies
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

    this.physics.add.collider(
      this.player,
      this.coins,
      this.onCollidePlayerCoins as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this,
    );

    this.wavesManager = new WavesManager(this, this.enemies, this.coins, this.player);
    this.wavesManager.start();

    this.scene.launch('GameUI', {
      player: this.player,
      wavesManager: this.wavesManager,
    });

    const coin = new Coin(this, 100, 100);
    this.coins.add(coin);
  }

  onCollideBulletEnemy(bullet: Bullet, enemy: Enemy) {
    enemy.takeDamage(bullet.damage);
    bullet.fragment();
    bullet.destroy();
  }

  onCollideBulletFragmentEnemy(bulletFragment: BulletFragment, enemy: Enemy) {
    enemy.takeDamage(bulletFragment.damage);
    bulletFragment.destroy();
  }

  onCollidePlayerEnemy(player: Player, enemy: Enemy) {
    enemy.destroy();
    player.handleHit();

    if (player.health <= 0) {
      this.gameOver = true;
    }
  }

  onCollidePlayerCoins(player: Player, coin: Coin) {
    player.collectCoin(coin);
  }

  update(time: number, delta: number): void {
    this.wavesManager.update();

    if (this.wavesManager.state === 'active') {
    }

    if (this.wavesManager.state === 'complete') {
      this.gameComplete = true;
    }

    if (this.wavesManager.state === 'waveCompleted') {
      this.coins.children.iterate((obj) => {
        const coin = obj as Coin;
        this.physics.moveToObject(coin, this.player, constants.COIN_PICKUP_END_WAVE_SPEED);
        return true;
      });
    }

    this.coins.children.iterate((obj) => {
      const coin = obj as Coin;

      const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, coin.x, coin.y);

      if (distance < constants.COIN_PICKUP_RADIUS) {
        this.physics.moveToObject(coin, this.player, constants.COIN_PICKUP_SPEED);
      }
      return true;
    });

    if (this.gameOver) {
      this.scene.switch('GameOver');
      return;
    }

    if (this.gameComplete) {
      this.scene.switch('GameComplete');
      return;
    }
  }
}
