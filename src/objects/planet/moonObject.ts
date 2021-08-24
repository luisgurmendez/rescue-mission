import GameContext from '../../core/gameContext';
import { Circle } from '../shapes';
import Vector from '../../physics/vector';
import { ObjectType } from '../objectType';
import RenderUtils from '../../utils/renderUtils';
import CollisionableObject from '../collisionableObject';
import PhysicsObject from '../../objects/physicsObject';

class MoonObject extends PhysicsObject implements CollisionableObject<Circle> {

  isColliding: boolean = false;
  collisionMask: Circle;
  constructor(position: Vector) {
    super(position);
    this.velocity = new Vector(100, 0)
    this.type = ObjectType.PLANET;
    this.direction = new Vector(0, -1);
    this.collisionMask = new Circle(20);
  }

  step(context: GameContext): void {
    super.step(context);
    this.isColliding = this.checkIsColliding(context);
  }

  render(context: GameContext): void {
    const canvasRenderingContext = context.canvasRenderingContext;
    if (this.isColliding) {
      canvasRenderingContext.strokeStyle = '#F00'
    }
    RenderUtils.renderCircle(canvasRenderingContext, this.position.clone(), this.collisionMask);
    canvasRenderingContext.fill();
  }

  private checkIsColliding(context: GameContext) {
    const collisions = context.collisions[this.id]
    return collisions !== undefined && collisions.length > 0
  }
}

export default MoonObject;
