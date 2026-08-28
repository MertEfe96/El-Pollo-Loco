class StatusBar extends DrawableObject {
  HP_BAR_IMAGES = [
    "./img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
    "./img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
    "./img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
    "./img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
    "./img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
    "./img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",
  ];

  /**
   * Create a player status bar that displays HP, coins, and bottles.
   * @param {Character} character - The player character instance.
   */
  constructor(character) {
    super();
    this.character = character;
    this.width = 200;
    this.height = 80;
    this.x = 20;
    this.y = 20;
    this.loadImages(this.HP_BAR_IMAGES);
    this.coinImg = new Image();
    this.coinImg.src = "./img/7_statusbars/3_icons/icon_coin.png";
    this.bottleImg = new Image();
    this.bottleImg.src = "./img/7_statusbars/3_icons/icon_salsa_bottle.png";
  }

  /**
   * Draw the player status bar to the canvas.
   * @param {CanvasRenderingContext2D} ctx - Drawing context.
   * @returns {void}
   */
  drawStatus(ctx) {
    let hp = this.character.HP;
    let hpIndex = hp === 100 ? 5 : hp > 74 ? 4 : hp > 49 ? 3 : hp > 24 ? 2 : hp > 1 ? 1 : 0;
    let hpImg = this.imageCache[this.HP_BAR_IMAGES[hpIndex]];
    ctx.drawImage(hpImg, this.x + 10, this.y, 150, 50);
    ctx.drawImage(this.coinImg, this.x + 10, this.y + 50, 40, 40);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`${this.character.collectedCoins}`, this.x + 50, this.y + 80);
    this.drawThrowCooldown(ctx);
    ctx.drawImage(this.bottleImg, this.x + 115, this.y + 50, 40, 40);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`${this.character.collectedBottles}`, this.x + 160, this.y + 80);
  }

  /**
   * Draw the bottle throw cooldown and its current state.
   * @param {CanvasRenderingContext2D} ctx - The drawing context.
   * @returns {void}
   */
  drawThrowCooldown(ctx) {
    const elapsed = Date.now() - this.character.lastThrowTime;
    const progress = Math.min(elapsed / this.character.throwCooldown, 1);
    const hasBottles = this.character.collectedBottles > 0;
    const isReady = progress >= 1 && hasBottles;
    const centerX = this.x + 134;
    const centerY = this.y + 70;
    const radius = 22;
    this.drawCircle(ctx, centerX, centerY, radius, hasBottles);
    if (hasBottles) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
      ctx.strokeStyle = isReady ? "#4ade80" : "#f59e0b";
      ctx.lineWidth = 4;
      ctx.stroke();
    }
  }

  drawCircle(ctx, centerX, centerY, radius, progress, hasBottles) {
    ctx.beginPath();
    if (!hasBottles) {
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "#d1d5db";
    } else {
      ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
      ctx.strokeStyle = isReady ? "#4ade80" : "#f59e0b";
    }
    ctx.lineWidth = 4;
    ctx.stroke();
  }
}

class BossStatusBar extends DrawableObject {
  BOSS_BAR_IMAGES = [
    "./img/7_statusbars/2_statusbar_endboss/blue.png",
    "./img/7_statusbars/2_statusbar_endboss/green.png",
    "./img/7_statusbars/2_statusbar_endboss/orange.png",
  ];

  /**
   * Create a boss health status bar.
   * @param {Boss} boss - The boss instance to track.
   * @returns {void}
   */
  constructor(boss) {
    super();
    this.boss = boss;
    this.width = 200;
    this.height = 80;
    this.x = 540;
    this.y = 10;
    this.loadImages(this.BOSS_BAR_IMAGES);
  }

  /**
   * Draw the boss health status bar.
   * @param {CanvasRenderingContext2D} ctx - Drawing context.
   * @returns {void}
   */
  drawStatus(ctx) {
    let hp = this.boss.HP;
    let imgIndex;
    if (hp < 21) {
      imgIndex = 2;
    } else if (hp < 41) {
      imgIndex = 1;
    } else {
      imgIndex = 0;
    }
    let img = this.imageCache[this.BOSS_BAR_IMAGES[imgIndex]];
    ctx.drawImage(img, this.x, this.y, this.width, this.height);
  }
}
