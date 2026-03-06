let canvas;
let world;
let keyboard = new Keyboard();
const kb = {
  pressed: {},
  key: {},
  code: {},
};
const controls = [
  {id: "btn-left", key: "KeyA"},
  {id: "btn-right", key: "KeyD"},
  {id: "btn-jump", key: "Space"},
  {id: "btn-throw", key: "KeyE"},
];

function init() {
  canvas = document.getElementById("canvas");
}

function startGame() {
  initLevel();
  world = new World(canvas, keyboard);
  document.querySelector(".introOutro").style.display = "none";
}

window.addEventListener("keydown", (event) => {
  const key = event.code;
  kb.pressed[key] = true;
  keyboard.action(key);
  updateKeyStatus();
});

window.addEventListener("keyup", (event) => {
  const key = event.code;
  kb.pressed[key] = false;
  keyboard.release(key);
  updateKeyStatus();
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

function generateChickens(amount, minHorizontalDistance) {
  const chickens = [];
  const boss = new Boss();
  while (chickens.length < amount) {
    const newChicken = new Chicken();
    let tooClose = false;
    for (let existing of chickens) {
      const dx = Math.abs(existing.x - existing.width / 2 - (newChicken.x - newChicken.width / 2));
      if (dx < minHorizontalDistance) {
        tooClose = true;
        break;
      }
    }
    if (!tooClose) {
      chickens.push(newChicken);
    }
  }
  chickens.push(boss);
  return chickens;
}

function generateCoinsInArc(centerX, centerY, radius, count) {
  const coins = [];
  const startAngle = 0;
  const endAngle = -Math.PI;
  const step = (endAngle - startAngle) / (count - 1);
  for (let i = 0; i < count; i++) {
    const angle = startAngle + i * step;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    const coin = new Coin();
    coin.x = x;
    coin.y = y;
    coin.baseY = y;
    coins.push(coin);
  }
  return coins;
}

function updateKeyStatus() {
  const pressedKeys = Object.keys(kb.pressed)
    .filter((key) => kb.pressed[key])
    .join(", ");
  document.getElementById("key-status").textContent = pressedKeys || "---";
}

window.addEventListener("input", () => {
  const slider = document.getElementById("volumeSlider");
  const volume = parseFloat(slider.value);
  if (world) {
    world.setVolume(volume);
  }
  checkVolumeLevel(slider, volume);
});

function muteGame() {
  const slider = document.getElementById("volumeSlider");
  slider.value = 0;
  if (world) {
    world.setVolume(0);
  }
  checkVolumeLevel(slider, 0);
}

function checkVolumeLevel(slider, volume) {
  const icon = document.getElementById("volumeIcon");
  if (volume == 0) {
    icon.src = "./img/11_Icons/Volume_Mute_Icon.png";
  } else {
    icon.src = "./img/11_Icons/Volume_Icon.png";
  }
}

function showInput(id) {
  input = document.getElementById(id);
  input.style.display = "block";
}

function hideInput(id) {
  input = document.getElementById(id);
  input.style.display = "none";
}

function fullscreen() {
  canvas.requestFullscreen();
}

// ...Mobile Controls...
// This function sets up mobile controls for the game
// It binds touch events to buttons for left, right, jump, and throw actions

function setMobileControls() {
  controls.forEach(({id, key}) => {
    const btn = document.getElementById(id);
    btn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      keyboard.action(key);
      updateKeyStatus();
    });
    btn.addEventListener("touchend", (e) => {
      e.preventDefault();
      keyboard.release(key);
      updateKeyStatus();
    });
  });
}

window.addEventListener("DOMContentLoaded", setMobileControls);
