class Character extends MovableObject {
  width = 150;
  height = 250;
  // y = 180;
  y = 0;
  speed = 5;
  HP = 100;
  energy = 0;
  statusDead = false;
  collectedCoins = 0;
  collectedBottles = 0;
  lastHitTime = 0;
  invincibilityDuration = 1000;
  lastThrowTime = 0;
  throwCooldown = 2000;
  isTouchingEnemy = false;
  deathAnimationDone = false;
  longIdleDelay = 5000;
  lastInputTime = Date.now();
  longIdleActive = false;
  offset = {
    top: 110,
    bottom: 40,
    left: 30,
    right: 45,
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
  IMAGES_LONG_IDLE = [
    "./img/2_character_pepe/1_idle/long_idle/I-11.png",
    "./img/2_character_pepe/1_idle/long_idle/I-12.png",
    "./img/2_character_pepe/1_idle/long_idle/I-13.png",
    "./img/2_character_pepe/1_idle/long_idle/I-14.png",
    "./img/2_character_pepe/1_idle/long_idle/I-15.png",
    "./img/2_character_pepe/1_idle/long_idle/I-16.png",
    "./img/2_character_pepe/1_idle/long_idle/I-17.png",
    "./img/2_character_pepe/1_idle/long_idle/I-18.png",
    "./img/2_character_pepe/1_idle/long_idle/I-19.png",
    "./img/2_character_pepe/1_idle/long_idle/I-20.png",
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
  IMAGES_HURT = [
    "./img/2_character_pepe/4_hurt/H-41.png",
    "./img/2_character_pepe/4_hurt/H-42.png",
    "./img/2_character_pepe/4_hurt/H-43.png",
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

  /**
   * Create the player character and preload animations.
   */
  constructor() {
    super().loadImage("./img/2_character_pepe/1_idle/idle/I-1.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEATH);

    this.hurtSound = new Audio("./audio/Death/homemadeoof-47509.mp3");
    this.hurtSound.volume = 0.5;

    this.animate();
    this.applyGravity(180);
  }

  /**
   * Start character movement and animation loops.
   * @returns {void}
   */
  animate() {
    setInterval(() => this.handleMovement(), 1000 / 60);
    setInterval(() => this.handleAnimation(), 1000 / 7);
    setInterval(() => this.checkLongIdle(), 1000);
  }

  /**
   * Move the character according to current keyboard input.
   * @returns {void}
   */
  handleMovement() {
    const {RIGHT, LEFT} = this.world.keyboard;
    if (RIGHT && this.x < 2800 && !this.statusDead && !this.world.winTriggered) {
      this.x += this.speed;
      this.otherDirection = false;
      this.lastInputTime = Date.now();
    }
    if (LEFT && this.x > -150 && !this.statusDead && !this.world.winTriggered) {
      this.x -= this.speed;
      this.otherDirection = true;
      this.lastInputTime = Date.now();
    }
    if (this.x < 2285 && !this.statusDead && !this.world.winTriggered) {
      this.world.camera_x = -this.x + 50;
    }
  }

  /**
   * Update the character's animation state based on input and movement.
   * @returns {void}
   */
  handleAnimation() {
    const k = this.world.keyboard;
    const noKeyPressed = !k.LEFT && !k.RIGHT && !k.UP && !k.DOWN && !k.SPACE;
    if (noKeyPressed && !this.isAboveGround(180) && !this.statusDead) {
      if (this.longIdleActive) {
        this.playAnimation(this.IMAGES_LONG_IDLE);
      } else {
        this.idleAnimation();
      }
    }
    if ((k.RIGHT || k.LEFT) && !this.isAboveGround(180) && !this.statusDead && !this.world.winTriggered) {
      this.moveChar();
    }
    if (k.SPACE && !this.isAboveGround(180) && !this.statusDead && !this.world.winTriggered) {
      this.speedY = -15;
      this.jumpAnimation();
    }
    if (k.THROW && this.checkThrowHelper()) {
      this.throwAnimation();
      this.lastInputTime = Date.now();
    }
    if ((k.RIGHT || k.LEFT || k.SPACE || k.THROW) && !this.statusDead) {
      this.lastInputTime = Date.now();
      this.longIdleActive = false;
    }
  }

  /**
   * Determine whether the character can throw a bottle.
   * @returns {boolean}
   */
  checkThrowHelper() {
    const cooldownElapsed = Date.now() - this.lastThrowTime >= this.throwCooldown;
    return (
      !this.isAboveGround(180) &&
      !this.statusDead &&
      !this.world.winTriggered &&
      this.collectedBottles > 0 &&
      cooldownElapsed
    );
  }

  /**
   * Execute the bottle throw animation and update inventory.
   * @returns {void}
   */
  throwAnimation() {
    this.collectedBottles -= 1;
    this.lastThrowTime = Date.now();
    this.throwBottle();
    this.world.keyboard.THROW = false;
  }

  /**
   * Play the walking animation for the character.
   * @returns {void}
   */
  moveChar() {
    this.playAnimation(this.IMAGES_WALKING);
  }

  /**
   * Play the idle animation when no movement input is active.
   * @returns {void}
   */
  idleAnimation() {
    this.playAnimation(this.IMAGES_IDLE);
  }

  /**
   * Animate the character in long idle mode after extended inactivity.
   * @returns {void}
   */
  longIdleAnimation() {
    this.currentImage = 0;
    this.longIdleActive = true;
  }

  /**
   * Trigger the jump animation and upward movement.
   * @returns {void}
   */
  jumpAnimation() {
    this.currentImage = 0;
    clearInterval(this.jumpMoveInterval);
    clearInterval(this.jumpAnimInterval);
    this.jumpMoveInterval = setInterval(() => {
      if (this.y > 140 && this.y < 180) {
        this.y += this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 60);
    this.jumpAnimInterval = setInterval(() => {
      if (this.y < 180) {
        this.playAnimation(this.IMAGES_JUMPING);
      }
    }, 1000 / 7);
  }

  /**
   * Bounce the character upward after damaging an enemy.
   * @returns {void}
   */
  bounce() {
    this.speedY = -15;
  }

  /**
   * Spawn and throw a bottle object from the character's position.
   * @returns {void}
   */
  throwBottle() {
    const bottle = new Bottle();
    bottle.x = this.x + (this.otherDirection ? +10 : this.width - 80);
    bottle.y = this.y + this.height / 1.8;
    bottle.speedX = this.otherDirection ? -4 : 4;
    bottle.speedY = -15;
    bottle.otherDirection = this.otherDirection;
    bottle.fromPlayer = true;
    bottle.applyGravity(330);
    bottle.animateRotation(bottle.IMAGES_BOTTLE_ROTATION);
    this.world.level.thrownObjects.push(bottle);
  }

  /**
   * Check for extended idle duration and start long idle animation.
   * @returns {void}
   */
  checkLongIdle() {
    if (
      !this.statusDead &&
      !this.world.winTriggered &&
      !this.isAboveGround(180) &&
      !this.longIdleActive &&
      Date.now() - this.lastInputTime > this.longIdleDelay
    ) {
      this.longIdleAnimation();
    }
  }

  /**
   * Sync hurt sound volume with the world volume.
   * @returns {void}
   */
  updateVolume() {
    if (this.world && this.hurtSound) {
      this.hurtSound.volume = this.world.getVolume();
    }
  }
}
