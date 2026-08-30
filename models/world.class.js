/**
 * Base game world that owns the render loop, collision logic, boss behavior,
 * audio, and the current level and character instance.
 */
class World {
  character;
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
  lastBossEggTime = 0;

  /**
   * Create a new game world.
   * @param {HTMLCanvasElement} canvas - The canvas used for drawing the world.
   * @param {Keyboard} keyboard - The keyboard input handler.
   * @param {Level} [level=level1] - The level to load into the world.
   * @returns {void}
   */
  constructor(canvas, keyboard, level = level1) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;
    this.level = level;
    this.character = new Character();
    this.statusBar = new StatusBar(this.character);
    this.gameOverImage = new Image();
    this.gameOverImage.src = "./img/9_intro_outro_screens/game_over/oh no you lost!.png";
    this.boss = this.level.enemies.find((e) => e instanceof Boss);
    this.bossStatusBar = new BossStatusBar(this.boss);
    this.winImage = new Image();
    this.winImage.src = "img/9_intro_outro_screens/game_over/You Win A.png";
    this.lastFrameTime = performance.now();
    this.setWorld();
    this.checkCollisons();
    this.backgroundMusic = new Audio("audio/BGM/juliush-fiesta-en-guadalajara-mariachi-de-la-calle-503318.mp3");
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = this.volume;
    this.backgroundMusic.play().catch(() => {});
    requestAnimationFrame((t) => this.draw(t));
  }

  /**
   * Attach the character to this world instance.
   * @returns {void}
   */
  setWorld() {
    this.character.world = this;
  }

  /**
   * Update world state for one animation frame.
   * @param {number} [delta=16.6667] - Time elapsed since the last frame.
   * @returns {void}
   */
  update(delta = 16.6667) {
    const step = delta / (1000 / 60);
    this.level.clouds.forEach((cloud) => cloud.moveLeft(step));
    this.level.thrownObjects.forEach((bottle) => (bottle.x += bottle.speedX * step));
    this.updateBossEgg();
  }

  /**
   * Check whether the boss should spawn a new egg and launch it at the player.
   * @returns {void}
   */
  updateBossEgg() {
    if (!this.boss || this.boss.statusDead) return;
    const now = performance.now();
    if (!this.isBossVisible()) return (this.lastBossEggTime = now);
    if (!this.lastBossEggTime) this.lastBossEggTime = now;
    if (now - this.lastBossEggTime >= 3000) {
      const egg = new Egg();
      egg.x = this.boss.x + this.boss.width / 2 - egg.width / 2;
      egg.y = this.boss.y + this.boss.height / 2;
      egg.speedX = -6;
      this.level.thrownObjects.push(egg);
      this.lastBossEggTime = now;
    }
  }

  /**
   * Start the collision-tick loop that checks enemies, items, and thrown objects.
   * @returns {void}
   */
  checkCollisons() {
    this.collisionInterval = setInterval(() => {
      if (!this.character.statusDead) {
        this.collisionEnemie();
        this.collisionCollectable();
        this.checkBottleHitsEnemy();
        this.checkProjectilesHitCharacter();
        this.checkBottleGroundHit();
      }
    }, 50);
  }

  /**
   * Handle hits from enemy projectiles on the player.
   * @returns {void}
   */
  checkProjectilesHitCharacter() {
    const now = Date.now();
    this.level.thrownObjects.forEach((proj) => {
      if (proj.fromPlayer) return;
      if (
        !proj.hasHit &&
        proj.isColliding &&
        proj.isColliding(this.character) &&
        !this.character.isDead(this.character)
      ) {
        this.characterTakeDamageEgg(proj, now);
      }
    });
    this.level.thrownObjects = this.level.thrownObjects.filter((b) => !b.markForRemoval);
  }

  /**
   * Apply damage to the character when an enemy projectile hits.
   * @param {MovableObject} proj - The projectile that hit the character.
   * @param {number} now - Current timestamp for cooldown tracking.
   * @returns {void}
   */
  characterTakeDamageEgg(proj, now) {
    proj.hasHit = true;
    proj.markForRemoval = true;
    if (this.character.HP > 0) {
      this.character.HP -= 40;
      this.character.lastHitTime = now;
      this.character.playAnimation(this.character.IMAGES_HURT);
      this.character.isDead(this.character);
      if (!this.character.isTouchingEnemy) this.character.playSound(this.character);
    }
  }

  /**
   * Stop all active world timers, intervals, and music.
   * @returns {void}
   */
  destroy() {
    this.running = false;
    if (this.collisionInterval) clearInterval(this.collisionInterval);
    if (this.endTimeout) clearTimeout(this.endTimeout);
    if (this.backgroundMusic) this.pauseMusic();
  }

  /**
   * Pause and reset the background music for this world.
   * @returns {void}
   */
  pauseMusic() {
    this.backgroundMusic.pause();
    this.backgroundMusic.currentTime = 0;
    this.backgroundMusic = null;
  }

  /**
   * Check whether the boss is visible inside the current camera view.
   * @returns {boolean} True when the boss is on screen.
   */
  isBossVisible() {
    return this.boss.x + this.boss.width > -this.camera_x && this.boss.x < -this.camera_x + this.canvas.width;
  }

  /**
   * Check enemy collisions against the player and resolve damage or kills.
   * @returns {void}
   */
  collisionEnemie() {
    const now = Date.now();
    this.level.enemies.forEach((enemy) => {
      this.handleEnemyCollision(enemy);
      if (now - this.character.lastHitTime > this.character.invincibilityDuration)
        this.character.isTouchingEnemy = false;
    });
  }

  /**
   * Resolve a single enemy collision with the player.
   * @param {MovableObject} enemy - Enemy currently colliding with the player.
   * @returns {void}
   */
  handleEnemyCollision(enemy) {
    if (!this.character.isColliding(enemy) || this.character.isDead(this.character)) return;
    const characterBottom = this.character.y + this.character.height - 40;
    const isAbove = characterBottom <= enemy.y + enemy.height * 0.5;
    if (isAbove && this.character.speedY > -10) {
      enemy instanceof Boss ? this.characterTakeDamage() : this.killEnemy(enemy);
    } else {
      this.character.isTakingDMG(enemy);
    }
  }

  /**
   * Damage the player when the boss or an enemy touches them from the side.
   * @returns {void}
   */
  characterTakeDamage() {
    this.character.bounce();
    this.character.HP -= 10;
    this.character.isDead(this.character);
  }

  /**
   * Resolve bottle-to-enemy hits, handle splash logic, and remove dead enemies.
   * @returns {void}
   */
  checkBottleHitsEnemy() {
    this.level.thrownObjects.forEach((bottle) => {
      if (!(bottle instanceof Bottle)) return;
      this.level.enemies.forEach((enemy) => {
        if (!bottle.hasHit && bottle.isColliding(enemy)) {
          bottle.hasHit = true;
          enemy.HP -= 25;
          if (typeof bottle.splash === "function" || bottle.y <= 330) bottle.splash();
          else bottle.markForRemoval = true;
        }
      });
    });
    this.level.thrownObjects = this.level.thrownObjects.filter((b) => !b.markForRemoval);
    this.level.enemies = this.level.enemies.filter((e) => !e.isDead());
  }

  /**
   * Trigger a splash animation when a thrown bottle hits the ground.
   * @returns {void}
   */
  checkBottleGroundHit() {
    this.level.thrownObjects.forEach((bottle) => {
      if (bottle.y > 325) bottle.splash();
    });
  }

  /**
   * Handle character pickup of coins and bottles.
   * @returns {void}
   */
  collisionCollectable() {
    this.level.collectable.forEach((collectable) => {
      if (this.character.isColliding(collectable) && !this.character.isDead(this.character)) {
        if (collectable instanceof Coin) this.character.collectedCoins += 1;
        if (collectable instanceof Bottle) this.character.collectedBottles += 1;
        this.level.collectable = this.level.collectable.filter((obj) => obj !== collectable);
      }
    });
  }

  /**
   * Damage an enemy after the player jumps onto it and bounce the player.
   * @param {MovableObject} enemy - The enemy to eliminate or damage.
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
   * Main animation loop for this world. Updates game state and renders the scene.
   * @param {number} timestamp - Current frame timestamp from requestAnimationFrame.
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
   * Trigger the win screen when the boss is defeated.
   * @returns {void}
   */
  checkWinCondition() {
    if (this.boss && this.boss.statusDead && !this.winTriggered) {
      this.winTriggered = true;
      this.endTimeout = setTimeout(() => window.showEndScreen("You win!"), 2000);
    }
  }

  /**
   * Trigger the game-over screen when the player dies after the death animation ends.
   * @returns {void}
   */
  checkGameOver() {
    if (this.character.statusDead && this.character.deathAnimationDone && !this.gameOverTriggered) {
      this.gameOverTriggered = true;
      this.endTimeout = setTimeout(() => window.showEndScreen("Game over"), 2000);
    }
  }

  /**
   * Render the entire game scene for the current frame.
   * @param {number} delta - Delta time since the last frame.
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
   * Draw the player and boss status bars.
   * @returns {void}
   */
  drawStatusBars() {
    this.statusBar.drawStatus(this.ctx);
    if (this.isBossVisible()) this.bossStatusBar.drawStatus(this.ctx);
  }

  /**
   * Draw win/game-over overlays on top of the scene.
   * @returns {void}
   */
  drawOverlays() {
    if (this.character.statusDead && !this.character.deathAnimationDone) {
      this.ctx.drawImage(this.gameOverImage, 0, 0, this.canvas.width, this.canvas.height);
    }
    if (this.boss && this.boss.statusDead)
      this.ctx.drawImage(this.winImage, 0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draw a list of map objects into the canvas.
   * @param {Array<DrawableObject>} objects - Objects to render.
   * @returns {void}
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => this.addMapObject(o));
  }

  /**
   * Draw a single map object, mirroring it if needed.
   * @param {DrawableObject} mo - Object to draw.
   * @returns {void}
   */
  addMapObject(mo) {
    if (!mo || !mo.img || !(mo.img instanceof HTMLImageElement)) return;
    if (mo.otherDirection) this.flipImage(mo);
    else this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
  }

  /**
   * Render a mirrored image for objects facing left.
   * @param {DrawableObject} mo - Object to flip while drawing.
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
}
