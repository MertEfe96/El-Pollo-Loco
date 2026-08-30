class MovableObject extends DrawableObject {
  speedY = 0;
  speedX = 0;
  HP = 100;
  acceleration = 1.5;
  offset = {
    top: 0,
    bottom: 0,
    left: 50,
    right: 0,
  };

  /**
   * Move this object leftwards across the screen.
   * If the object leaves the canvas on the left, it wraps to the right.
   * @returns {void}
   */
  moveLeft() {
    this.x -= this.speed;

    if (this.x + this.width < 0) {
      this.x = 1800;
    }
  }

  /**
   * Animate movement by repeatedly moving left and playing frames.
   * @param {string[]} arr - Image frames for the animation.
   * @returns {void}
   */
  animateMovement(arr) {
    setInterval(() => {
      this.moveLeft();
      this.playAnimation(arr);
    }, 1000 / 8);
  }

  /**
   * Animate rotation frames for the object.
   * @param {string[]} arr - Image frames for rotation.
   * @param {number} time - Frames per second for the rotation animation.
   * @returns {void}
   */
  animateRotation(arr, time) {
    setInterval(() => {
      if (this instanceof Bottle && this.isSplashing) {
        return;
      }
      this.playAnimation(arr);
    }, 1000 / time);
  }

  /**
   * Play a single animation cycle from the provided frame array.
   * @param {string[]} arr - Image paths used for the animation.
   * @returns {void}
   */
  playAnimation(arr) {
    let i = this.currentImage % arr.length;
    let path = arr[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Apply gravity to the object until it lands at a minimum Y coordinate.
   * @param {number} minY - The ground level Y coordinate.
   * @returns {void}
   */
  applyGravity(minY) {
    setInterval(() => {
      if (this.isAboveGround(minY) || this.speedY < 0) {
        this.y += this.speedY;
        this.speedY += this.acceleration;
      } else {
        this.y = minY;
        this.speedY = 0;
      }
    }, 1000 / 25);
  }

  /**
   * Determine whether the object is above a ground line.
   * @param {number} minY - The ground level Y coordinate.
   * @returns {boolean}
   */
  isAboveGround(minY) {
    return this.y < minY;
  }

  /**
   * Draw a debug collision frame around the object.
   * @param {CanvasRenderingContext2D} ctx - The drawing context.
   * @returns {void}
   */
  drawFrame(ctx) {
    if (this instanceof Character || this instanceof Chicken || this instanceof Coin || this instanceof Bottle) {
      ctx.beginPath();
      ctx.lineWitdh = "5";
      ctx.strokeStyle = "blue";
      ctx.rect(
        this.x + this.offset.left,
        this.y + this.offset.top,
        this.width - this.offset.right,
        this.height - this.offset.bottom,
      );
      ctx.stroke();
    }
  }

  /**
   * Check whether this object collides with another object.
   * @param {MovableObject} obj - The object to test collision against.
   * @returns {boolean}
   */
  isColliding(obj) {
    return (
      this.x + this.width - this.offset.right >= obj.x + obj.offset.left &&
      this.x + this.offset.left <= obj.x + obj.width - obj.offset.right &&
      this.y + this.height - this.offset.bottom >= obj.y + obj.offset.top &&
      this.y + this.offset.top <= obj.y + obj.height - obj.offset.bottom
    );
  }

  /**
   * Apply damage to this object from another colliding object.
   * @param {MovableObject} obj - The object that caused the damage.
   * @returns {void}
   */
  isTakingDMG(obj) {
    const now = new Date().getTime();
    if (
      (this.x + this.width - this.offset.right >= obj.x + obj.offset.left ||
        this.x + this.offset.left <= obj.x + obj.width - obj.offset.right) &&
      this.HP > 0
    ) {
      this.HP -= 2;
      this.lastHitTime = now;
      this.playAnimation(this.IMAGES_HURT);
      if (!this.isTouchingEnemy) {
        this.playSound(this);
      }
    }
  }

  /**
   * Play the appropriate hurt or death sound for this object.
   * @param {MovableObject} mo - The object whose sound should play.
   * @returns {void}
   */
  playSound(mo) {
    mo.isTouchingEnemy = true;
    if (mo.hurtSound) {
      mo.hurtSound.currentTime = 0;
      mo.hurtSound.play();
    } else if (mo.deathSound) {
      mo.deathSound.currentTime = 0;
      mo.deathSound.play();
    }
  }

  /**
   * Determine whether this object is dead and update its status.
   * @returns {boolean|undefined}
   */
  isDead() {
    if (this.HP <= 1 && this instanceof Character) {
      this.statusDead = true;
      this.playDead(this);
      return true;
    }
    if (this.HP <= 1 && (this instanceof Chicken || this instanceof Boss)) {
      this.statusDead = true;
      return true;
    }
  }

  /**
   * Run the death animation for a dying character.
   * @param {Character} char - The character instance to animate.
   * @returns {void}
   */
  playDead(char) {
    char.currentImage = 0;
    let i = 0;
    const intervalId = setInterval(() => {
      char.playAnimation(char.IMAGES_DEATH);
      i++;
      if (i === 7) {
        clearInterval(intervalId);
        char.deathAnimationDone = true;
      }
    }, 1000 / 2);
  }
}
