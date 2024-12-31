import Phaser from 'phaser';

export class GameOver extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  create() {
    const { width, height } = this.scale;
    this.add
      .text(width / 2, height / 2, 'Game Over - Press space to restart', {
        fontSize: '64px',
        color: '#ff0000',
      })
      .setOrigin(0.5);

    this.input.keyboard!.once('keydown-SPACE', () => {
      this.scene.start('Game');
    });
  }
}
