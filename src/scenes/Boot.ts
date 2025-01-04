export class Boot extends Phaser.Scene {
  startText!: Phaser.GameObjects.Text;

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

    this.load.spritesheet('blood', 'assets/blood.png', {
      frameWidth: 100,
      frameHeight: 100,
    });

    this.load.spritesheet('coin', 'assets/loot.png', {
      frameWidth: 16,
      frameHeight: 16,
    });

    const graphics = this.add.graphics();
    graphics.fillStyle(0xff0000, 1);
    graphics.fillRect(0, 0, 2, 2);
    graphics.generateTexture('redPixel', 2, 2);
    graphics.destroy();
  }

  create() {
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 6 }),
      frameRate: 15,
      repeat: -1,
    });
    this.anims.create({
      key: 'enemy-walk',
      frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 3 }),
      frameRate: 15,
      repeat: -1,
    });

    this.anims.create({
      key: 'blood-explode',
      frames: this.anims.generateFrameNumbers('blood', { start: 0, end: 22 }), // Adjust range as needed
      frameRate: 60,
      hideOnComplete: true,
    });

    this.anims.create({
      key: 'coin-spin',
      frames: this.anims.generateFrameNumbers('coin', { start: 61, end: 66 }), // Adjust range as needed
      frameRate: 15,
      repeat: -1,
    });

    this.startText = this.add
      .text(this.cameras.main.centerX, this.cameras.main.centerY, 'Press any key to start', {
        fontSize: '32px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.input.keyboard!.once('keydown', () => {
      this.startText.destroy();
      this.scene.start('Game');
    });
  }
}
