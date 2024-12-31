export class Bullet extends Phaser.GameObjects.Ellipse {
  damage: number;

  constructor(scene: Phaser.Scene, x: number, y: number, damage: number) {
    super(scene, x, y, 10, 10, 0xff0000);
    scene.physics.world.enable(this);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.damage = damage;
  }
}
