import _ from 'lodash';
import * as Pixi from 'pixi.js';
import { ECS, System, UpdateMeta } from '../ecs';
import { Sprite } from '../components/sprite';
import { Ability } from '../components/ability';
import { Homing } from '../components/homing';
import { Enemy } from '../components/enemy';
import { Velocity } from '../components/velocity';

export class AbilitySystem implements System {
  lastUpdate: number;

  constructor(private app: Pixi.Application) {
    this.lastUpdate = new Date().valueOf();
  }

  componentsRequired: Set<Function> = new Set([Ability, Sprite]);

  update(ecs: ECS, entities: Set<number>, meta: UpdateMeta) {
    const now = new Date().valueOf();
    if (now - this.lastUpdate.valueOf() < 1000) {
      return;
    }
    this.lastUpdate = now;

    for (const entity of entities) {
      const components = ecs.getComponents(entity);

      const ability = components.get(Ability);
      const sprite = components.get(Sprite);
      const enemies = ecs.findEntities(Enemy);
      const randomEnemy = _.sample(enemies);

      if (!randomEnemy) {
        return;
      }

      switch (ability.type) {
        case 'wand': {
          const entity = ecs.addEntity();

          const gr = new Pixi.Graphics();
          gr.beginFill(0xff0099);
          gr.lineStyle(0);
          gr.drawCircle(4, 4, 4);
          gr.endFill();
          const texture = this.app.renderer.generateTexture(gr);
          const wandSprite = new Pixi.Sprite(texture);
          wandSprite.x = sprite.data.x;
          wandSprite.y = sprite.data.y;

          ecs.addComponent(
            entity,
            new Sprite(wandSprite),
            new Homing(randomEnemy),
            new Velocity(0, 0, 4),
          );
        }
      }
    }
  }
}
