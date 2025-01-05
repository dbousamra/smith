import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { constants } from '../utils';

export class WavesManager {
  scene: Phaser.Scene;
  enemies: Phaser.Physics.Arcade.Group;
  coins: Phaser.Physics.Arcade.Group;
  player: Player;

  state: 'active' | 'waveCompleted' | 'waveBeginning' | 'complete';
  enemiesLeftToSpawn: number;
  waveCount: number;

  constructor(
    scene: Phaser.Scene,
    enemies: Phaser.Physics.Arcade.Group,
    coins: Phaser.Physics.Arcade.Group,
    player: Player,
  ) {
    this.scene = scene;
    this.enemies = enemies;
    this.coins = coins;
    this.player = player;

    this.state = 'waveBeginning';
    this.enemiesLeftToSpawn = constants.WAVE_ENEMY_COUNT;
    this.waveCount = 1;
  }

  update() {
    if (
      this.state === 'active' &&
      this.enemiesLeftToSpawn <= 0 &&
      this.enemies.countActive() === 0
    ) {
      this.completeWave();
      return;
    }

    if (this.waveCount > constants.WAVE_COUNT) {
      this.state = 'complete';
      return;
    }
  }

  start() {
    this.state = 'active';

    this.scene.time.addEvent({
      delay: 100,
      callback: this.spawnEnemy,
      callbackScope: this,
      repeat: this.enemiesLeftToSpawn - 1,
    });
  }

  completeWave() {
    this.state = 'waveCompleted';
    this.scene.time.delayedCall(3000, this.newWave, [], this);
  }

  newWave() {
    this.state = 'waveBeginning';
    this.waveCount += 1;
    this.enemiesLeftToSpawn = this.waveCount * constants.WAVE_ENEMY_COUNT;
    this.scene.time.delayedCall(3000, this.start, [], this);
  }

  spawnEnemy() {
    const x = Phaser.Math.Between(0, this.scene.scale.width);
    const y = Phaser.Math.Between(0, this.scene.scale.height);
    const enemy = new Enemy(this.scene, x, y, this.player, this.coins);
    this.enemies.add(enemy);
    this.enemiesLeftToSpawn--;
  }
}
