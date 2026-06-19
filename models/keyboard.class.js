class Keyboard {
  LEFT = false;
  RIGHT = false;
  UP = false;
  DOWN = false;
  SPACE = false;
  THROW = false;
  pressedKeys = new Set();
  keyMap = {
    Space: "SPACE",
    KeyD: "RIGHT",
    KeyA: "LEFT",
    KeyS: "DOWN",
    KeyW: "UP",
    KeyE: "THROW",
  };

  /**
   * Mark a keyboard key as pressed and update the corresponding direction state.
   * @param {string} key - The event code of the pressed key.
   * @returns {void}
   */
  action(key) {
    const direction = this.keyMap[key];
    if (direction) {
      this.pressedKeys.add(direction);
      this[direction] = true;
    }
  }

  /**
   * Release a keyboard key and update the corresponding direction state.
   * @param {string} key - The event code of the released key.
   * @returns {void}
   */
  release(key) {
    const direction = this.keyMap[key];
    if (direction) {
      this.pressedKeys.delete(direction);
      this[direction] = false;
    }
  }
}
