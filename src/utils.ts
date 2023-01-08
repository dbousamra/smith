import _ from 'lodash';
import * as Pixi from 'pixi.js';

export const randomIntFromInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const loadAnimatedSprite = async (
  path: string,
  name: string,
): Promise<() => Pixi.Sprite> => {
  const getSpriteSheetData = (path: string, name: string) => ({
    frames: {
      [`${name}-1`]: {
        frame: { x: 0 * 16, y: 0, w: 16, h: 16 },
        sourceSize: { w: 16, h: 16 },
        spriteSourceSize: { x: 0, y: 0 },
      },
      [`${name}-2`]: {
        frame: { x: 1 * 16, y: 0, w: 16, h: 16 },
        sourceSize: { w: 16, h: 16 },
        spriteSourceSize: { x: 0, y: 0 },
      },
      [`${name}-3`]: {
        frame: { x: 2 * 16, y: 0, w: 16, h: 16 },
        sourceSize: { w: 16, h: 16 },
        spriteSourceSize: { x: 0, y: 0 },
      },
      [`${name}-4`]: {
        frame: { x: 3 * 16, y: 0, w: 16, h: 16 },
        sourceSize: { w: 16, h: 16 },
        spriteSourceSize: { x: 0, y: 0 },
      },
    },
    meta: {
      image: path,
      format: 'RGBA8888',
      size: { w: 16 * 4, h: 16 },
      scale: '1',
    },
    animations: {
      enemy: [[`${name}-1`], [`${name}-2`], [`${name}-3`], [`${name}-4`]],
    },
  });

  const loadSprite = async (data: any): Promise<() => Pixi.Sprite> => {
    const spritesheet = new Pixi.Spritesheet(Pixi.BaseTexture.from(data.meta.image), data);

    // Generate all the Textures asynchronously
    await spritesheet.parse();

    return () => {
      // spritesheet is ready to use!
      const sprite = new Pixi.AnimatedSprite(spritesheet.animations.enemy);
      sprite.texture.baseTexture.scaleMode = Pixi.SCALE_MODES.NEAREST;

      // set the animation speed
      sprite.animationSpeed = 0.1666;

      sprite.play();

      return sprite;
    };
  };

  return loadSprite(getSpriteSheetData(path, name));
};

export const loadEnemies = async (): Promise<(() => Pixi.Sprite)[]> => {
  const enemyPaths = [
    { name: 'AdeptNecromancer', path: 'assets/enemies/adept necromancer/AdeptNecromancerIdle.png' },
    { name: 'CorruptedTreant', path: 'assets/enemies/corrupted treant/CorruptedTreantIdle.png' },
    { name: 'DeftSorceress', path: 'assets/enemies/deft sorceress/deft sorceress.png' },
    { name: 'EarthElemental', path: 'assets/enemies/earth elemental/EarthElementalIdle.png' },
    { name: 'ExpertDruid', path: 'assets/enemies/expert druid/expert druid.png' },
    { name: 'FireElemental', path: 'assets/enemies/fire elemental/FireElementalIdle.png' },
    { name: 'FleshGolem', path: 'assets/enemies/flesh golem/FleshGolemIdle.png' },
    { name: 'FlutteringPixie', path: 'assets/enemies/fluttering pixie/FlutteringPixieIdle.png' },
    { name: 'GlowingWisp', path: 'assets/enemies/glowing wisp/GlowingWispIdle.png' },
    { name: 'GrizzledTreant', path: 'assets/enemies/grizzled treant/GrizzledTreantIdle.png' },
    { name: 'IceGolem', path: 'assets/enemies/ice golem/IceGolemIdle.png' },
    { name: 'IronGolem', path: 'assets/enemies/iron golem/IronGolemIdle.png' },
    {
      name: 'SkilledBattlemage',
      path: 'assets/enemies/skilled battlemage/SkilledBattlemageIdle.png',
    },
    { name: 'VileWitch', path: 'assets/enemies/vile witch/VileWitchIdle.png' },
    { name: 'WaterElemental', path: 'assets/enemies/water elemental/WaterElementalIdle.png' },
  ];

  return Promise.all(enemyPaths.map(({ path, name }) => loadAnimatedSprite(path, name)));
};

export const loadTiles = async (path: string): Promise<Pixi.Texture[]> => {
  const texture = (await Pixi.Assets.load<Pixi.Texture>(path)) as Pixi.Texture;
  const sprites: Pixi.Texture[] = _.chain(_.range(0, texture.width, 8))
    .flatMap((x) => _.range(0, texture.height, 8).map((y) => ({ x, y })))
    .map((coord) => {
      const newTexture = new Pixi.Texture(texture.baseTexture, texture.frame);
      newTexture.baseTexture.scaleMode = Pixi.SCALE_MODES.NEAREST;
      newTexture.frame = new Pixi.Rectangle(coord.x, coord.y, 8, 8);

      return newTexture;
    })
    .value();

  return sprites;
};

export const normalized = (x: number, y: number): [number, number] => {
  const length = Math.sqrt(x ** 2 + y ** 2);
  return length === 0 ? [0, 0] : [x / length, y / length];
};
