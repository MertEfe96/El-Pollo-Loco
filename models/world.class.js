class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
  }

  setWorld() {
    this.character.world = this;
  }

  update() {
    this.level.clouds.forEach((cloud) => cloud.moveLeft());
    // this.level.enemies.forEach((enemie) => enemie.animate());
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);

    this.update(); // animate all
    this.addObjectsToMap(this.level.background);
    this.addObjectsToMap(this.level.clouds);
    // this.addObjectsToMap(this.level.bottle);
    this.addObjectsToMap(this.level.collectable);
    this.addMapObject(this.character);
    this.addObjectsToMap(this.level.enemies);

    this.ctx.translate(-this.camera_x, 0);

    // draw() is beeing repeatedly done
    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addMapObject(o);
    });
  }

  addMapObject(mo) {
    if (mo.otherDirection) {
      this.ctx.save(); // aktuellen Zustand merken
      this.ctx.translate(mo.x + mo.width, 0);
      this.ctx.scale(-1, 1);
      this.ctx.drawImage(mo.img, 0, mo.y, mo.width, mo.height);
      this.ctx.restore(); // Zustand zurücksetzen
    } else {
      this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
    }
  }
}
