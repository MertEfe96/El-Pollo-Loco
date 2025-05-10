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
    this.statusBar = new StatusBar(this.character);
    this.draw();
    this.setWorld();
    this.checkCollisons();
  }

  setWorld() {
    this.character.world = this;
  }

  update() {
    this.level.clouds.forEach((cloud) => cloud.moveLeft());
    this.level.thrownObjects.forEach((bottle) => {
      bottle.x += bottle.speedX;
    });
  }

  checkCollisons() {
    setInterval(() => {
      if (!this.character.statusDead) {
        this.collisionEnemie();
        this.collisionCollectable();
        this.checkBottleHitsEnemy();
      }
    }, 100);
  }

  // collisionEnemie() {
  //   const now = new Date().getTime();
  //   this.level.enemies.forEach((enemy) => {
  //     if (this.character.isColliding(enemy) && !this.character.isDead(this.character)) {
  //       this.character.isTakingDMG(enemy);
  //     }
  //     if (now - this.character.lastHitTime > this.character.invincibilityDuration) {
  //       this.character.isTouchingEnemy = false;
  //     }
  //   });
  // }

  collisionEnemie() {
    const now = new Date().getTime();
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy) && !this.character.isDead(this.character)) {
        const characterBottom = this.character.y + this.character.height - 20;
        const enemyTop = enemy.y;
        const isAbove = characterBottom <= enemyTop + enemy.height * 0.5;

        if (isAbove && this.character.speedY > -10) {
          this.killEnemy(enemy);
          // enemy.HP -= 20;
          // this.level.enemies = this.level.enemies.filter((e) => !e.isDead());
          // if (!enemy.isTouchingEnemy) {
          //   enemy.isTouchingEnemy = true;
          //   enemy.playSound(enemy);
          // }
          // this.character.bounce();
        } else {
          this.character.isTakingDMG(enemy);
        }
      }
      if (now - this.character.lastHitTime > this.character.invincibilityDuration) {
        this.character.isTouchingEnemy = false;
      }
    });
  }

  checkBottleHitsEnemy() {
    this.level.thrownObjects.forEach((bottle) => {
      this.level.enemies.forEach((enemy) => {
        if (bottle.isColliding(enemy)) {
          enemy.HP -= 20;
          bottle.markForRemoval = true;
        }
      });
    });

    this.level.thrownObjects = this.level.thrownObjects.filter((b) => !b.markForRemoval);

    this.level.enemies = this.level.enemies.filter((e) => !e.isDead());
  }

  collisionCollectable() {
    this.level.collectable.forEach((collectable) => {
      if (this.character.isColliding(collectable) && !this.character.isDead(this.character)) {
        if (collectable instanceof Coin) {
          this.character.collectedCoins += 1;
        }
        if (collectable instanceof Bottle) {
          this.character.collectedBottles += 1;
        }
        this.level.collectable = this.level.collectable.filter((obj) => obj !== collectable);
      }
    });
  }

  killEnemy(enemy) {
    enemy.HP -= 20;
    this.level.enemies = this.level.enemies.filter((e) => !e.isDead());
    if (!enemy.isTouchingEnemy) {
      enemy.isTouchingEnemy = true;
      enemy.playSound(enemy);
    }
    this.character.bounce();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);

    this.update();
    this.addObjectsToMap(this.level.background);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.collectable);
    this.addMapObject(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.thrownObjects);

    this.ctx.translate(-this.camera_x, 0);

    this.statusBar.drawStatus(this.ctx);

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
      this.flipImage(mo);
    } else {
      this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
    }

    mo.drawFrame(this.ctx);
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.x + mo.width, 0);
    this.ctx.scale(-1, 1);
    this.ctx.drawImage(mo.img, 0, mo.y, mo.width, mo.height);
    this.ctx.restore();
  }
}
