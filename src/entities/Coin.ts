export class Coin extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'coin');
    this.scale = 1.5;
    this.anims.play('coin-spin', true);
    scene.physics.world.enable(this);
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }
}
