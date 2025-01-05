import { BulletFragment } from './BulletFragment';

export class Bullet extends Phaser.GameObjects.Ellipse {
  damage: number;
  fragments: Phaser.Physics.Arcade.Group;

  constructor(scene: Phaser.Scene, x: number, y: number, damage: number) {
    super(scene, x, y, 10, 10, 0xff0000);
    scene.physics.world.enable(this);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.damage = damage;
    this.fragments = scene.physics.add.group({
      classType: BulletFragment,
      runChildUpdate: true,
    });
  }

  fragment() {
    const fragmentsToCreate = 2;

    for (let i = 0; i < fragmentsToCreate; i++) {
      const fragment = new BulletFragment(this.scene, this.x, this.y, this.damage);
      this.fragments.add(fragment);

      const angle = Phaser.Math.DegToRad(120 * i);
      const velocityX = Math.cos(angle) * 200;
      const velocityY = Math.sin(angle) * 200;

      (fragment.body! as Phaser.Physics.Arcade.Body).setVelocity(velocityX, velocityY);
    }
  }
}
