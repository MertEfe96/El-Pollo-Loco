class World {
  character = new Character();
  level = level1;
  volume = 0.5;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  gameOverTriggered = false;
  boss;
  winImage;
  winTriggered = false;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.statusBar = new StatusBar(this.character);
    this.gameOverImage = new Image();
    this.gameOverImage.src = "./img/9_intro_outro_screens/game_over/oh no you lost!.png";
    this.boss = this.level.enemies.find((e) => e instanceof Boss);
    this.bossStatusBar = new BossStatusBar(this.boss);
    this.winImage = new Image();
    this.winImage.src = "./img/9_intro_outro_screens/game_over/game over!.png";
    this.winTriggered = false;
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

  isBossVisible() {
    return this.boss.x + this.boss.width > -this.camera_x && this.boss.x < -this.camera_x + this.canvas.width;
  }

  collisionEnemie() {
    const now = new Date().getTime();
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy) && !this.character.isDead(this.character)) {
        const characterBottom = this.character.y + this.character.height - 40;
        const enemyTop = enemy.y;
        const isAbove = characterBottom <= enemyTop + enemy.height * 0.5;
        if (isAbove && this.character.speedY > -10) {
          this.killEnemy(enemy);
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
    this.checkWinCondition();
    this.checkGameOver();
    if (this.gameOverTriggered) return;
    this.drawScene();
    this.drawStatusBars();
    this.drawOverlays();
    requestAnimationFrame(() => this.draw());
  }

  checkWinCondition() {
    if (this.boss.statusDead && !this.winTriggered) {
      this.winTriggered = true;
      setTimeout(() => {
        document.querySelector(".introOutro").style.display = "flex";
      }, 5000);
    }
  }

  checkGameOver() {
    if (this.character.statusDead && this.character.deathAnimationDone) {
      if (!this.gameOverTriggered) {
        this.gameOverTriggered = true;
        setTimeout(() => {
          document.querySelector(".introOutro").style.display = "flex";
        }, 5000);
      }
    }
  }

  drawScene() {
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
  }

  drawStatusBars() {
    this.statusBar.drawStatus(this.ctx);
    if (this.isBossVisible()) {
      this.bossStatusBar.drawStatus(this.ctx);
    }
  }

  drawOverlays() {
    if (this.character.statusDead && !this.character.deathAnimationDone) {
      this.ctx.drawImage(this.gameOverImage, 0, 0, this.canvas.width, this.canvas.height);
    }
    if (this.boss.statusDead) {
      this.ctx.drawImage(this.winImage, 0, 0, this.canvas.width, this.canvas.height);
    }
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
    //mo.drawFrame(this.ctx);
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.x + mo.width, 0);
    this.ctx.scale(-1, 1);
    this.ctx.drawImage(mo.img, 0, mo.y, mo.width, mo.height);
    this.ctx.restore();
  }

  setVolume(value) {
    this.volume = Math.max(0, Math.min(1, value));

    if (this.character) {
      this.character.updateVolume();
    }

    this.level.enemies.forEach((e) => {
      if (e.deathSound) e.deathSound.volume = this.volume;
    });
  }

  getVolume() {
    return this.volume;
  }
}
