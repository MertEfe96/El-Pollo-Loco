class Egg extends MovableObject {
  width = 40;
  height = 40;
  speedX = -6;
  speedY = 0;
  markForRemoval = false;
  hasHit = false;

  IMAGES = ["img/4_enemie_boss_chicken/6_egg/egg1.png"];
  IMAGES_ROTATION = [
    "img/4_enemie_boss_chicken/6_egg/egg1.png",
    "img/4_enemie_boss_chicken/6_egg/egg2.png",
    "img/4_enemie_boss_chicken/6_egg/egg3.png",
    "img/4_enemie_boss_chicken/6_egg/egg4.png",
  ];

  constructor() {
    super().loadImage("img/4_enemie_boss_chicken/6_egg/egg1.png");
    this.loadImages(this.IMAGES);
    this.loadImages(this.IMAGES_ROTATION);
    this.animateRotation(this.IMAGES_ROTATION, 8);
  }

  remove() {
    this.markForRemoval = true;
  }
}
