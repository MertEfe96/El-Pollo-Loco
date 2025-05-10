class Level {
  enemies;
  clouds;
  background;
  collectable;
  thrownObjects = [];

  constructor(enemies, clouds, background, collectable) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.background = background;
    this.collectable = collectable;
  }
}
