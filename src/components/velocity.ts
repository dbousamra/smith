import { Component } from '../ecs';

export class Velocity extends Component {
  constructor(public x: number, public y: number, public magnitude: number) {
    super();
  }
}
