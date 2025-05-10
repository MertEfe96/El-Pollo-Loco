class Chicken extends MovableObject {
  isTouchingEnemy = false;
  IMAGES_WALKING_CHICKEN = [
    "./img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "./img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "./img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  constructor() {
    super().loadImage("./img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.x = 250 + Math.random() * 1550;
    this.height = 80;
    this.width = 80;
    this.y = 345;
    this.HP = 20;
    this.speed = 5 + Math.random() * 1;
    this.deathSound = new Audio("./audio/Death/chicken-death.mp3");

    this.loadImages(this.IMAGES_WALKING_CHICKEN);

    this.animateMovement(this.IMAGES_WALKING_CHICKEN);
  }
}
