import Level from "../core/level";
import generateTutorialLevel from "../levels/tutorial";
import generateTutorial2Level from "../levels/tutorial2";
import generateLevel1 from "../levels/level1";
import generateLevel2 from "../levels/level2";
import generateBig from '../levels/superBig';
class LevelsController {

  private level: Level;
  private levelIndex: number;
  private levelGenerators: (() => Level)[];

  constructor() {
    this.levelIndex = this.getReachedLevel();
    this.levelGenerators = [generateTutorialLevel, generateTutorial2Level, generateLevel1, generateBig];
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
    this.saveLevel();
    this.init();
  }

  restart() {
    this.init();
  }

  getLevel() {
    return this.level;
  }

  getNumOfLevels() {
    return this.levelGenerators.length;
  }

  getReachedLevel() {
    return parseInt(localStorage.getItem('reachedLevel') || '0');
  }

  saveLevel() {
    localStorage.setItem('reachedLevel', this.levelIndex.toString());
  }

  goToLevel(i: number) {
    this.levelIndex = i;
    this.init();
  }
}

export default LevelsController;
