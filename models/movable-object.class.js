class MovableObject {
  x = 100;
  y = 270;
  height = 150;
  width = 100;
  speedY = 0;
  acceleration = 1;
  img;
  imageCache = {};
  currentImage = 0;
  offset = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  moveLeft() {
    this.x -= this.speed;

    if (this.x + this.width < 0) {
      this.x = 1800;
    }
  }

  animateMovement(arr) {
    setInterval(() => {
      this.moveLeft();
      this.playAnimation(arr);
    }, 1000 / 8);
  }

  animateRotation(arr) {
    setInterval(() => {
      this.playAnimation(arr);
    }, 1000 / 4);
  }

  playAnimation(arr) {
    let i = this.currentImage % arr.length;
    let path = arr[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

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

  isAboveGround(minY) {
    return this.y < minY;
  }

  drawFrame(ctx) {
    if (this instanceof Character || this instanceof Chicken || this instanceof Coin || this instanceof Bottle) {
      ctx.beginPath();
      ctx.lineWitdh = "5";
      ctx.strokeStyle = "blue";
      ctx.rect(
        this.x + this.offset.left,
        this.y + this.offset.top,
        this.width - this.offset.right,
        this.height - this.offset.bottom
      );
      ctx.stroke();
    }
  }

  isColliding(obj) {
    return (
      this.x + this.width - this.offset.right >= obj.x + obj.offset.left && // R > L
      this.x + this.offset.left <= obj.x + obj.width - obj.offset.right && // L > R
      this.y + this.height - this.offset.bottom >= obj.y + obj.offset.top && // U > O
      this.y + this.offset.top <= obj.y + obj.height - obj.offset.bottom // O > U
    );
  }

  isTakingDMG(obj) {
    if (
      (this.x + this.width - this.offset.right >= obj.x + obj.offset.left ||
        this.x + this.offset.left <= obj.x + obj.width - obj.offset.right) &&
      this.HP > 0
    ) {
      this.HP -= 2;
      this.playAnimation(this.IMAGES_HURT);
    }
  }

  isDead() {
    if (this.HP <= 1) {
      this.statusDead = true;
      this.playDead(this);
      return true;
    }
  }

  playDead(char) {
    console.log("dead");
    char.currentImage = 0;
    let i = 0;
    const intervalId = setInterval(() => {
      char.playAnimation(char.IMAGES_DEATH);
      i++;
      if (i === 7) {
        clearInterval(intervalId);
      }
    }, 1000 / 2);
  }

  clearImageCache() {
    this.imageCache = {};
  }
  a;
}
