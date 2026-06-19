class Level {
  enemies;
  clouds;
  background;
  collectable;
  thrownObjects = [];

  /**
   * Create a new level with enemies, clouds, background layers, and collectables.
   * @param {Array<MovableObject>} enemies - Enemies in the level.
   * @param {Array<Cloud>} clouds - Cloud objects.
   * @param {Array<Background>} background - Background layers.
   * @param {Array<MovableObject>} collectable - Collectable objects.
   */
  constructor(enemies, clouds, background, collectable) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.background = background;
    this.collectable = collectable;
  }
}
