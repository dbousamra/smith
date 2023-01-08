import { Homing } from '../components/homing';
import { Sprite } from '../components/sprite';
import { Velocity } from '../components/velocity';
import { ECS, System } from '../ecs';

export class HomingSystem implements System {
  componentsRequired: Set<Function> = new Set([Sprite, Velocity, Homing]);

  update(ecs: ECS, entities: Set<number>) {
    for (const entity of entities) {
      const components = ecs.getComponents(entity);

      const velocity = components.get(Velocity);
      const homing = components.get(Homing);
      const sprite = components.get(Sprite);
      const target = ecs.getComponents(homing.target).get(Sprite);

      const homingPosition = sprite.data.position;
      const targetPosition = target.data.position;
      const homingVelocity = targetPosition
        .subtract(homingPosition)
        .normalize()
        .multiplyScalar(velocity.magnitude);

      velocity.x = homingVelocity.x;
      velocity.y = homingVelocity.y;
    }
  }
}
