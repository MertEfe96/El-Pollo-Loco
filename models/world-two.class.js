/**
 * Alternate game world that reuses the base logic and can be initialized with a
 * different level while keeping the same gameplay systems.
 */
class WorldTwo extends World {
  /**
   * Create a second world variant.
   * @param {HTMLCanvasElement} canvas - The canvas used for rendering.
   * @param {Keyboard} keyboard - The keyboard controls for the game.
   * @param {Level} [level=level1] - The level to be used by this world.
   * @returns {void}
   */
  constructor(canvas, keyboard, level = level1) {
    super(canvas, keyboard, level);
  }

  /**
   * Update this world state and then call the base world update logic.
   * @param {number} [delta=16.6667] - Time elapsed since the last frame.
   * @returns {void}
   */
  update(delta = 16.6667) {
    super.update(delta);
  }

  /**
   * Set the global world audio volume for this world variant.
   * @param {number} value - A normalized volume value between 0 and 1.
   * @returns {void}
   */
  setVolume(value) {
    this.volume = Math.max(0, Math.min(1, value));
    if (this.character) {
      this.character.updateVolume();
    }
    this.level.enemies.forEach((e) => {
      if (e.deathSound) e.deathSound.volume = this.volume;
    });
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = this.volume;
    }
  }

  /**
   * Retrieve the current world audio volume.
   * @returns {number}
   */
  getVolume() {
    return this.volume;
  }
}
