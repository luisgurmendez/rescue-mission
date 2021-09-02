import CollisionsController, { CollisionableObject } from "../controllers/CollisionsController";
import RenderController from "../controllers/RenderController";

import Keyboard from "../utils/keyboard";
import Clock from "./clock";
import GameContext from "./gameContext";
import Stats from 'stats.js'
import CanvasGenerator from "./canvas";
import { isCollisionableObject } from "../mixins/collisionable";
import ObjectLifecycleController from "../controllers/ObjectLifecycleController";
import { generateTutorialLevel } from "../levels/levels";
import Level from "./level";
import GameConditionsController from "../controllers/GameConditionsController";

//TODO: implement r to restart
//TODO: implement p to pause/unpause
//TODO: implement gmae over when out of world bounds
// TODO: Should the win case be landing on a planet or just touching it?

class Game {

  private clock: Clock;

  private pressedKeys: Keyboard = new Keyboard();
  private isPaused: boolean = false;
  private stats: Stats;
  private canvasRenderingContext: CanvasRenderingContext2D;

  private collisionController: CollisionsController = new CollisionsController();
  private renderController: RenderController = new RenderController();
  private objectLifecycleController: ObjectLifecycleController = new ObjectLifecycleController();
  private gameConditionsController: GameConditionsController = new GameConditionsController();
  private level: Level;
  private gameSpeed: number = 1;

  constructor() {
    // Inits canvas rendering context
    this.canvasRenderingContext = CanvasGenerator.generateCanvas();
    this.level = generateTutorialLevel();
    this.clock = new Clock();
    this.pressedKeys = new Keyboard();

    this.stats = new Stats();
    this.stats.showPanel(0);
    document.body.appendChild(this.stats.dom);
  }

  init() {
    window.addEventListener('blur', () => {
      this.pressedKeys.clearPressedKeys();
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
   * Here we should make a game step. This means all objects should update their state (position, values, etc)
   * Also we should re render the screen
   */
  private update() {
    const gameContext = this.generateGameContext();
    this.objectLifecycleController.initialize(gameContext);
    this.objectLifecycleController.step(gameContext);
    this.gameConditionsController.step(gameContext);
    this.renderController.render(gameContext);
    this.objectLifecycleController.dispose(gameContext);
  }

  private afterUpdate() {
    this.stats.end()
  }

  private generateGameContext(): GameContext {
    const collisionableObjects: CollisionableObject[] = this.level.objects.filter(isCollisionableObject) as CollisionableObject[];
    const collisions = this.collisionController.getCollisions(collisionableObjects);

    const dt = this.clock.getDelta() * this.gameSpeed;
    return new GameContext(
      collisions,
      dt,
      this.isPaused,
      this.level.objects,
      this.pressedKeys,
      this.canvasRenderingContext,
      this.level.camera,
      this.level.worldDimensions,
      this.level.rocket,
      this.level.targetPlanet,
      this.pause,
      this.unPause
    );
  }
}

export default Game;
