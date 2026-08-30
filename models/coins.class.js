class Coin extends MovableObject {
  IMAGES_FLOATING_COIN = ["./img/8_coin/coin_1.png"];
  height = 150;
  width = 150;
  offset = {
    top: 50,
    bottom: 50,
    left: 50,
    right: 50,
  };

  /**
   * Create a floating coin collectible with a vertical bobbing motion.
   * @returns {void}
   */
  constructor() {
    super().loadImage(this.IMAGES_FLOATING_COIN[0]);
    this.x = 250 + Math.random() * 1500;
    this.baseY = 100 + Math.random() * 100;
    this.y = this.baseY;
    this.floatAngle = 0;
    this.float();
  }

  /**
   * Animate the coin floating up and down over time.
   * @returns {void}
   */
  float() {
    setInterval(() => {
      this.floatAngle += 0.05;
      this.y = this.baseY + Math.sin(this.floatAngle) * 15;
    }, 1000 / 60);
  }
}
