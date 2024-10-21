import { Component } from '../ecs';

export type AbilityType = 'wand';

export class Ability extends Component {
  constructor(public type: AbilityType) {
    super();
  }
}
