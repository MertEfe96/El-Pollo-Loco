let canvas;
let world;
let keyboard = new Keyboard();

function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);

  console.log("My Character is", world.character);
}

window.addEventListener("keydown", (event) => {
  const key = event.code;
  keyboard.action(key);
});

window.addEventListener("keyup", (event) => {
  const key = event.code;
  keyboard.release(key);
});

function generateCoins(amount, minHorizontalDistance) {
  const coins = [];

  while (coins.length < amount) {
    const newCoin = new Coin();
    let tooClose = false;

    for (let existing of coins) {
      const dx = Math.abs(existing.x - existing.width / 2 - (newCoin.x - newCoin.width / 2));
      if (dx < minHorizontalDistance) {
        tooClose = true;
        break;
      }
    }

    if (!tooClose) {
      coins.push(newCoin);
    }
  }

  return coins;
}

function generateCoinsInArc(centerX, centerY, radius, count) {
  const coins = [];
  const startAngle = 0; // 180° in Bogenmaß
  const endAngle = -Math.PI; // 0° in Bogenmaß
  const step = (endAngle - startAngle) / (count - 1); // Gleichmäßiger Abstand

  for (let i = 0; i < count; i++) {
    const angle = startAngle + i * step;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    const coin = new Coin();
    coin.x = x;
    coin.y = y;
    coin.baseY = y; // Für float()

    coins.push(coin);
  }

  return coins;
}
