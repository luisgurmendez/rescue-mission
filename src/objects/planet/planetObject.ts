import { Circle } from "../shapes";
import Vector from "../../physics/vector";
import GameContext from "../../core/gameContext";
import RenderUtils from "../../utils/renderUtils";
import { ObjectType } from "../../objects/objectType";
import CollisionableObject from "../../objects/collisionableObject";
import GameObject from "../../objects/gameObject";

class PlanetObject extends GameObject implements CollisionableObject<Circle> {

  public gravitationalForce: number;
  public collisionMask: Circle;

  constructor(position: Vector) {
    super(position);
    this.gravitationalForce = 10000;
    this.type = ObjectType.PLANET;
    this.collisionMask = new Circle(100);
  }

  step() { }

  render(context: GameContext) {
    const canvasRenderingContext = context.canvasRenderingContext;
    canvasRenderingContext.save();
    canvasRenderingContext.beginPath();
    canvasRenderingContext.setLineDash([5, 15]);
    canvasRenderingContext.arc(this.position.x, this.position.y, this.collisionMask.radius + 300, 0, 2 * Math.PI);
    canvasRenderingContext.stroke();
    canvasRenderingContext.restore();
    RenderUtils.renderCircle(canvasRenderingContext, this.position, new Circle(1));
    RenderUtils.renderCircle(canvasRenderingContext, this.position, this.collisionMask);
  }

}

export default PlanetObject;