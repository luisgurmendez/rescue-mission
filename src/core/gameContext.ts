import { Collisions } from "../controllers/CollisionsController";
import BaseObject from "../objects/baseObject";
import Keyboard from "../utils/keyboard";
import Camera from "./camera";

class GameContext {
  readonly collisions: Collisions;
  readonly isPaused: boolean;
  readonly dt: number;

  // Change objects to a map of baseobject lists, separated by object type.
  // objects = {rockets:[], planets: [], ...}
  // With method all(): BaseObject[]
  readonly objects: BaseObject[];
  readonly pressedKeys: Keyboard;
  readonly canvasRenderingContext: CanvasRenderingContext2D;
  readonly camera: Camera;

  constructor(
    collisions: Collisions,
    dt: number,
    isPaused: boolean,
    objects: BaseObject[],
    pressedKeys: Keyboard,
    canvasRenderingContext: CanvasRenderingContext2D,
    camera: Camera
  ) {
    this.collisions = collisions;
    this.dt = dt;
    this.isPaused = isPaused;
    this.objects = objects;
    this.pressedKeys = pressedKeys;
    this.canvasRenderingContext = canvasRenderingContext;
    this.camera = camera;
  }
}

export default GameContext;