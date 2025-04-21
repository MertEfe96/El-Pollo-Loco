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

  moveRight() {
    console.log("Moving right");
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
}
