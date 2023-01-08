import * as Pixi from 'pixi.js';
import { Component } from '../ecs';

export class Sprite extends Component {
  constructor(public data: Pixi.Sprite) {
    super();
  }
}
