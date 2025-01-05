import { constants } from '../utils';
import { Bullet } from './Bullet';

export class Weapon extends Phaser.GameObjects.Sprite {
  projectileSpeed: number = constants.PROJECTILE_SPEED; // Set a default projectile speed
  projectileLifespan: number = 0;
  bullets: Phaser.Physics.Arcade.Group;

  constructor(scene: Phaser.Scene, x: number, y: number, bullets: Phaser.Physics.Arcade.Group) {
    super(scene, x, y, 'ak47', 0);
    this.locked = false;
    this.bullets = bullets;
    this.scale = 1;

    // Add weapon to the scene
    scene.add.existing(this);

    // Enable physics properties
    scene.physics.add.existing(this);

    // Add a timer to shoot every 1 second
    scene.time.addEvent({
      delay: constants.PROJECTILE_FIRE_DELAY,
      callback: this.shoot,
      callbackScope: this,
      loop: true,
    });
  }

  shoot() {
    if (this.locked) {
      return;
    }

    const bullet = new Bullet(this.scene, this.x, this.y, Phaser.Math.Between(20, 80));
    this.bullets.add(bullet);

    // Calculate direction towards the mouse pointer
    const pointer = this.scene.input.activePointer;
    const angle = Phaser.Math.Angle.Between(this.x, this.y, pointer.worldX, pointer.worldY);
    const velocityX = Math.cos(angle) * this.projectileSpeed;
    const velocityY = Math.sin(angle) * this.projectileSpeed;

    (bullet.body! as Phaser.Physics.Arcade.Body).setVelocity(velocityX, velocityY);
  }

  preUpdate() {
    if (this.locked) {
      return;
    }

    // Rotate the weapon to point towards the cursor
    const pointer = this.scene.input.activePointer;
    const angle = Phaser.Math.Angle.Between(this.x, this.y, pointer.worldX, pointer.worldY);
    this.setRotation(angle);

    // Adjust the position to ensure the top right of the sprite points towards the cursor
    const offsetX = Math.cos(angle) * this.width * 0.5;
    const offsetY = Math.sin(angle) * this.height * 0.5;
    this.setPosition(this.x + offsetX, this.y + offsetY);
  }
}
