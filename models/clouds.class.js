class Cloud extends MovableObject {
  cloudArr = [1, 2];
  rndNr = Math.floor(Math.random() * 2);
  rnd = this.cloudArr[this.rndNr];
  width = 250;
  height = 150;
  constructor() {
    super().loadImage(`./img/5_background/layers/4_clouds/${this.rnd}.png`);
    this.x = Math.random() * 650;
    this.y = Math.random() * 50;
    this.speed = 0.05 + Math.random() * 0.1; // every cloud gets its own speed
  }
}
