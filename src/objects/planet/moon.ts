



import GameContext from '../../core/gameContext';
import { Circle } from '../shapes';
import Vector from '../../physics/vector';
import { ObjectType } from '../objectType';
import RenderUtils from '../../utils/renderUtils';
import { PhysicableMixin } from '../../mixins/physics';
import { CollisionableMixin } from '../../mixins/collisionable';
import { PositionableMixin } from '../../mixins/positional';
import BaseObject from '../../objects/baseObject';
import { Gravitationable, GravitationalMixin, isGravitationable } from '../../mixins/gravitational';
import { AffectedByGravitationableMixin } from '../../mixins/affectedByGravitational';

const MoonMixins = AffectedByGravitationableMixin(
  GravitationalMixin(
    PhysicableMixin(
      CollisionableMixin<Circle>()(
        PositionableMixin(BaseObject)
      )
    )
  )
);

class Planet extends MoonMixins {

  constructor(position: Vector) {
    super();
    this.position = position;
    this.gravitationalForce = 10000;
    this.type = ObjectType.PLANET;
    this.gravitationalThreshold = 150;
    this.velocity = new Vector(100, 0)
    this.collisionMask = new Circle(20);
    this.mass = 100;
    this.direction = new Vector(0, -1);
  }

  step(context: GameContext) {
    this.acceleration = this.calculateAcceleration(context);
    this.position = this.calculatePosition(context.dt);
    this.velocity = this.calculateVelocity(context.dt);
  }

  render(context: GameContext) {
    const canvasRenderingContext = context.canvasRenderingContext;
    canvasRenderingContext.save();
    canvasRenderingContext.beginPath();
    canvasRenderingContext.setLineDash([5, 15]);
    canvasRenderingContext.arc(this.position.x, this.position.y, this.gravitationalThreshold, 0, 2 * Math.PI);
    canvasRenderingContext.stroke();
    canvasRenderingContext.restore();

    if (this.isColliding) {
      canvasRenderingContext.strokeStyle = '#F00'
    }
    RenderUtils.renderCircle(canvasRenderingContext, this.position.clone(), this.collisionMask);
    canvasRenderingContext.fill();
  }

  private calculateAcceleration(context: GameContext) {
    const planets = context.objects.filter(obj => isGravitationable(obj) && obj.id !== this.id) as (BaseObject & Gravitationable)[];
    return this.calculateGravitationalAcceleration(planets);
  }

}

export default Planet;
