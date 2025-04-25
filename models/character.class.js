class Character extends MovableObject {
  width = 175;
  height = 250;
  // y = 180;
  y = 0;
  speed = 5;
  HP = 100;
  energy = 0;
  statusDead = false;
  offset = {
    top: 50,
    bottom: 0,
    left: 30,
    right: 50,
  };
  IMAGES_IDLE = [
    "./img/2_character_pepe/1_idle/idle/I-1.png",
    "./img/2_character_pepe/1_idle/idle/I-2.png",
    "./img/2_character_pepe/1_idle/idle/I-3.png",
    "./img/2_character_pepe/1_idle/idle/I-4.png",
    "./img/2_character_pepe/1_idle/idle/I-5.png",
    "./img/2_character_pepe/1_idle/idle/I-6.png",
    "./img/2_character_pepe/1_idle/idle/I-7.png",
    "./img/2_character_pepe/1_idle/idle/I-8.png",
    "./img/2_character_pepe/1_idle/idle/I-9.png",
    "./img/2_character_pepe/1_idle/idle/I-10.png",
  ];
  IMAGES_WALKING = [
    "./img/2_character_pepe/2_walk/W-21.png",
    "./img/2_character_pepe/2_walk/W-22.png",
    "./img/2_character_pepe/2_walk/W-23.png",
    "./img/2_character_pepe/2_walk/W-24.png",
    "./img/2_character_pepe/2_walk/W-25.png",
    "./img/2_character_pepe/2_walk/W-26.png",
  ];
  IMAGES_JUMPING = [
    "./img/2_character_pepe/3_jump/J-31.png",
    "./img/2_character_pepe/3_jump/J-32.png",
    "./img/2_character_pepe/3_jump/J-33.png",
    "./img/2_character_pepe/3_jump/J-34.png",
    "./img/2_character_pepe/3_jump/J-35.png",
    "./img/2_character_pepe/3_jump/J-36.png",
    "./img/2_character_pepe/3_jump/J-37.png",
    "./img/2_character_pepe/3_jump/J-38.png",
    "./img/2_character_pepe/3_jump/J-39.png",
  ];
  IMAGES_DEATH = [
    "./img/2_character_pepe/5_dead/D-52.png",
    "./img/2_character_pepe/5_dead/D-53.png",
    "./img/2_character_pepe/5_dead/D-54.png",
    "./img/2_character_pepe/5_dead/D-51.png",
    "./img/2_character_pepe/5_dead/D-55.png",
    "./img/2_character_pepe/5_dead/D-56.png",
    "./img/2_character_pepe/5_dead/D-57.png",
  ];
  world;

  constructor() {
    super().loadImage("./img/2_character_pepe/1_idle/idle/I-1.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEATH);

    this.animate();
    this.applyGravity(180);
  }

  animate() {
    setInterval(() => this.handleMovement(), 1000 / 60);
    setInterval(() => this.handleAnimation(), 1000 / 7);
  }

  handleMovement() {
    const {RIGHT, LEFT} = this.world.keyboard;
    if (RIGHT && this.x < 2800 && !this.statusDead) {
      this.x += this.speed;
      this.otherDirection = false;
    }
    if (LEFT && this.x > -150 && !this.statusDead) {
      this.x -= this.speed;
      this.otherDirection = true;
    }
    if (this.x < 2285 && !this.statusDead) {
      this.world.camera_x = -this.x + 50;
    }
  }

  handleAnimation() {
    const k = this.world.keyboard;
    const noKeyPressed = !k.LEFT && !k.RIGHT && !k.UP && !k.DOWN && !k.SPACE;
    if (noKeyPressed && !this.isAboveGround(180) && !this.statusDead) {
      this.idleAnimation();
    }
    if ((k.RIGHT || k.LEFT) && !this.isAboveGround(180) && !this.statusDead) {
      this.moveChar();
    }
    if (k.SPACE && !this.isAboveGround(180) && !this.statusDead) {
      this.speedY = -15;
      console.log(this.speedY);
      this.jumpAnimation();
    }
  }

  moveChar() {
    this.playAnimation(this.IMAGES_WALKING);
  }

  idleAnimation() {
    this.playAnimation(this.IMAGES_IDLE);
  }

  jumpAnimation() {
    this.currentImage = 0;
    clearInterval(this.jumpMoveInterval);
    clearInterval(this.jumpAnimInterval);
    this.jumpMoveInterval = setInterval(() => {
      if (this.y > 140 && this.y < 180) {
        this.y += this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 4);
    this.jumpAnimInterval = setInterval(() => {
      if (this.y < 180) {
        this.playAnimation(this.IMAGES_JUMPING);
      }
    }, 1000 / 8);
  }
}
