import CollisionsController, { CollisionableObject } from "../controllers/CollisionsController";
import RenderController from "../controllers/RenderController";

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
import Button from "../controls/button";
import SpaceBackground from "../objects/spaceBackground";
import ObjectLifecycleController from "../controllers/ObjectLifecycleController";

class Game {

  private clock: Clock;

  private objects: BaseObject[] = [];
  private pressedKeys: Keyboard = new Keyboard();
  private isPaused: boolean = false;
  private stats: Stats;
  private canvasRenderingContext: CanvasRenderingContext2D;
  private camera: Camera;
  private worldDimensions: Rectangle;

  private collisionController: CollisionsController = new CollisionsController();
  private renderController: RenderController = new RenderController();
  private objectLifecycleController: ObjectLifecycleController = new ObjectLifecycleController();

  constructor() {
    // Inits canvas rendering context
    this.canvasRenderingContext = CanvasGenerator.generateCanvas();
    this.worldDimensions = new Rectangle(10000, 10000);
    const rocket = new Rocket(new Vector(0, 400));
    const button = new Button('Button!', new Vector(80, 50), () => { });
    this.camera = new Camera();
    const background = new SpaceBackground();
    this.clock = new Clock();
    this.pressedKeys = new Keyboard();

    this.stats = new Stats();
    this.stats.showPanel(0);
    // document.body.appendChild(this.stats.dom);

    button.onPress = () => {
      this.camera.follow(rocket); //flyTo(new Vector(0, 0), 1);
    }

    this.objects = [
      background,
      new Planet(new Vector()),
      new Moon(new Vector(0, 200)),
      rocket,
      button,
      this.camera
    ];
    // this.camera.follow(rocket);
  }

  init() {
    window.addEventListener('blur', () => {
      this.pressedKeys.clearPressedKeys();
      // TODO: SHOW PAUSED MODAL
      this.pause();
    });
    window.addEventListener('focus', this.unPause);
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
    this.renderController.render(gameContext);
    this.objects = this.objectLifecycleController.dispose(gameContext.objects);
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
      this.camera,
      this.pause,
      this.unPause
    );
  }
}

export default Game;
