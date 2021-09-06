import { Rectangle } from "../objects/shapes";
import BaseObject from "../objects/baseObject";
import Camera from "./camera";
import SpaceBackground, { StarPool } from "../objects/spaceBackground";
import Rocket from "../objects/rocket/rocket";
import Vector from "../physics/vector";
import Initializable from "../behaviors/initializable";
import Disposable from "../behaviors/disposable";
import GameContext from "./gameContext";
import ObjectLifecycleController from "../controllers/ObjectLifecycleController";
import CollisionsController, { CollisionableObject } from "../controllers/CollisionsController";
import { GameApi } from "./game";
import RenderController from "../controllers/RenderController";
import { isCollisionableObject } from "../mixins/collisionable";
import Keyboard from "./keyboard";
import Stepable from "../behaviors/stepable";
import RocketStatusController from "../controllers/RocketStatusController";
import Renderable from "../behaviors/renderable";
import RenderUtils from "../render/utils";
import { Dimensions } from "./canvas";
import RenderElement from "../render/renderElement";

const pressedKeys = Keyboard.getInstance();
class Level implements Initializable, Disposable {

  objects: BaseObject[] = [];
  camera: Camera;
  worldDimensions: Rectangle;
  rocket: Rocket;
  objective: LevelObjective;
  rocketStatusController: RocketStatusController;
  private objectLifecycleController: ObjectLifecycleController = new ObjectLifecycleController();
  private collisionController: CollisionsController = new CollisionsController();
  private renderController: RenderController = new RenderController();
  private statusController: LevelStatusController;

  shouldInitialize = true;
  shouldDispose = false;

  constructor(objects: BaseObject[], objective: LevelObjective, worldDimensions: Rectangle = new Rectangle(5000, 5000)) {
    const background = new SpaceBackground();
    this.rocket = new Rocket(new Vector());
    const stars = new StarPool(worldDimensions);
    this.objects = [background, stars];
    this.camera = new Camera();
    this.worldDimensions = worldDimensions;
    this.objective = objective;
    this.objects.push(...objects, ...[this.rocket, this.camera]);
    this.rocketStatusController = new RocketStatusController();
    this.statusController = new LevelStatusController(objective);
  }

  update(gameApi: GameApi): void {
    const gameContext = this.generateGameContext(gameApi);
    if (!gameApi.isPaused) {

      this.objectLifecycleController.initialize(gameContext);
      this.objectLifecycleController.step(gameContext);

      // Move this to private fn..
      if (!this.statusController.hasWonOrLost) {
        this.rocketStatusController.step(gameContext);
        this.objective.step(gameContext);
        const status = this.statusController.getStatus(gameContext);
        this.handleLevelEnding(gameApi, status)
      }
      this.objectLifecycleController.dispose(gameContext);
    }

    this.renderController.render(gameContext);
  }

  init() { };

  dispose() { };

  private handleLevelEnding(gameApi: GameApi, status: LevelStatus) {
    // TODO: We should show won/lost dialogs etc....
    if (status !== LevelStatus.PLAYING) {
      if (status === LevelStatus.WON) {
        setTimeout(() => {
          console.log('WONNN')
          gameApi.nextLevel();
        }, 2000);
      }
      if (status === LevelStatus.LOST) {
        console.log('LOST!')
        this.objects.push(new RestartLevelLabelObject())
        console.log(this.objects)
      }

    }
  }

  restart() {
    this.dispose();
    this.init();
  }

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
      api.pause,
      api.unPause
    );
  }

}


export default Level;

export interface LevelObjective extends Stepable {
  completed(): boolean
}



enum LevelStatus {
  WON, LOST, PLAYING
}
class LevelStatusController {

  hasWonOrLost = false;
  objective: LevelObjective;

  constructor(objective: LevelObjective) {
    this.objective = objective
  }

  getStatus(context: GameContext) {
    const { rocket } = context;
    if (this.objective.completed()) {
      this.hasWonOrLost = true
      return LevelStatus.WON;
    }
    // Check if rocket has landed on another planet or if rocket is outOfBounds.
    if (rocket.hasExploded || rocket.hasLanded) {
      this.hasWonOrLost = true
      return LevelStatus.LOST;
    }

    return LevelStatus.PLAYING;
  }
}

class RestartLevelLabelObject extends BaseObject implements Renderable {

  render() {
    const renderFn = (ctx: GameContext) => {
      ctx.canvasRenderingContext.font = '45px Arial';
      ctx.canvasRenderingContext.fillStyle = '#FFF';
      RenderUtils.renderText(ctx.canvasRenderingContext, "Press [r] to restart level", new Vector(Dimensions.w / 2, Dimensions.h - 85));
    }
    const renderEl = new RenderElement(renderFn);
    renderEl.positionType = 'overlay'
    return renderEl;
  }
}