export class Boot extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    this.load.spritesheet('player', 'assets/player.png', {
      frameWidth: 40,
      frameHeight: 40,
    });

    this.load.spritesheet('weapons', 'assets/weapons.png', {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet('ak47', 'assets/ak47.png', {
      frameWidth: 105,
      frameHeight: 64,
    });

    this.load.spritesheet('enemy', 'assets/enemy.png', {
      frameWidth: 36,
      frameHeight: 39,
    });
  }

  create() {
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 6 }),
      frameRate: 15, // Frames per second
      repeat: -1, // -1 means loop indefinitely
    });
    this.anims.create({
      key: 'enemy-walk',
      frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 3 }),
      frameRate: 15, // Frames per second
      repeat: -1, // -1 means loop indefinitely
    });
    this.scene.start('Game');
  }
}
