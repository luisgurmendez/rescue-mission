import GameObject from "../objects/gameObject";
import { Rectangle } from "../objects/shapes";
import Stepable from "../objects/Stepable";
import Vector from "../physics/vector";
import GameContext from "./gameContext";

const MAX_ZOOM = 5;
const MIN_ZOOM = 0.5;

class Camera implements Stepable {

  position: Vector;
  viewport: Rectangle;
  private _zoom: number;
  following: GameObject | null;

  constructor() {
    this.position = new Vector(document.body.scrollWidth / 2, document.body.scrollHeight / 2);
    this.viewport = new Rectangle(document.body.scrollWidth, document.body.scrollHeight);
    this._zoom = 1;
    this.following = null;
  }

  init(context: CanvasRenderingContext2D) {
    const canvas = context.canvas;

    let startDragOffset = new Vector();
    let mouseDown = false;

    // add event listeners to handle screen drag
    canvas.addEventListener("mousedown", (evt) => {
      mouseDown = true;
      startDragOffset.x = evt.clientX - this.position.x;
      startDragOffset.y = evt.clientY - this.position.y;
    });

    canvas.addEventListener("mouseup", (evt) => {
      mouseDown = false;
    });

    canvas.addEventListener("mouseover", (evt) => {
      mouseDown = false;
    });

    canvas.addEventListener("mouseout", (evt) => {
      mouseDown = false;
    });

    canvas.addEventListener("mousemove", (evt) => {
      if (mouseDown) {
        this.unfollow();
        this.position.x = evt.clientX - startDragOffset.x;
        this.position.y = evt.clientY - startDragOffset.y;
      }
    });

    canvas.onwheel = (event) => {
      event.preventDefault();
      const mousex = event.clientX - canvas.offsetLeft
      const mousey = event.clientY - canvas.offsetTop

      const wheel = event.deltaY < 0 ? 1 : -1;

      const deltaZoom = Math.exp(wheel * 0.02);

      const oldZoom = this.zoom;
      this.zoom = this.zoom * deltaZoom;

      // Only change positions if there was some actual zooming
      if (oldZoom !== this.zoom) {

        this.position.x += mousex / (this.zoom * deltaZoom) - mousex / this.zoom;
        this.position.y += mousey / (this.zoom * deltaZoom) - mousey / this.zoom;
      }
    }
  }


  follow(obj: GameObject) {
    this.following = obj;
  }

  unfollow() {
    this.following = null;
  }

  zoomIn() {
    this.zoom += 0.5;
  }

  zoomOut() {
    this.zoom -= 0.5;
  }

  set zoom(_z: number) {
    this._zoom = _z;
    if (_z > MAX_ZOOM) {
      this._zoom = MAX_ZOOM;
    }

    if (_z < MIN_ZOOM) {
      this._zoom = MIN_ZOOM;
    }
  }

  get zoom() {
    return this._zoom;
  }

  // TODO: following with zoom != 1 is buggy, dobule check
  step(context: GameContext) {
    const canvas = context.canvasRenderingContext.canvas;
    if (this.following !== null) {
      this.position = this.following.position.clone().scalar(-1).add(new Vector(canvas.width / 2, canvas.height / 2)).scalar(1 / this.zoom);
    }
    // TODO: Dont let the camera go beyond world's boundaries.
  }

}

export default Camera;