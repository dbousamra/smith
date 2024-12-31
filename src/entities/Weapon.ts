import { constants } from '../utils';
import { Bullet } from './Bullet';

export class Weapon extends Phaser.GameObjects.Sprite {
  projectileSpeed: number = constants.PROJECTILE_SPEED; // Set a default projectile speed
  projectileLifespan: number = 0;
  bullets: Phaser.Physics.Arcade.Group;

  constructor(scene: Phaser.Scene, x: number, y: number, bullets: Phaser.Physics.Arcade.Group) {
    super(scene, x, y, 'ak47', 0);
    this.bullets = bullets;
    this.scale = 1;

    // Add weapon to the scene
    scene.add.existing(this);

    // Enable physics propertiess
    scene.physics.add.existing(this);

    // // Create a group for projectiles
    // this.projectiles = scene.physics.add.group();

    // Add a timer to shoot every 1 second
    scene.time.addEvent({
      delay: constants.PROJECTILE_FIRE_DELAY,
      callback: this.shoot,
      callbackScope: this,
      loop: true,
    });
  }

  shoot() {
    const bullet = new Bullet(this.scene, this.x, this.y, Phaser.Math.Between(20, 80));
    this.bullets.add(bullet);

    // Calculate direction towards the mouse pointer
    const pointer = this.scene.input.activePointer;
    const angle = Phaser.Math.Angle.Between(this.x, this.y, pointer.worldX, pointer.worldY);
    const velocityX = Math.cos(angle) * this.projectileSpeed;
    const velocityY = Math.sin(angle) * this.projectileSpeed;

    (bullet.body! as Phaser.Physics.Arcade.Body).setVelocity(velocityX, velocityY);
  }
}
