import { bloodExplosionConfig, bloodDamageConfig, constants } from '../utils';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private target: Phaser.Physics.Arcade.Sprite;
  health: number;

  constructor(scene: Phaser.Scene, x: number, y: number, target: Phaser.Physics.Arcade.Sprite) {
    super(scene, x, y, 'enemy');
    this.target = target;
    this.health = 100;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(1.5);
    this.anims.play('enemy-walk', true);
  }

  update() {
    const angle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
    this.scene.physics.velocityFromRotation(angle, constants.ENEMY_SPEED, this.body!.velocity);
  }

  takeDamage(damage: number) {
    this.health -= damage;

    // Show damage number
    const damageText = this.scene.add.text(this.x, this.y - 20, `${damage}`, {
      fontSize: 32,
      color: 'yellow',
      stroke: 'black',
      strokeThickness: 6,
    });
    this.scene.tweens.add({
      targets: damageText,
      alpha: 0,
      y: this.y - 40,
      duration: 1000,
      ease: 'Power1',
      onComplete: () => {
        damageText.destroy();
      },
    });

    if (this.health <= 0) {
      this.destroy();
    } else {
      this.scene.add.particles(this.x, this.y, 'redPixel', bloodDamageConfig).explode(20);
    }
  }

  destroy() {
    const blood = this.scene.add.sprite(this.x, this.y, 'blood');
    blood.play('blood-explode');
    this.scene.add.particles(this.x, this.y, 'redPixel', bloodExplosionConfig).explode(100);
    super.destroy();
  }
}
