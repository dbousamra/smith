import { constants } from '../utils';
import { Bullet } from './Bullet';
import { Coin } from './Coin';
import { Enemy } from './Enemy';
import { Weapon } from './Weapon';

export class Player extends Phaser.Physics.Arcade.Sprite {
  initialPosition: { x: number; y: number };
  keys: Record<string, Phaser.Input.Keyboard.Key>;
  isDashing: boolean = false;
  dashTime: number = 0;
  dashCooldown: number = 0;
  dashVelocity: { x: number; y: number } = { x: 0, y: 0 };
  coins: number = constants.PLAYER_COINS;
  health: number = constants.PLAYER_HEALTH;
  bullets: Phaser.Physics.Arcade.Group;
  weapon: Weapon;
  thunderclapCooldown: boolean;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');
    this.initialPosition = { x, y };

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
      Q: Phaser.Input.Keyboard.KeyCodes.Q,
    }) as Record<string, Phaser.Input.Keyboard.Key>;

    this.bullets = scene.physics.add.group({
      classType: Bullet,
      runChildUpdate: true,
    });

    // Create a weapon
    this.weapon = new Weapon(scene, x, y, this.bullets);

    this.thunderclapCooldown = false;
  }

  handleInput() {
    if (this.isDashing && this.scene.time.now > this.dashTime) {
      this.isDashing = false;
    }

    let velocityX = 0;
    let velocityY = 0;

    if (this.keys.A.isDown) {
      velocityX = -constants.PLAYER_SPEED;
    } else if (this.keys.D.isDown) {
      velocityX = constants.PLAYER_SPEED;
    }

    if (this.keys.W.isDown) {
      velocityY = -constants.PLAYER_SPEED;
    } else if (this.keys.S.isDown) {
      velocityY = constants.PLAYER_SPEED;
    }

    if (
      Phaser.Input.Keyboard.JustDown(this.keys.SPACE) &&
      !this.isDashing &&
      this.scene.time.now > this.dashCooldown
    ) {
      this.isDashing = true;
      this.dashTime = this.scene.time.now + constants.DASH_DURATION;
      this.dashCooldown = this.scene.time.now + constants.DASH_COOLDOWN;
      this.dashVelocity = {
        x: this.body!.velocity.x * constants.DASH_MULTIPLIER,
        y: this.body!.velocity.y * constants.DASH_MULTIPLIER,
      };
    }

    if (this.isDashing) {
      this.setVelocity(this.dashVelocity.x, this.dashVelocity.y);
    } else {
      this.setVelocity(velocityX, velocityY);
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.Q)) {
      this.useThunderclap();
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

  collectCoin(coin: Coin) {
    coin.destroy();
    this.coins += 1;
  }

  preUpdate() {
    this.handleInput();
    this.handleAnimation();

    this.scene.children.bringToTop(this.weapon);
    this.weapon.setPosition(this.x + this.width, this.y - this.height);
  }

  useThunderclap() {
    if (this.thunderclapCooldown) {
      return;
    }

    this.thunderclapCooldown = true;
    this.scene.time.delayedCall(6000, () => {
      this.thunderclapCooldown = false;
    });

    const thunderclapRadius = 200;
    const thunderclapDamage = 100;
    const thunderclapSlowDuration = 2000;

    const enemies = this.scene.physics
      .overlapCirc(this.x, this.y, thunderclapRadius, true, true)
      .map((e) => e.gameObject)
      .filter((e) => e instanceof Enemy);

    enemies.forEach((enemy) => {
      enemy.takeDamage(thunderclapDamage);
      enemy.setTint(0x0000ff); // Change color to indicate slow effect
      this.scene.time.delayedCall(thunderclapSlowDuration, () => {
        enemy.clearTint();
      });
    });

    // // Add visual effect for thunderclap
    const thunderclapEffect = this.scene.add.circle(
      this.x,
      this.y,
      thunderclapRadius,
      0x00ffff,
      0.5,
    );
    this.scene.tweens.add({
      targets: thunderclapEffect,
      alpha: 0,
      duration: 400,
      onComplete: () => {
        thunderclapEffect.destroy();
      },
    });
  }
}
