class Keyboard {
  LEFT = false;
  RIGHT = false;
  UP = false;
  DOWN = false;
  SPACE = false;
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
      for (const dir of Object.values(this.keyMap)) {
        this[dir] = dir === direction;
      }
    }
  }

  release(key) {
    const direction = this.keyMap[key];
    if (direction) {
      this[direction] = false;
    }
  }
}
