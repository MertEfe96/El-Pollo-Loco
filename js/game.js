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
  if (world) {
    world.destroy();
    world = null;
  }
  initLevel();
  world = new World(canvas, keyboard);
  document.querySelector(".introOutro").style.display = "none";
  getVolumeFromStorage();
}

function showStartScreen() {
  const overlay = document.getElementById("introOutro");
  const startScreen = document.getElementById("start-screen");
  const endScreen = document.getElementById("end-screen");
  overlay.style.display = "flex";
  startScreen.style.display = "block";
  endScreen.style.display = "none";
}

function showEndScreen(message) {
  const overlay = document.getElementById("introOutro");
  const startScreen = document.getElementById("start-screen");
  const endScreen = document.getElementById("end-screen");
  const endMessage = document.getElementById("endMessage");
  overlay.style.display = "flex";
  startScreen.style.display = "none";
  endScreen.style.display = "block";
  endMessage.textContent = message;
}

function restartGame() {
  if (world) {
    world.destroy();
    world = null;
  }
  startGame();
}

function quitGame() {
  if (world) {
    world.destroy();
    world = null;
  }
  showStartScreen();
}

window.addEventListener("keydown", (event) => {
  const key = event.code;
  kb.pressed[key] = true;
  keyboard.action(key);
  // updateKeyStatus();
});

window.addEventListener("keyup", (event) => {
  const key = event.code;
  kb.pressed[key] = false;
  keyboard.release(key);
  // updateKeyStatus();
});

function generateCoins(amount, minHorizontalDistance) {
  const coins = [];
  while (coins.length < amount) {
    const newCoin = new Coin();
    const tooClose = coinLoop(coins, newCoin, minHorizontalDistance);
    if (!tooClose) {
      coins.push(newCoin);
    }
  }
  return coins;
}

function coinLoop(coins, newCoin, minHorizontalDistance) {
  for (let existing of coins) {
    const dx = Math.abs(existing.x - existing.width / 2 - (newCoin.x - newCoin.width / 2));
    if (dx < minHorizontalDistance) {
      return true;
    }
  }
  return false;
}

function generateChickens(amount, minHorizontalDistance) {
  const chickens = [];
  const boss = new Boss();
  while (chickens.length < amount) {
    const newChicken = new Chicken();
    const tooClose = chickenLoop(chickens, newChicken, minHorizontalDistance);
    if (!tooClose) {
      chickens.push(newChicken);
    }
  }
  chickens.push(boss);
  return chickens;
}

function chickenLoop(chickens, newChicken, minHorizontalDistance) {
  for (let existing of chickens) {
    const dx = Math.abs(existing.x - existing.width / 2 - (newChicken.x - newChicken.width / 2));
    if (dx < minHorizontalDistance) {
      return true;
    }
  }
  return false;
}

function generateCoinsInArc(centerX, centerY, radius, count) {
  const coins = [];
  const startAngle = 0;
  const endAngle = -Math.PI;
  const step = (endAngle - startAngle) / (count - 1);
  coinArcLoop(coins, startAngle, endAngle, radius, count, step, centerX, centerY);
  return coins;
}

function coinArcLoop(coins, startAngle, endAngle, radius, count, step, centerX, centerY) {
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
}

// function updateKeyStatus() {
//   const pressedKeys = Object.keys(kb.pressed)
//     .filter((key) => kb.pressed[key])
//     .join(", ");
//   document.getElementById("key-status").textContent = pressedKeys || "---";
// }

window.addEventListener("input", () => {
  const slider = document.getElementById("volumeSlider");
  const volume = parseFloat(slider.value);
  if (world) {
    localStorage.setItem("Sound", volume);
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
  localStorage.setItem("Sound", 0);
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

function getVolumeFromStorage() {
  const soundSetting = localStorage.getItem("Sound");
  if (soundSetting !== null) {
    const slider = document.getElementById("volumeSlider");
    slider.value = soundSetting;
    if (world) {
      world.setVolume(parseFloat(soundSetting));
    }
    checkVolumeLevel(slider, parseFloat(soundSetting));
  }
}
