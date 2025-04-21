class Boss extends MovableObject {
  IMAGES_ALERT_BOSS = [
    "./img/4_enemie_boss_chicken/2_alert/G5.png",
    "./img/4_enemie_boss_chicken/2_alert/G6.png",
    "./img/4_enemie_boss_chicken/2_alert/G7.png",
    "./img/4_enemie_boss_chicken/2_alert/G8.png",
    "./img/4_enemie_boss_chicken/2_alert/G9.png",
    "./img/4_enemie_boss_chicken/2_alert/G10.png",
    "./img/4_enemie_boss_chicken/2_alert/G11.png",
    "./img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  constructor() {
    super().loadImage("./img/4_enemie_boss_chicken/2_alert/G5.png");
    this.x = 2500;
    this.height = 280;
    this.width = 280;
    this.y = 160;

    this.loadImages(this.IMAGES_ALERT_BOSS);
    this.animate(this.IMAGES_ALERT_BOSS);
  }

  animate(arr) {
    setInterval(() => {
      this.playAnimation(arr);
    }, 1000 / 4);
  }
}
