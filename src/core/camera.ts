import GameObject from "../objects/gameObject";
import { Rectangle } from "../objects/shapes";
import Stepable from "../objects/Stepable";
import Vector from "../physics/vector";
import GameContext from "./gameContext";

const MAX_ZOOM = 20;
const MIN_ZOOM = 1;

class Camera implements Stepable {

  position: Vector;
  viewport: Rectangle;
  zoom: number;
  following: GameObject | null;

  constructor() {
    this.position = new Vector();
    this.viewport = new Rectangle(500, 500);
    this.zoom = 0;
    this.following = null;
  }

  follow(obj: GameObject) {
    this.following = obj;
  }

  unfollow() {
    this.following = null;
  }

  zoomIn() {
    this.zoom += 0.5;
    if (this.zoom > MAX_ZOOM) {
      this.zoom = MAX_ZOOM
    }
  }

  zoomOut() {
    this.zoom -= 0.5;
    if (this.zoom < MIN_ZOOM) {
      this.zoom = MIN_ZOOM
    }
  }

  step(context: GameContext) {
    if (this.following !== null) {
      this.position = this.following.position.clone()
    }
    // TODO: Dont let the camera go beyond world's boundaries.
  }

}

export default Camera;