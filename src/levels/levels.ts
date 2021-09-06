import Level from "../core/level";
import generateTutorialLevel from "../levels/tutorial";
import generateTutorial2Level from "../levels/tutorial2";
import generateLevel2 from "../levels/level2";

class LevelsController {

  private level: Level;
  private levelIndex: number;
  private levelGenerators: (() => Level)[];

  constructor() {
    this.levelIndex = parseInt(localStorage.getItem('activeLevelIndex') || '0');
    this.levelGenerators = [generateTutorialLevel, generateTutorial2Level, generateLevel2];
    this.level = this.levelGenerators[this.levelIndex]();
    this.saveLevel();
  }

  init() {
    if (this.levelIndex < this.levelGenerators.length) {
      this.level = this.levelGenerators[this.levelIndex]();
      this.level.init();
    }
  }

  next() {
    this.levelIndex++;
    localStorage.setItem('activeLevelIndex', this.levelIndex.toString());
    this.init();
  }

  restart() {
    this.init();
  }

  getLevel() {
    return this.level;
  }

  saveLevel() {
    localStorage.setItem('activeLevelIndex', this.levelIndex.toString());
  }
}

export default LevelsController;


// export function generateLevel1() {
//   const mars = new Planet(new Vector(), 3000, 100)
//   const earth = new Planet(new Vector(200, -400), 2000, 150)
//   const moon = new Planet(new Vector(0, 300), 150, 4);
//   moon.gravitationalThreshold = 0;
//   moon.isMoon = true;
//   moon.velocity = new Vector(30, 0);

//   const objects: BaseObject[] = [
//     mars,
//     earth,
//     moon,
//   ];

//   const level = new Level(objects, new LandingOnTargetPlanetObjective(earth));
//   level.rocket.position = new Vector(350, 300);

//   return level;
// }
