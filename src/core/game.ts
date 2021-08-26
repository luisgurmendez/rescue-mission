import CollisionsController, { CollisionableObject } from "../controllers/CollisionsController";
import RenderController from "../controllers/RenderController";
import StepController from "../controllers/StepController";

import BaseObject from "../objects/baseObject";
import Rocket from "../objects/rocket/rocket";
import Vector from "../physics/vector";
import Keyboard from "../utils/keyboard";
import Clock from "./clock";
import GameContext from "./gameContext";
import Stats from 'stats.js'
import Planet from "../objects/planet/planet";
import CanvasGenerator from "./canvas";
import Camera from "./camera";
import { Rectangle } from "../objects/shapes";
import Moon from "../objects/planet/moon";
import { isCollisionableObject } from "../mixins/collisionable";

class Game {

  private clock: Clock;

  private objects: BaseObject[] = [];
  private pressedKeys: Keyboard = new Keyboard();
  private isPaused: boolean = true;
  private stats: Stats;
  private canvasRenderingContext: CanvasRenderingContext2D;
  private camera: Camera;
  private worldDimensions: Rectangle;

  private collisionController: CollisionsController = new CollisionsController();
  private renderController: RenderController = new RenderController();
  private stepController: StepController = new StepController();

  constructor() {
    // Inits canvas rendering context
    this.canvasRenderingContext = CanvasGenerator.generateCanvas();
    this.worldDimensions = new Rectangle(10000, 10000);
    const rocket = new Rocket(new Vector(0, 500));
    console.log(rocket);
    this.objects = [
      new Planet(new Vector()),
      new Moon(new Vector(0, 200)),
      rocket,
    ];
    this.clock = new Clock();
    this.pressedKeys = new Keyboard();
    this.camera = new Camera();

    this.stats = new Stats();
    this.stats.showPanel(0);
    document.body.appendChild(this.stats.dom);

    this.camera.init(this.canvasRenderingContext);
    this.camera.follow(rocket);
  }

  start() {
    this.isPaused = false;
    this.clock.start();
  }

  stop() {
    this.isPaused = true;
    this.clock.stop();
  }

  loop = (externalUpdate?: () => void) => {
    return () => {
      this.stats.begin()
      externalUpdate && externalUpdate();
      this.update();
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
    this.camera.step(gameContext);
    this.stepController.step(gameContext);
    this.renderController.render(gameContext);
  }

  private afterUpdate() {
    this.stats.end()
  }

  private generateGameContext(): GameContext {
    const collisionableObjects: CollisionableObject[] = this.objects.filter(isCollisionableObject) as CollisionableObject[];
    const collisions = this.collisionController.getCollisions(collisionableObjects);
    const dt = this.clock.getDelta();
    return new GameContext(
      collisions,
      dt,
      this.isPaused,
      this.objects,
      this.pressedKeys,
      this.canvasRenderingContext,
      this.camera
    );
  }
}

export default Game;
