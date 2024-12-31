export const constants = {
  PLAYER_SPEED: 300,
  PLAYER_HEALTH: 100,

  ENEMY_SPEED: 120,

  DASH_DURATION: 200,
  DASH_MULTIPLIER: 4,
  DASH_COOLDOWN: 1500,

  PROJECTILE_SPEED: 500,
  PROJECTILE_FIRE_DELAY: 400,
};

export const bloodExplosionConfig: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig = {
  scale: { start: 1, end: 0 },
  blendMode: 'NORMAL',
  speed: { min: -200, max: 200 },
  lifespan: { min: 500, max: 1000 },
  quantity: 50,
  gravityY: 500,
  angle: { min: 0, max: 360 },
  rotate: { min: 0, max: 360 },
  alpha: { start: 1, end: 0 },
};

export const bloodDamageConfig: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig = {
  scale: { start: 2, end: 0 },
  blendMode: 'NORMAL',
  speed: { min: -100, max: 100 },
  lifespan: { min: 300, max: 600 },
  quantity: 20,
  gravityY: 300,
  angle: { min: 0, max: 360 },
  rotate: { min: 0, max: 360 },
  alpha: { start: 1, end: 0 },
};
