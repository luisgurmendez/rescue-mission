import { Rectangle } from "../objects/shapes";
import BaseObject from "../objects/baseObject";
import Camera from "./camera";
import SpaceBackground from "../objects/spaceBackground";
import Rocket from "../objects/rocket/rocket";
import Vector from "../physics/vector";
import Planet from "../objects/planet/planet";
import Initializable from "../behaviors/initializable";
import Disposable from "../behaviors/disposable";
import GameConditionsController, { WinningCondition } from "../controllers/GameConditionsController";
import GameContext from "./gameContext";
import ObjectLifecycleController from "../controllers/ObjectLifecycleController";
import CollisionsController, { CollisionableObject } from "../controllers/CollisionsController";
import { GameApi } from "./game";
import RenderController from "../controllers/RenderController";
import { isCollisionableObject } from "../mixins/collisionable";
import Keyboard from "./keyboard";

const pressedKeys = Keyboard.getInstance();
class Level implements Initializable, Disposable {

  objects: BaseObject[] = [];
  camera: Camera;
  worldDimensions: Rectangle;
  rocket: Rocket;
  targetPlanet: Planet;
  extraWinningCondition: WinningCondition | null;
  private objectLifecycleController: ObjectLifecycleController = new ObjectLifecycleController();
  private gameConditionsController: GameConditionsController = new GameConditionsController();
  private collisionController: CollisionsController = new CollisionsController();
  private renderController: RenderController = new RenderController();

  shouldInitialize = true;
  shouldDispose = false;

  constructor(objects: BaseObject[], target: Planet, worldDimensions: Rectangle = new Rectangle(100000, 100000),) {
    const background = new SpaceBackground();
    this.rocket = new Rocket(new Vector());
    this.objects = objects;
    this.camera = new Camera();
    this.worldDimensions = worldDimensions;
    this.targetPlanet = target;
    this.extraWinningCondition = null;
    this.objects.push(...[background, this.rocket, this.camera]);
    // this.camera.follow(this.rocket);
  }
  update(gameApi: GameApi): void {
    const gameContext = this.generateGameContext(gameApi);
    this.extraWinningCondition?.step(gameContext);
    this.objectLifecycleController.initialize(gameContext);
    this.objectLifecycleController.step(gameContext);
    this.gameConditionsController.step(gameContext);
    this.objectLifecycleController.dispose(gameContext);
    this.renderController.render(gameContext);
  }

  init() { };

  dispose() { };


  private generateGameContext(api: GameApi): GameContext {
    const collisionableObjects: CollisionableObject[] = this.objects.filter(isCollisionableObject) as CollisionableObject[];
    const collisions = this.collisionController.getCollisions(collisionableObjects);

    return new GameContext(
      collisions,
      api.dt,
      api.isPaused,
      this.objects,
      pressedKeys,
      api.canvasRenderingContext,
      this.camera,
      this.worldDimensions,
      this.rocket,
      this.targetPlanet,
      this.extraWinningCondition,
      api.pause,
      api.unPause
    );
  }

}


export default Level;