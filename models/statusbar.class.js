class StatusBar {
  constructor(character) {
    this.character = character;
    this.width = 200;
    this.height = 80;
    this.x = 20;
    this.y = 20;

    this.heartImg = new Image();
    this.heartImg.src = "./img/7_statusbars/3_icons/icon_health.png";

    this.coinImg = new Image();
    this.coinImg.src = "./img/7_statusbars/3_icons/icon_coin.png";

    this.bottleImg = new Image();
    this.bottleImg.src = "./img/7_statusbars/3_icons/icon_salsa_bottle.png";
  }

  drawStatus(ctx) {
    ctx.fillStyle = "rgba(0, 0, 0, 0)";
    ctx.fillRect(this.x, this.y, 220, 100);

    // Herz (HP)
    ctx.drawImage(this.heartImg, this.x + 10, this.y + 4, 30, 30);
    this.drawHealthBar(ctx, this.x + 50, this.y + 15);

    // Coin
    ctx.drawImage(this.coinImg, this.x + 10, this.y + 50, 30, 30);
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(`${this.character.collectedCoins}`, this.x + 50, this.y + 72);

    // Bottle
    ctx.drawImage(this.bottleImg, this.x + 120, this.y + 50, 30, 30);
    this.drawBottleBar(ctx, this.x + 160, this.y + 58);
  }

  drawHealthBar(ctx, x, y) {
    // Hintergrund Balken (Grau)
    ctx.fillStyle = "grey";
    ctx.fillRect(x, y, 150, 10);

    // Aktueller HP Balken (Grün oder Rot je nach HP)
    ctx.fillStyle = this.character.HP > 25 ? "green" : "red";
    ctx.fillRect(x, y, (this.character.HP / 100) * 150, 10);
  }

  drawBottleBar(ctx, x, y) {
    const maxBottles = 5;
    const collected = Math.min(this.character.collectedBottles, maxBottles);

    ctx.fillStyle = "grey";
    ctx.fillRect(x, y, 50, 10);

    ctx.fillStyle = "blue";
    ctx.fillRect(x, y, (collected / maxBottles) * 50, 10);
  }
}
