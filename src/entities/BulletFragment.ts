export class BulletFragment extends Phaser.GameObjects.Ellipse {
  damage: number;
  lifespan: number;
  fadeOutDuration: number;

  constructor(scene: Phaser.Scene, x: number, y: number, damage: number) {
    super(scene, x, y, 4, 4, 0xffffff);
    scene.physics.world.enable(this);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.damage = damage;
    this.lifespan = 2000; // lifespan in milliseconds
    this.fadeOutDuration = 500; // fade out duration in milliseconds

    // Schedule fade out and destroy
    scene.time.delayedCall(this.lifespan - this.fadeOutDuration, () => {
      scene.tweens.add({
        targets: this,
        alpha: 0,
        duration: this.fadeOutDuration,
        onComplete: () => {
          this.destroy();
        },
      });
    });

    // Schedule destroy after lifespan
    scene.time.delayedCall(this.lifespan, () => {
      if (this.active) {
        this.destroy();
      }
    });
  }
}
