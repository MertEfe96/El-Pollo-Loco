let arc1 = generateCoinsInArc(500, 250, 100, 5);
let arc2 = generateCoinsInArc(1200, 200, 80, 5);
let arc3 = generateCoinsInArc(1800, 220, 120, 5);
let bottleArr = [new Bottle(), new Bottle(), new Bottle(), new Bottle(), new Bottle()];
const allCollectables = arc1.concat(arc2, arc3, bottleArr);
const start = -749;
const diff = 749;
const backgroundMap = [
  [
    "img/5_background/layers/air.png",
    "img/5_background/layers/3_third_layer/2.png",
    "img/5_background/layers/2_second_layer/2.png",
    "img/5_background/layers/1_first_layer/2.png",
  ],
  [
    "img/5_background/layers/air.png",
    "img/5_background/layers/3_third_layer/1.png",
    "img/5_background/layers/2_second_layer/1.png",
    "img/5_background/layers/1_first_layer/1.png",
  ],
];

const buildBg = () => {
  let bgArray = [];
  for (let i = 0; i < 5; i++) {
    const bg = backgroundMap[i % 2].map((bg) => new Background(bg, start + i * diff));
    bgArray = bgArray.concat(bg);
  }
  return bgArray;
};

const level1 = new Level(
  [
    new Chicken(),
    // new Chicken(),
    // new Chicken(),
    // new Chicken(),
    // new Chicken(),
    // new Chicken(),
    // new Chicken(),
    // new Chicken(),
    // new Chicken(),
    new Boss(),
  ],
  [new Cloud(), new Cloud(), new Cloud(), new Cloud()],
  buildBg(),
  allCollectables
);
