import Phaser from 'phaser';
import { Player } from '../entities/Player';

export class WorldUI extends Phaser.Scene {
  private healthText!: Phaser.GameObjects.Text;

  player!: Player;

  constructor() {
    super('WorldUI');
  }

  create(options: { player: Player }) {
    this.player = options.player;
    this.healthText = this.add.text(200, 100, 'Health: 100%', {
      fontSize: '20px',
      color: '#ff0000 ',
    });
    this.healthText.setScrollFactor(0);
    this.healthText.setDepth(10);
  }

  update() {
    this.healthText.setText(`Health: ${this.player.health}%`);
  }
}
