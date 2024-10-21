export type Entity = number;

export type UpdateMeta = {
  dt: number;
};

export interface System {
  componentsRequired: Set<Function>;
  update: (ecs: ECS, entities: Set<Entity>, meta: UpdateMeta) => void;
}

export abstract class Component {}

export type ComponentClass<T extends Component> = new (...args: any[]) => T;

export class ComponentContainer {
  private map = new Map<Function, Component>();

  public add(component: Component): void {
    this.map.set(component.constructor, component);
  }

  public get<T extends Component>(componentClass: ComponentClass<T>): T {
    return this.map.get(componentClass) as T;
  }

  public has(componentClass: Function): boolean {
    return this.map.has(componentClass);
  }

  public hasAll(componentClasses: Iterable<Function>): boolean {
    for (let cls of componentClasses) {
      if (!this.map.has(cls)) {
        return false;
      }
    }
    return true;
  }

  public delete(componentClass: Function): void {
    this.map.delete(componentClass);
  }
}

export class ECS {
  entities: Map<Entity, ComponentContainer> = new Map();
  systems: Map<System, Set<Entity>> = new Map();
  entitiesToDestroy: Entity[] = [];
  nextEntityID: number = 0;

  addEntity(): Entity {
    const entity = this.nextEntityID;
    this.nextEntityID++;
    this.entities.set(entity, new ComponentContainer());
    return entity;
  }

  removeEntity(entity: Entity): void {
    this.entitiesToDestroy.push(entity);
  }

  addComponent(entity: Entity, ...components: Component[]): void {
    for (const component of components) {
      this.entities.get(entity)?.add(component);
      this.checkE(entity);
    }
  }

  getComponents(entity: Entity): ComponentContainer {
    return this.entities.get(entity) ?? new ComponentContainer();
  }

  removeComponent(entity: Entity, componentClass: Function): void {
    this.entities.get(entity)?.delete(componentClass);
    this.checkE(entity);
  }

  findFirstEntity(componentClass: Function): Entity | undefined {
    for (const [entity, components] of this.entities.entries()) {
      if (components.has(componentClass)) {
        return entity;
      }
    }
    return undefined;
  }

  findEntities(componentClass: Function): Entity[] {
    const entities: Entity[] = [];
    for (const [entity, components] of this.entities.entries()) {
      if (components.has(componentClass)) {
        entities.push(entity);
      }
    }
    return entities;
  }

  addSystem(system: System): void {
    if (system.componentsRequired.size == 0) {
      return;
    }

    this.systems.set(system, new Set());
    for (let entity of this.entities.keys()) {
      this.checkES(entity, system);
    }
  }

  removeSystem(system: System): void {
    this.systems.delete(system);
  }

  update(dt: number): void {
    for (let [system, entities] of this.systems.entries()) {
      system.update(this, entities, { dt });
    }

    while (this.entitiesToDestroy.length > 0) {
      const entity = this.entitiesToDestroy.pop();
      if (entity) {
        this.destroyEntity(entity);
      }
    }
  }

  destroyEntity(entity: Entity): void {
    this.entities.delete(entity);
    for (let entities of this.systems.values()) {
      entities.delete(entity);
    }
  }

  checkE(entity: Entity): void {
    for (const system of this.systems.keys()) {
      this.checkES(entity, system);
    }
  }

  checkES(entity: Entity, system: System): void {
    const have = this.entities.get(entity);
    const need = system.componentsRequired;

    if (have?.hasAll(need)) {
      this.systems.get(system)?.add(entity);
    } else {
      this.systems.get(system)?.delete(entity);
    }
  }
}
