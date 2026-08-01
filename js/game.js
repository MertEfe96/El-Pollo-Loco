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

/**
 * Initialize the game canvas element.
 * @returns {void}
 */
function init() {
  canvas = document.getElementById("canvas");
  initControlToggle();
}

/**
 * Start or restart the current game session.
 * Destroys any existing world and creates a new one.
 * @returns {void}
 */
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

/**
 * Display the start screen overlay.
 * @returns {void}
 */
function showStartScreen() {
  const overlay = document.getElementById("introOutro");
  const startScreen = document.getElementById("start-screen");
  const endScreen = document.getElementById("end-screen");
  overlay.style.display = "flex";
  startScreen.style.display = "block";
  endScreen.style.display = "none";
}

/**
 * Display the end screen overlay with a message.
 * @param {string} message - The message to show to the player.
 * @returns {void}
 */
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

/**
 * Restart the game by destroying the current world and starting again.
 * @returns {void}
 */
function restartGame() {
  if (world) {
    world.destroy();
    world = null;
  }
  startGame();
}

/**
 * Quit the current game and return to the start screen.
 * @returns {void}
 */
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

/**
 * Generate a specific number of coin objects spaced at least a minimum distance apart.
 * @param {number} amount - The number of coins to create.
 * @param {number} minHorizontalDistance - Minimum distance between each coin horizontally.
 * @returns {Coin[]}
 */
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

/**
 * Check whether a new coin is too close to existing coins.
 * @param {Coin[]} coins - Existing coins already generated.
 * @param {Coin} newCoin - The candidate coin to validate.
 * @param {number} minHorizontalDistance - Minimum horizontal spacing.
 * @returns {boolean} True if the candidate is too close to any existing coin.
 */
function coinLoop(coins, newCoin, minHorizontalDistance) {
  for (let existing of coins) {
    const dx = Math.abs(existing.x - existing.width / 2 - (newCoin.x - newCoin.width / 2));
    if (dx < minHorizontalDistance) {
      return true;
    }
  }
  return false;
}

/**
 * Generate a list of enemy chickens plus a boss with horizontal spacing.
 * @param {number} amount - The number of chickens to generate.
 * @param {number} minHorizontalDistance - Minimum distance between each enemy.
 * @returns {(Chicken|Boss)[]}
 */
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

/**
 * Check whether a new enemy is too close to existing enemies.
 * @param {(Chicken|Boss)[]} chickens - The existing enemy collection.
 * @param {Chicken} newChicken - The candidate enemy to validate.
 * @param {number} minHorizontalDistance - Minimum horizontal spacing.
 * @returns {boolean} True if the candidate is too close to any existing enemy.
 */
function chickenLoop(chickens, newChicken, minHorizontalDistance) {
  for (let existing of chickens) {
    const dx = Math.abs(existing.x - existing.width / 2 - (newChicken.x - newChicken.width / 2));
    if (dx < minHorizontalDistance) {
      return true;
    }
  }
  return false;
}

/**
 * Generate a semicircle arc of coins.
 * @param {number} centerX - X coordinate of the arc center.
 * @param {number} centerY - Y coordinate of the arc center.
 * @param {number} radius - Radius of the arc.
 * @param {number} count - Number of coins to place along the arc.
 * @returns {Coin[]}
 */
function generateCoinsInArc(centerX, centerY, radius, count) {
  const coins = [];
  const startAngle = 0;
  const endAngle = -Math.PI;
  const step = (endAngle - startAngle) / (count - 1);
  coinArcLoop(coins, startAngle, endAngle, radius, count, step, centerX, centerY);
  return coins;
}

/**
 * Place coins along an arc and update the provided coin array.
 * @param {Coin[]} coins - Array to append generated coins to.
 * @param {number} startAngle - Starting angle in radians.
 * @param {number} endAngle - Ending angle in radians.
 * @param {number} radius - Radius of the arc.
 * @param {number} count - Number of coins to create.
 * @param {number} step - Angle step between coins.
 * @param {number} centerX - Center X coordinate.
 * @param {number} centerY - Center Y coordinate.
 * @returns {void}
 */
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

/**
 * Mute the game audio and update the volume slider.
 * @returns {void}
 */
function muteGame() {
  const slider = document.getElementById("volumeSlider");
  slider.value = 0;
  if (world) {
    world.setVolume(0);
  }
  checkVolumeLevel(slider, 0);
  localStorage.setItem("Sound", 0);
}

/**
 * Update the volume icon based on current slider value.
 * @param {HTMLInputElement} slider - The volume slider element.
 * @param {number} volume - The current volume.
 * @returns {void}
 */
function checkVolumeLevel(slider, volume) {
  const icon = document.getElementById("volumeIcon");
  if (volume == 0) {
    icon.src = "./img/11_Icons/Volume_Mute_Icon.png";
  } else {
    icon.src = "./img/11_Icons/Volume_Icon.png";
  }
}

/**
 * Show an input element by id.
 * @param {string} id - The element id to show.
 * @returns {void}
 */
function showInput(id) {
  input = document.getElementById(id);
  input.style.display = "block";
}

/**
 * Hide an input element by id.
 * @param {string} id - The element id to hide.
 * @returns {void}
 */
function hideInput(id) {
  input = document.getElementById(id);
  input.style.display = "none";
}

/**
 * Request fullscreen mode for the game canvas.
 * @returns {void}
 */
function fullscreen() {
  canvas.requestFullscreen();
}

// ...Mobile Controls...
// This function sets up mobile controls for the game
// It binds touch events to buttons for left, right, jump, and throw actions

/**
 * Configure mobile touch controls for game buttons.
 * @returns {void}
 */
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

/**
 * Toggle the in-canvas mobile control overlay on demand.
 * @returns {void}
 */
function initControlToggle() {
  const toggleButton = document.getElementById("controlModeToggle");
  const mobileControls = document.getElementById("mobile-controls");

  if (!toggleButton || !mobileControls) return;

  const updateToggle = () => {
    const isMobileView = document.body.classList.contains("controls-mobile");
    mobileControls.classList.toggle("show", isMobileView);
    toggleButton.textContent = isMobileView ? "Switch to PC" : "Switch to Mobile";
    toggleButton.setAttribute("aria-pressed", isMobileView ? "true" : "false");
  };

  toggleButton.addEventListener("click", () => {
    document.body.classList.toggle("controls-mobile");
    updateToggle();
  });

  updateToggle();
}

/**
 * Load saved volume settings from local storage and apply them.
 * @returns {void}
 */
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
