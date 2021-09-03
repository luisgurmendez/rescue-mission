import Disposable from "../behaviors/disposable";
import BaseObject from "../objects/baseObject";
import RenderElement from "../render/renderElement";
import Renderable from "../behaviors/renderable";
import Stepable from "../behaviors/stepable";
import { Positionable, PositionType } from "../mixins/positional";
import Vector from "../physics/vector";
import GameContext from "./gameContext";
import Initializable from "../behaviors/initializable";
import { Rectangle } from "../objects/shapes";
import { wait } from "../utils/async";

const MAX_ZOOM = 14;
const MIN_ZOOM = 0.01;

class Camera extends BaseObject implements Positionable, Stepable, Disposable, Renderable, Initializable {

  position: Vector;
  viewport: Rectangle;
  private _zoom: number;
  following: Positionable | null;
  dispose?: () => void = undefined;
  locked: boolean = false;
  positionType: PositionType = 'overlay';
  shouldInitialize = true;
  shouldDispose = false;
  flyingToPosition: Vector | null = null;
  flyingDuration: number | null = null;
  flyingElapsedTime: number | null = null;
  flyingInitialPosition: Vector | null = null;


  constructor() {
    super('camera');
    // this.position = new Vector(document.body.scrollWidth / 2, document.body.scrollHeight / 2);
    this.position = new Vector(0, 0);
    this.viewport = new Rectangle(document.body.scrollWidth, document.body.scrollHeight);
    this._zoom = 1;
    this.following = null;
  }

  init(gameContext: GameContext) {
    const { canvasRenderingContext } = gameContext
    const canvas = canvasRenderingContext.canvas;

    this.viewport.w = canvas.width;
    this.viewport.h = canvas.height;

    let initialDragginPosition = new Vector();
    let initialDraggingClientPosition = new Vector();
    let mouseDown = false;

    const handleCanvasWheel = (event: WheelEvent) => {

      event.preventDefault();

      const mousex = (event.clientX - (canvas.offsetLeft + canvas.width / 2)) * -1
      const mousey = (event.clientY - (canvas.offsetTop + canvas.height / 2)) * -1
      const wheel = event.deltaY < 0 ? 1 : -1;

      const deltaZoom = Math.exp(wheel * 0.02);

      const oldZoom = this.zoom;
      this.zoom = this.zoom * deltaZoom;

      // Only change positions if there was some actual zooming
      if (oldZoom !== this.zoom && this.following === null) {

        this.position.x += mousex / (this.zoom * deltaZoom) - mousex / this.zoom;
        this.position.y += mousey / (this.zoom * deltaZoom) - mousey / this.zoom;

      }

    }

    const handleMouseMove = (event: MouseEvent) => {
      if (mouseDown) {
        this.unfollow();
        const posDiff = initialDraggingClientPosition.clone().sub(new Vector(event.clientX, event.clientY));
        posDiff.scalar(1 / this.zoom);

        this.position = initialDragginPosition.clone().add(posDiff);

      }
    }

    const handleMouseDown = (event: MouseEvent) => {
      mouseDown = true;
      initialDragginPosition = this.position.clone();
      initialDraggingClientPosition = new Vector(event.clientX, event.clientY);
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

  step(context: GameContext) {
    if (this.following !== null) {
      this.position = this.following.position.clone()
    }

    if (
      this.flyingToPosition !== null &&
      this.flyingDuration !== null &&
      this.flyingElapsedTime !== null &&
      this.flyingInitialPosition !== null
    ) {
      this.flyingElapsedTime -= context.dt;
      const toPositionVector = this.flyingToPosition.clone().sub(this.position);
      const distanceToFlyingPosition = this.flyingInitialPosition.distanceTo(this.flyingToPosition);
      const flyingSpeed = distanceToFlyingPosition / this.flyingDuration;
      const flyingDelta = toPositionVector.normalize().scalar(context.dt * flyingSpeed);
      this.position = this.position.add(flyingDelta);
      if (this.flyingElapsedTime < 0) {
        this.position = this.flyingToPosition.clone();
        this.flyingToPosition = null;
        this.flyingElapsedTime = null;
        this.flyingDuration = null;
        this.flyingInitialPosition = null;
      }

    }

    this.adjutsPositionIfOutOfWorldsBounds(context.worldDimensions);
  }

  adjutsPositionIfOutOfWorldsBounds(world: Rectangle) {
    const adjutsLeft = this.position.clone().x - this.viewport.w / 2 < -world.w / 2;
    const adjustRight = this.position.clone().x + this.viewport.w / 2 > world.w / 2;
    const adjustTop = this.position.clone().y - this.viewport.h / 2 > world.h / 2;
    const adjustBottom = this.position.clone().y + this.viewport.h / 2 < -world.h / 2;

    if (adjutsLeft) {
      this.position.x = -world.w / 2 + this.viewport.w / 2;
    }

    if (adjustRight) {
      this.position.x = world.w / 2 - this.viewport.w / 2;
    }

    if (adjustTop) {
      this.position.y = world.w / 2 + this.viewport.h / 2;
    }

    if (adjustBottom) {
      this.position.y = -world.w / 2 - this.viewport.h / 2;
    }

  }

  render() {
    const renderFn = (gameContext: GameContext) => {
      const { canvasRenderingContext, canvasRenderingContext: { canvas } } = gameContext;
      canvasRenderingContext.font = "15px Arial";
      canvasRenderingContext.fillStyle = "#FFF";
      canvasRenderingContext.fillText(`(${this.position.x.toFixed(0)},${this.position.y.toFixed(0)})`, canvas.width - 80, 20);
    }
    const renderElement = new RenderElement(renderFn);
    renderElement.positionType = 'overlay';
    return renderElement
  }


  // there is a known bug where the promise resolves before the flying duration when the game is on pause
  flyTo(position: Vector, duration: number = 2): Promise<void> {

    this.following = null;
    this.flyingToPosition = position;
    this.flyingInitialPosition = this.position.clone();
    this.flyingDuration = duration;
    this.flyingElapsedTime = duration;

    return wait(2)
  }

}

export default Camera;