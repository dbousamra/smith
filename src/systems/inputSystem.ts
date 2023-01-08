import { Input } from '../components/input';
import { Velocity } from '../components/velocity';
import { ECS, System } from '../ecs';

export class InputSystem implements System {
  componentsRequired: Set<Function> = new Set([Input, Velocity]);

  keys: {
    right: boolean;
    left: boolean;
    up: boolean;
    down: boolean;
  };

  constructor() {
    this.keys = {
      right: false,
      left: false,
      up: false,
      down: false,
    };

    window.onkeydown = (e) => {
      if (e.key === 'ArrowRight') {
        this.keys.right = true;
      }
      if (e.key === 'ArrowLeft') {
        this.keys.left = true;
      }
      if (e.key === 'ArrowUp') {
        this.keys.up = true;
      }
      if (e.key === 'ArrowDown') {
        this.keys.down = true;
      }
    };

    window.onkeyup = (e) => {
      if (e.key === 'ArrowRight') {
        this.keys.right = false;
      }
      if (e.key === 'ArrowLeft') {
        this.keys.left = false;
      }
      if (e.key === 'ArrowUp') {
        this.keys.up = false;
      }
      if (e.key === 'ArrowDown') {
        this.keys.down = false;
      }
    };
  }

  update(ecs: ECS, entities: Set<number>) {
    for (const entity of entities) {
      const components = ecs.getComponents(entity);

      const velocity = components.get(Velocity);
      velocity.x = 0;
      velocity.y = 0;

      if (this.keys.down) {
        velocity.y = velocity.magnitude;
      }
      if (this.keys.up) {
        velocity.y = -velocity.magnitude;
      }
      if (this.keys.left) {
        velocity.x = -velocity.magnitude;
      }
      if (this.keys.right) {
        velocity.x = velocity.magnitude;
      }
    }
  }
}
