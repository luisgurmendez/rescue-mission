import { Collisions } from "../controllers/CollisionsController";
import BaseObject from "../objects/baseObject";
import Keyboard from "../utils/keyboard";
import Clock from "./clock";

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

  constructor(
    collisions: Collisions,
    dt: number,
    isPaused: boolean,
    objects: BaseObject[],
    pressedKeys: Keyboard,
    canvasRenderingContext: CanvasRenderingContext2D
  ) {
    this.collisions = collisions;
    this.dt = dt;
    this.isPaused = isPaused;
    this.objects = objects;
    this.pressedKeys = pressedKeys;
    this.canvasRenderingContext = canvasRenderingContext;
  }
}

export default GameContext;