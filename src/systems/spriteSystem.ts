import _ from 'lodash';
import * as Pixi from 'pixi.js';
import { ECS, System } from '../ecs';
import { Sprite } from '../components/sprite';

export class SpriteSystem implements System {
  constructor(private app: Pixi.Application) {}

  componentsRequired: Set<Function> = new Set([Sprite]);

  update(ecs: ECS, entities: Set<number>) {
    for (const entity of entities) {
      const components = ecs.getComponents(entity);

      const sprite = components.get(Sprite);
      const spriteName = `sprite-${entity}`;
      sprite.data.name = spriteName;

      // check if stage children contains sprite with name
      // console.log(this.app.stage.children.length);
      if (!_.includes(this.app.stage.children, sprite.data)) {
        this.app.stage.addChild(sprite.data);
      }
    }
  }
}
