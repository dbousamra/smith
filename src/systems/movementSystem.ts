import { Sprite } from '../components/sprite';
import { Velocity } from '../components/velocity';
import { ECS, System } from '../ecs';

export class MovementSystem implements System {
  componentsRequired: Set<Function> = new Set([Sprite, Velocity]);

  update(ecs: ECS, entities: Set<number>) {
    for (const entity of entities) {
      const components = ecs.getComponents(entity);

      const sprite = components.get(Sprite);
      const velocity = components.get(Velocity);

      sprite.data.position.x += velocity.x;
      sprite.data.position.y += velocity.y;
    }
  }
}
