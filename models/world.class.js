/**
 * Main game world that handles rendering, physics, collisions, and game state.
 */
class World {
  character = new Character();
  level = level1;
  volume = 0.5;
  backgroundMusic = null;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  gameOverTriggered = false;
  running = true;
  collisionInterval = null;
  endTimeout = null;
  boss;
  winImage;
  winTriggered = false;
  lastFrameTime = 0;

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
    this.winImage.src = "img/9_intro_outro_screens/game_over/You Win A.png";
    this.winTriggered = false;
    this.running = true;
    this.lastFrameTime = performance.now();
    requestAnimationFrame((t) => this.draw(t));
    this.setWorld();
    this.checkCollisons();
    try {
      this.backgroundMusic = new Audio("audio/BGM/juliush-fiesta-en-guadalajara-mariachi-de-la-calle-503318.mp3");
      this.backgroundMusic.loop = true;
      this.backgroundMusic.volume = this.volume;
      const playPromise = this.backgroundMusic.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } catch (e) {}
  }

  /**
   * Associate the character with this world instance.
   * @returns {void}
   */
  setWorld() {
    this.character.world = this;
  }

  /**
   * Update world elements each frame.
   * Moves background clouds and thrown objects.
   * @returns {void}
   */
  update(delta = 16.6667) {
    const step = delta / (1000 / 60);
    this.level.clouds.forEach((cloud) => cloud.moveLeft(step));
    this.level.thrownObjects.forEach((bottle) => {
      bottle.x += bottle.speedX * step;
    });
  }

  /**
   * Begin periodic collision checks for the world.
   * @returns {void}
   */
  checkCollisons() {
    this.collisionInterval = setInterval(() => {
      if (!this.character.statusDead) {
        this.collisionEnemie();
        this.collisionCollectable();
        this.checkBottleHitsEnemy();
        this.checkBottleGroundHit();
      }
    }, 50);
  }

  /**
   * Destroy the world and stop game loops, timeouts, and audio.
   * @returns {void}
   */
  destroy() {
    this.running = false;
    if (this.collisionInterval) {
      clearInterval(this.collisionInterval);
      this.collisionInterval = null;
    }
    if (this.endTimeout) {
      clearTimeout(this.endTimeout);
      this.endTimeout = null;
    }
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
      this.backgroundMusic = null;
    }
  }

  /**
   * Determine whether the boss object is currently visible on screen.
   * @returns {boolean}
   */
  isBossVisible() {
    return this.boss.x + this.boss.width > -this.camera_x && this.boss.x < -this.camera_x + this.canvas.width;
  }

  /**
   * Handle collision detection between the character and enemies.
   * @returns {void}
   */
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

  /**
   * Handle collisions between thrown bottles and enemies.
   * @returns {void}
   */
  checkBottleHitsEnemy() {
    this.level.thrownObjects.forEach((bottle) => {
      this.level.enemies.forEach((enemy) => {
        if (bottle.isColliding(enemy) && !bottle.hasHit) {
          bottle.hasHit = true;
          enemy.HP -= 20;
          if ((bottle && typeof bottle.splash === "function") || bottle.y <= 330) {
            bottle.splash();
          } else {
            bottle.markForRemoval = true;
          }
        }
      });
    });

    this.level.thrownObjects = this.level.thrownObjects.filter((b) => !b.markForRemoval);

    this.level.enemies = this.level.enemies.filter((e) => !e.isDead());
  }

  /**
   * Trigger a bottle splash when it hits the ground.
   * @returns {void}
   */
  checkBottleGroundHit() {
    this.level.thrownObjects.forEach((bottle) => {
      if (bottle.y > 325) {
        bottle.splash();
        bottle.markForRemoval = true;
      }
    });
  }

  /**
   * Handle collisions between the character and collectible objects.
   * @returns {void}
   */
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

  /**
   * Inflict damage on an enemy and bounce the character.
   * @param {MovableObject} enemy - The enemy to damage.
   * @returns {void}
   */
  killEnemy(enemy) {
    enemy.HP -= 20;
    this.level.enemies = this.level.enemies.filter((e) => !e.isDead());
    if (!enemy.isTouchingEnemy) {
      enemy.isTouchingEnemy = true;
      enemy.playSound(enemy);
    }
    this.character.bounce();
  }

  /**
   * Main rendering loop for the world. Forces a 60 FPS update rate and draws the scene, status bars, and overlays.
   * @returns {void}
   */
  draw(timestamp) {
    if (!this.running) return;

    const delta = Math.min(timestamp - this.lastFrameTime, 100);
    this.lastFrameTime = timestamp;

    this.checkGameOver();
    if (this.gameOverTriggered) return;
    this.checkWinCondition();

    this.drawScene(delta);
    this.drawStatusBars();
    this.drawOverlays();

    requestAnimationFrame((t) => this.draw(t));
  }

  /**
   * Check whether the win condition has been met and trigger the end screen.
   * @returns {void}
   */
  checkWinCondition() {
    if (this.boss.statusDead && !this.winTriggered) {
      this.winTriggered = true;
      this.endTimeout = setTimeout(() => {
        window.showEndScreen("You win!");
      }, 3000);
    }
  }

  /**
   * Check whether the character has died and trigger the game over screen.
   * @returns {void}
   */
  /**
   * Check whether the character has died and trigger the game over screen.
   * @returns {void}
   */
  checkGameOver() {
    if (this.character.statusDead && this.character.deathAnimationDone) {
      if (!this.gameOverTriggered) {
        this.gameOverTriggered = true;
        this.endTimeout = setTimeout(() => {
          window.showEndScreen("Game over");
        }, 5000);
      }
    }
  }

  /**
   * Draw the world scene to the canvas.
   * @returns {void}
   */
  drawScene(delta) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.update(delta);
    this.addObjectsToMap(this.level.background);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.collectable);
    this.addMapObject(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.thrownObjects);
    this.ctx.translate(-this.camera_x, 0);
  }

  /**
   * Draw the status bars for the player and boss.
   * @returns {void}
   */
  drawStatusBars() {
    this.statusBar.drawStatus(this.ctx);
    if (this.isBossVisible()) {
      this.bossStatusBar.drawStatus(this.ctx);
    }
  }

  /**
   * Draw overlay images such as game over and win screens.
   * @returns {void}
   */
  drawOverlays() {
    if (this.character.statusDead && !this.character.deathAnimationDone) {
      this.ctx.drawImage(this.gameOverImage, 0, 0, this.canvas.width, this.canvas.height);
    }
    if (this.boss.statusDead) {
      this.ctx.drawImage(this.winImage, 0, 0, this.canvas.width, this.canvas.height);
    }
  }

  /**
   * Add all provided objects to the render queue.
   * @param {Array<DrawableObject>} objects - Objects to draw.
   * @returns {void}
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addMapObject(o);
    });
  }

  /**
   * Draw a single map object to the canvas.
   * @param {DrawableObject} mo - The object to render.
   * @returns {void}
   */
  addMapObject(mo) {
    if (!mo || !mo.img || !(mo.img instanceof HTMLImageElement)) {
      return;
    }

    if (mo.otherDirection) {
      this.flipImage(mo);
    } else {
      this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
    }
    //mo.drawFrame(this.ctx);
  }

  /**
   * Flip the rendering context horizontally for mirrored objects.
   * @param {DrawableObject} mo - The object to draw flipped.
   * @returns {void}
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.x + mo.width, 0);
    this.ctx.scale(-1, 1);
    if (mo && mo.img && mo.img instanceof HTMLImageElement) {
      this.ctx.drawImage(mo.img, 0, mo.y, mo.width, mo.height);
    }
    this.ctx.restore();
  }

  /**
   * Set the global world audio volume.
   * @param {number} value - A normalized volume value between 0 and 1.
   * @returns {void}
   */
  setVolume(value) {
    this.volume = Math.max(0, Math.min(1, value));

    if (this.character) {
      this.character.updateVolume();
    }

    this.level.enemies.forEach((e) => {
      if (e.deathSound) e.deathSound.volume = this.volume;
    });

    if (this.backgroundMusic) {
      this.backgroundMusic.volume = this.volume;
    }
  }

  /**
   * Retrieve the current world audio volume.
   * @returns {number}
   */
  getVolume() {
    return this.volume;
  }
}
