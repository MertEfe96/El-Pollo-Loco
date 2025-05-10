class StatusBar extends DrawableObject {
  HP_BAR_IMAGES = [
    "./img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
    "./img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
    "./img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
    "./img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
    "./img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
    "./img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",
  ];

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

  drawStatus(ctx) {
    let hp = this.character.HP;
    let hpIndex = hp === 100 ? 5 : hp > 79 ? 4 : hp > 59 ? 3 : hp > 39 ? 2 : hp > 19 ? 1 : 0;
    let hpImg = this.imageCache[this.HP_BAR_IMAGES[hpIndex]];

    ctx.drawImage(hpImg, this.x + 10, this.y, 150, 50);

    ctx.drawImage(this.coinImg, this.x + 10, this.y + 50, 30, 30);
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(`${this.character.collectedCoins}`, this.x + 50, this.y + 72);

    ctx.drawImage(this.bottleImg, this.x + 115, this.y + 50, 30, 30);
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(`${this.character.collectedBottles}`, this.x + 150, this.y + 70);
  }
}
