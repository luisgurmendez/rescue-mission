import Keyboard from "./keyboard";
import Clock from "./clock";
import Stats from 'stats.js'
import CanvasGenerator from "./canvas";
import { generateTutorialLevel } from "../levels/levels";
import Level from "./level";

// TODO: implement r to restart
// TODO: implement p to pause/unpause

const pressedKeys = Keyboard.getInstance();

class Game {

  private clock: Clock;
  private isPaused: boolean = false;
  private stats: Stats;
  private canvasRenderingContext: CanvasRenderingContext2D;

  private level: Level;
  private gameSpeed: number = 1;

  constructor() {
    // Inits canvas rendering context
    this.canvasRenderingContext = CanvasGenerator.generateCanvas();
    this.level = generateTutorialLevel();
    this.clock = new Clock();

    this.stats = new Stats();
    this.stats.showPanel(0);
    document.body.appendChild(this.stats.dom);
  }

  init() {
    this.level.init();
    window.addEventListener('blur', () => {
      pressedKeys.clearPressedKeys();
      this.pause();
    });
    window.addEventListener('focus', this.unPause);

    // TODO: experimental game speed change
    window.addEventListener('keydown', (e) => {
      if (e.key === 'm') {
        this.gameSpeed += 1;
      }

      if (e.key === 'n') {
        this.gameSpeed -= 1;
      }
    })

    // Follow rocket on space
    window.addEventListener('keydown', (e) => {
      if (e.key === ' ') {
        this.level.camera.follow(this.level.rocket);
      }
    })

    window.addEventListener('keydown', (e) => {
      if (e.key === 'p') {
        if (this.isPaused) {
          this.unPause()
        } else {
          this.pause()
        }
      }
    })
  }

  unPause = () => {
    this.isPaused = false;
    this.clock.start();
  }

  pause = () => {
    this.isPaused = true;
    this.clock.stop();
  }

  loop = (externalUpdate?: () => void) => {
    return () => {
      this.stats.begin()
      externalUpdate && externalUpdate();
      if (!this.isPaused) {
        this.update();
      }
      requestAnimationFrame(this.loop(externalUpdate));
      this.afterUpdate()
    }
  }

  /**
   * TODO: Remove GameApi completely!
   */
  private update() {
    const gameApi = this.generateGameApi();
    this.level.update(gameApi);
  }

  private afterUpdate() {
    this.stats.end()
  }

  private generateGameApi(): GameApi {
    const dt = this.clock.getDelta() * this.gameSpeed;
    return new GameApi(dt, this.canvasRenderingContext, this.isPaused, this.pause, this.unPause);
  }
}

export default Game;


export class GameApi {

  readonly canvasRenderingContext: CanvasRenderingContext2D;
  readonly dt: number;

  readonly isPaused: boolean;
  pause: () => void;
  unPause: () => void;

  constructor(
    dt: number,
    canvasRenderingContext: CanvasRenderingContext2D,
    isPaused: boolean,
    pause: () => void,
    unPause: () => void
  ) {
    this.dt = dt;
    this.canvasRenderingContext = canvasRenderingContext;
    this.isPaused = isPaused;
    this.pause = pause;
    this.unPause = unPause;
  }
}