export class Bullet extends Phaser.GameObjects.Ellipse {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 10, 10, 0xff0000);

    scene.physics.world.enable(this);
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }
}
