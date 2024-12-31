import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { WavesManager } from '../managers/WavesManager';

export class WorldUI extends Phaser.Scene {
  healthText!: Phaser.GameObjects.Text;
  fpsText!: Phaser.GameObjects.Text;
  waveText!: Phaser.GameObjects.Text;
  enemiesRemainingText!: Phaser.GameObjects.Text;
  waveAlertText!: Phaser.GameObjects.Text;

  player!: Player;
  wavesManager!: WavesManager;

  constructor() {
    super('WorldUI');
  }

  create(options: { player: Player; wavesManager: WavesManager }) {
    this.player = options.player;
    this.wavesManager = options.wavesManager;

    this.healthText = this.add.text(200, 100, 'Health: 100%', {
      fontSize: '20px',
      color: '#ff0000 ',
    });
    this.healthText.setScrollFactor(0);
    this.healthText.setDepth(10);

    this.fpsText = this.add.text(200, 150, 'FPS: 60', {
      fontSize: '20px',
      color: '#ffffff',
    });
    this.fpsText.setScrollFactor(0);
    this.fpsText.setDepth(10);

    this.waveText = this.add.text(200, 200, 'Wave: 1', {
      fontSize: '20px',
      color: '#00ff00',
    });
    this.waveText.setScrollFactor(0);
    this.waveText.setDepth(10);

    this.enemiesRemainingText = this.add.text(200, 250, 'Enemies Remaining: 10', {
      fontSize: '20px',
      color: '#ff00ff',
    });
    this.enemiesRemainingText.setScrollFactor(0);
    this.enemiesRemainingText.setDepth(10);

    this.waveAlertText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, '', {
      fontSize: '40px',
      color: '#ffff00',
    });
    this.waveAlertText.setOrigin(0.5);
    this.waveAlertText.setScrollFactor(0);
    this.waveAlertText.setDepth(20);
    this.waveAlertText.setVisible(false);
  }

  update() {
    this.healthText.setText(`Health: ${this.player.health}%`);
    this.fpsText.setText(`FPS: ${Math.floor(this.game.loop.actualFps)}`);
    this.waveText.setText(`Wave: ${this.wavesManager.wave}`);
    this.enemiesRemainingText.setText(`Enemies Remaining: ${this.wavesManager.enemiesLeftToSpawn}`);
    if (this.wavesManager.waveTransition) {
      this.showWaveAlert(`Wave ${this.wavesManager.wave}`);
      this.wavesManager.waveTransition = false;
    }
  }

  showWaveAlert(message: string) {
    this.waveAlertText.setText(message);
    this.waveAlertText.setVisible(true);
    this.time.delayedCall(2000, () => {
      this.waveAlertText.setVisible(false);
    });
  }
}
