import { Constants } from '../utils';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private target: Phaser.Physics.Arcade.Sprite;

  constructor(scene: Phaser.Scene, x: number, y: number, target: Phaser.Physics.Arcade.Sprite) {
    super(scene, x, y, 'enemy');
    this.target = target;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(1.5);
    this.anims.play('enemy-walk', true);
  }

  update() {
    const angle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
    this.scene.physics.velocityFromRotation(angle, Constants.ENEMY_SPEED, this.body!.velocity);
  }
}
