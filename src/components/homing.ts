import { Component, Entity } from '../ecs';

export class Homing extends Component {
  constructor(public target: Entity) {
    super();
  }
}
