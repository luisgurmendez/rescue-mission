import { Circle } from "../shapes";
import Vector from "../../physics/vector";
import GameContext from "../../core/gameContext";
import RenderUtils from "../../utils/renderUtils";
import { ObjectType } from "../../objects/objectType";
import CollisionableObject from "../../objects/collisionableObject";

class PlanetObject extends CollisionableObject<Circle> {

  public gravitationalForce: number;

  constructor(position: Vector) {
    super(new Circle(100), position);
    this.gravitationalForce = 10000;
    this.type = ObjectType.PLANET;
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