class Background extends MovableObject {
  /**
   * Create a background layer object.
   * @param {string} imagePath - Path to the background image.
   * @param {number} x - Initial X position.
   */
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.height = 480;
    this.width = 750;
    this.x = x;
    this.y = 0;
  }
}
