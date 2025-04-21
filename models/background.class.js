class Background extends MovableObject {
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.height = 480;
    this.width = 750;
    this.x = x;
    this.y = 0;
  }
}
