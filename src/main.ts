import Phaser from 'phaser';
import { Game } from './scenes/Game';
import { Boot } from './scenes/Boot';
import { WorldUI } from './scenes/WorldUI';
import { GameOver } from './scenes/GameOver';
import { GameComplete } from './scenes/GameComplete';

const init = async () => {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: '#app',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    backgroundColor: '#23272a',
    scene: [Boot, Game, WorldUI, GameOver, GameComplete],
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
  };

  return new Phaser.Game({ ...config });
};

init();
