import { Disposable } from "../behaviors/disposable";
import BaseObject from "../objects/baseObject";
import RenderElement from "../render/renderElement";
import Renderable from "../behaviors/renderable";
import Stepable from "../behaviors/stepable";
import { Positionable, PositionType } from "../mixins/positional";
import { Rectangle } from "../objects/shapes";
import Vector from "../physics/vector";
import GameContext from "./gameContext";

const MAX_ZOOM = 7;
const MIN_ZOOM = 0.01;

class Camera extends BaseObject implements Positionable, Stepable, Disposable, Renderable {

  position: Vector;
  // viewport: Rectangle;
  private _zoom: number;
  following: Positionable | null;
  dispose?: () => void = undefined;
  locked: boolean = false;
  positionType: PositionType = 'overlay';

  constructor() {
    super('camera');
    this.position = new Vector(document.body.scrollWidth / 2, document.body.scrollHeight / 2);
    // this.position = new Vector(0, 0);
    // this.viewport = new Rectangle(document.body.scrollWidth, document.body.scrollHeight);
    this._zoom = 1;
    this.following = null;
  }

  init(context: CanvasRenderingContext2D) {
    const canvas = context.canvas;

    let startDragOffset = new Vector();
    let mouseDown = false;

    const handleCanvasWheel = (event: WheelEvent) => {

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

    // TODO: Fix moving camera with zoom!!
    const handleMouseMove = (event: MouseEvent) => {
      if (mouseDown) {
        this.unfollow();
        // const posDiff = this.position.clone()
        this.position.x = (event.clientX - startDragOffset.x);
        this.position.y = (event.clientY - startDragOffset.y);
        // posDiff.sub(this.position);
        // const pos = this.position.clone();

        // this.position.scalar(1 / this.zoom); 

        // console.log('positionDiff', posDiff);
        // console.log('scaled position diff', pos.sub(this.position));
      }
    }

    const handleMouseDown = (event: MouseEvent) => {
      mouseDown = true;
      startDragOffset.x = (event.clientX - this.position.x);
      startDragOffset.y = (event.clientY - this.position.y);
    }

    const handleMouseUp = (event: MouseEvent) => {
      mouseDown = false;
    }

    const handleMouseOver = (event: MouseEvent) => {
      mouseDown = false;
    }

    const handleMouseOut = (event: MouseEvent) => {
      mouseDown = false;
    }
    // add event listeners to handle screen drag
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseover", handleMouseOver);
    canvas.addEventListener("mouseout", handleMouseOut);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener('wheel', handleCanvasWheel)

    this.dispose = () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseover", handleMouseOver);
      canvas.removeEventListener("mouseout", handleMouseOut);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener('wheel', handleCanvasWheel);
    }
  }


  follow(obj: Positionable) {
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

  render() {
    const renderFn = (gameContext: GameContext) => {
      const { canvasRenderingContext } = gameContext;
      canvasRenderingContext.font = "30px Arial";
      canvasRenderingContext.fillStyle = "#FFF";
      canvasRenderingContext.fillText(`(${this.position.x.toFixed(0)},${this.position.y.toFixed(0)})`, 80, 30);
    }
    const renderElement = new RenderElement(renderFn);
    renderElement.positionType = 'overlay';
    return renderElement
  }

}

export default Camera;