import _ from 'lodash';
import * as Pixi from 'pixi.js';
import '@pixi/math-extras';
import { Homing } from './components/homing';
import { Input } from './components/input';
import { Sprite } from './components/sprite';
import { Velocity } from './components/velocity';
import { ECS } from './ecs';
import { HomingSystem } from './systems/homingSystem';
import { InputSystem } from './systems/inputSystem';
import { SpriteSystem } from './systems/spriteSystem';
import { loadAnimatedSprite, loadEnemies, loadTiles, randomIntFromInterval } from './utils';
import { MovementSystem } from './systems/movementSystem';
import { AbilitySystem } from './systems/abilitySystem';
import { Enemy } from './components/enemy';
import { Ability } from './components/ability';

const init = async () => {
  const app = new Pixi.Application({
    view: document.querySelector('#app') as HTMLCanvasElement,
    autoDensity: true,
    resizeTo: window,
    powerPreference: 'high-performance',
    backgroundColor: 0x23272a,
  });

  let ecs = new ECS();
  ecs.addSystem(new SpriteSystem(app));
  ecs.addSystem(new InputSystem());
  ecs.addSystem(new MovementSystem());
  ecs.addSystem(new HomingSystem());
  ecs.addSystem(new AbilitySystem(app));

  // Add tiles
  const textures = await loadTiles('./assets/tileset.png');
  const map = await Pixi.Assets.load('./assets/map.json');
  const tileset = map.layers[0];
  const scale = app.screen.width / tileset.width / 8;
  for (let y = 0; y < tileset.height; y++) {
    for (let x = 0; x < tileset.width; x++) {
      const entity = ecs.addEntity();

      const tileIndex = tileset.data[y * tileset.width + x] - 1;
      const sprite = new Pixi.Sprite(textures[tileIndex]);
      sprite.x = x * 8 * scale;
      sprite.y = y * 8 * scale;
      sprite.scale.set(scale);
      ecs.addComponent(entity, new Sprite(sprite));
    }
  }

  // Add player
  const player = ecs.addEntity();
  const playerSprite = (
    await loadAnimatedSprite(
      'assets/enemies/novice pyromancer/NovicePyromancerIdle.png',
      'NovicePyromancer',
    )
  )();
  playerSprite.x = app.screen.width / 2;
  playerSprite.y = app.screen.height / 2;
  playerSprite.anchor.set(0.5, 0.5);
  playerSprite.scale.set(4);
  ecs.addComponent(
    player,
    new Sprite(playerSprite),
    new Input(),
    new Velocity(0, 0, 4),
    new Ability('wand'),
  );

  // Add enemies
  const enemySprites = await loadEnemies();
  _.times(3, () => {
    _.each(enemySprites, (getSprite) => {
      const entity = ecs.addEntity();
      const sprite = getSprite();
      sprite.anchor.set(0.5, 0.5);
      sprite.scale.set(4);
      sprite.x = randomIntFromInterval(0, app.screen.width);
      sprite.y = randomIntFromInterval(0, app.screen.height);
      ecs.addComponent(
        entity,
        new Sprite(sprite),
        new Velocity(0, 0, 1),
        new Homing(player),
        new Enemy(),
      );
    });
  });

  app.ticker.add((dt) => {
    ecs.update(dt);
  });
};

init();
