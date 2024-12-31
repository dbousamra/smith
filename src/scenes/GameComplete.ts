import Phaser from 'phaser';

export class GameComplete extends Phaser.Scene {
  constructor() {
    super('GameComplete');
  }

  create() {
    const { width, height } = this.scale;
    this.add
      .text(width / 2, height / 2, 'Game Complete - You are a true smithing facility', {
        fontSize: '64px',
        color: '#00ff00',
      })
      .setOrigin(0.5);

    this.input.keyboard!.once('keydown-SPACE', () => {
      this.scene.start('Game');
    });
  }
}
