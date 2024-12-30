import { Constants } from '../utils';
import { Weapon } from './Weapon';
import { Enemy } from './Enemy';
import { Bullet } from './Bullet';

export class Player extends Phaser.Physics.Arcade.Sprite {
  private keys: Record<string, Phaser.Input.Keyboard.Key>;
  private isDashing: boolean = false;
  private dashTime: number = 0;
  private dashCooldown: number = 0;
  private dashVelocity: { x: number; y: number } = { x: 0, y: 0 };

  health: number = 100;

  bullets: Phaser.Physics.Arcade.Group;

  private weapons: Weapon[] = [];

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');

    // Add player to the scene
    scene.physics.add.existing(this);

    // Enable physics properties
    this.setCollideWorldBounds(true);

    this.keys = scene.input.keyboard!.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D,
      SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
    }) as Record<string, Phaser.Input.Keyboard.Key>;

    this.bullets = scene.physics.add.group({
      classType: Bullet,
      runChildUpdate: true,
    });

    // Create a weapon
    this.weapons.push(new Weapon(scene, x, y, this.bullets));
  }

  handleInput() {
    let velocityX = 0;
    let velocityY = 0;

    if (this.keys.A.isDown) {
      velocityX = -Constants.PLAYER_SPEED;
    } else if (this.keys.D.isDown) {
      velocityX = Constants.PLAYER_SPEED;
    }

    if (this.keys.W.isDown) {
      velocityY = -Constants.PLAYER_SPEED;
    } else if (this.keys.S.isDown) {
      velocityY = Constants.PLAYER_SPEED;
    }

    if (
      Phaser.Input.Keyboard.JustDown(this.keys.SPACE) &&
      !this.isDashing &&
      this.scene.time.now > this.dashCooldown
    ) {
      this.isDashing = true;
      this.dashTime = this.scene.time.now + Constants.DASH_DURATION;
      this.dashCooldown = this.scene.time.now + Constants.DASH_COOLDOWN;
      this.dashVelocity = {
        x: this.body!.velocity.x * Constants.DASH_MULTIPLIER,
        y: this.body!.velocity.y * Constants.DASH_MULTIPLIER,
      };
    }

    if (this.isDashing) {
      this.setVelocity(this.dashVelocity.x, this.dashVelocity.y);
    } else {
      this.setVelocity(velocityX, velocityY);
    }
  }

  handleAnimation() {
    if (this.body?.velocity.x !== 0 || this.body?.velocity.y !== 0 || this.isDashing) {
      this.anims.play('walk', true);
    } else {
      this.anims.stop();
      this.anims.restart();
    }
  }

  handleHit() {
    this.health -= 10;
    if (this.health <= 0) {
      this.destroy();
    }
  }

  update() {
    if (this.isDashing && this.scene.time.now > this.dashTime) {
      this.isDashing = false;
    }
    this.handleInput();
    this.handleAnimation();

    this.weapons.forEach((weapon) => {
      this.scene.children.bringToTop(weapon);
      weapon.setPosition(this.x + this.width, this.y - this.height);
      weapon.update();
    });
  }
}
