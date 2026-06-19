class DrawableObject {
  x = 100;
  y = 270;
  height = 150;
  width = 100;
  img;
  imageCache = {};
  currentImage = 0;

  /**
   * Load a single image and assign it to the object.
   * @param {string} path - Image source path.
   * @returns {void}
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Preload an array of image paths into the object cache.
   * @param {string[]} arr - Image source paths.
   * @returns {void}
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Clear the cached images for this object.
   * @returns {void}
   */
  clearImageCache() {
    this.imageCache = {};
  }
}
