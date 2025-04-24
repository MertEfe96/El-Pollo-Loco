class Keyboard {
  LEFT = false;
  RIGHT = false;
  UP = false;
  DOWN = false;
  SPACE = false;
  pressedKeys = new Set();
  keyMap = {
    Space: "SPACE",
    KeyD: "RIGHT",
    KeyA: "LEFT",
    KeyS: "DOWN",
    KeyW: "UP",
  };

  action(key) {
    const direction = this.keyMap[key];
    if (direction) {
      this.pressedKeys.add(direction);
      this[direction] = true;
    }
  }

  release(key) {
    const direction = this.keyMap[key];
    if (direction) {
      this.pressedKeys.delete(direction);
      this[direction] = false;
    }
  }
}
