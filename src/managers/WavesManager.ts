import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';

export class WavesManager {
  scene: Phaser.Scene;
  enemies: Phaser.Physics.Arcade.Group;
  player: Player;
  wave: number;
  enemiesLeftToSpawn: number;
  spawnDelay: number;
  waveActive: boolean;
  waveTransition: boolean;

  constructor(scene: Phaser.Scene, enemies: Phaser.Physics.Arcade.Group, player: Player) {
    this.scene = scene;
    this.enemies = enemies;
    this.player = player;
    this.wave = 1;
    this.enemiesLeftToSpawn = 40; // Number of enemies per wave
    this.spawnDelay = 1000; // Initial spawn delay in milliseconds
    this.waveActive = false;
    this.waveTransition = false;
  }

  start() {
    this.startWave();
  }

  update() {
    if (this.waveActive && this.enemiesLeftToSpawn <= 0 && this.enemies.countActive(true) === 0) {
      this.nextWave();
    }
  }

  startWave() {
    this.waveActive = true;
    this.scene.time.addEvent({
      delay: this.spawnDelay,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true,
      repeat: this.enemiesLeftToSpawn - 1,
    });
  }

  spawnEnemy() {
    if (this.enemiesLeftToSpawn > 0) {
      const x = Phaser.Math.Between(0, this.scene.scale.width);
      const y = Phaser.Math.Between(0, this.scene.scale.height);
      const enemy = new Enemy(this.scene, x, y, this.player);
      this.enemies.add(enemy);
      this.enemiesLeftToSpawn--;
    }
  }

  nextWave() {
    this.wave++;
    this.waveTransition = true;
    if (this.wave > 3) {
      this.scene.scene.start('GameComplete');
      return;
    }
    this.enemiesLeftToSpawn = 10; // Reset the number of enemies for the next wave
    this.spawnDelay -= 500; // Decrease spawn delay for the next wave
    this.waveActive = false;
    this.scene.time.delayedCall(1000, this.startWave, [], this); // Start the next wave after a short delay
  }
}
