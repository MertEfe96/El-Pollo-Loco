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

  constructor() {
    super().loadImage(this.IMAGES_FLOATING_COIN[0]);
    this.x = 250 + Math.random() * 1500;
    this.baseY = 100 + Math.random() * 100; // Grundposition
    this.y = this.baseY;
    this.floatAngle = 0; // Anfangswinkel
    this.float(); // Startet die Animation direkt
  }

  float() {
    setInterval(() => {
      this.floatAngle += 0.05; // Je höher, desto schneller (z.B. 0.05–0.1)
      this.y = this.baseY + Math.sin(this.floatAngle) * 15; // 25px rauf/runter
    }, 1000 / 60); // 60 FPS
  }
}
