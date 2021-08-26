import GameContext from '../../core/gameContext';
import { Circle, Rectangle } from '../shapes';
import Vector from '../../physics/vector';
import { ObjectType } from '../objectType';
import RenderUtils from '../../utils/renderUtils';
import RocketThruster from './rocketThruster';
import { PhysicableMixin } from '../../mixins/physics';
import { CollisionableMixin } from '../../mixins/collisionable';
import { PositionableMixin } from '../../mixins/positional';
import BaseObject from '../../objects/baseObject';
import { AffectedByGravitationableMixin } from '../../mixins/affectedByGravitational';
import { Gravitationable, isGravitationable } from '../../mixins/gravitational';

const RocketMixins = AffectedByGravitationableMixin(
  PhysicableMixin(
    CollisionableMixin<Rectangle>()(
      PositionableMixin(BaseObject)
    )
  )
);

class Rocket extends RocketMixins {

  private thruster: RocketThruster;
  public hasLaunched: boolean = false;

  constructor(position: Vector) {
    super('rocket');
    this.position = position;
    this.mass = 549054; // falcon 9 weight
    this.type = ObjectType.ROCKET;
    this.collisionMask = new Rectangle(4, 10)
    this.direction = new Vector(0, -1);
    this.thruster = new RocketThruster(100000, 7607 * 1000); // 981 kN fallcon 9
  }

  step(context: GameContext): void {
    this.acceleration = this.calculateAcceleration(context);
    this.position = this.calculatePosition(context.dt);
    this.velocity = this.calculateVelocity(context.dt);
    this.direction = this.calculateDirection();
    this.isColliding = this.checkIsColliding(context);

    if (context.pressedKeys.isKeyPressed('a')) {
      this.direction.add(new Vector(-0.01, 0)).normalize()
    }

    if (context.pressedKeys.isKeyPressed('d')) {
      this.direction.add(new Vector(0.01, 0)).normalize()
    }

  }

  render(context: GameContext): void {
    const canvasRenderingContext = context.canvasRenderingContext;
    canvasRenderingContext.strokeStyle = '#FFF'

    if (this.isColliding) {
      canvasRenderingContext.strokeStyle = '#F00'
    }


    if (!this.hasLaunched) {
      canvasRenderingContext.save();
      canvasRenderingContext.beginPath();
      canvasRenderingContext.setLineDash([5, 15]);
      // canvasRenderingContext.translate(this.position.x, this.position.y);
      console.log(this.direction);
      canvasRenderingContext.moveTo(this.position.x, this.position.y);
      const line = this.direction.clone().scalar(1000) //.add(this.position);
      console.log(line);
      line.add(this.position);
      canvasRenderingContext.lineTo(line.x, line.y);
      canvasRenderingContext.stroke();
      canvasRenderingContext.restore();
    }

    canvasRenderingContext.translate(this.position.x, this.position.y);
    canvasRenderingContext.rotate(this.direction.angleTo(new Vector(0, 1)))
    canvasRenderingContext.translate(-this.position.x, -this.position.y);
    RenderUtils.renderRectangle(canvasRenderingContext, this.position, this.collisionMask as Rectangle);
    if (context.pressedKeys.isKeyPressed('w')) {
      canvasRenderingContext.strokeStyle = '#E5EB4A'
      canvasRenderingContext.fillStyle = '#E5EB4A'
      RenderUtils.renderCircle(canvasRenderingContext, this.position.clone().add(new Vector(0, -this.collisionMask.h / 2 - 2)), new Circle(4));
      canvasRenderingContext.fill();

      canvasRenderingContext.strokeStyle = '#EB9A4A'
      canvasRenderingContext.fillStyle = '#EB9A4A'
      RenderUtils.renderCircle(canvasRenderingContext, this.position.clone().add(new Vector(0, -this.collisionMask.h / 2)), new Circle(2));
      canvasRenderingContext.fill();
    }

  }

  calculateDirection() {
    if (this.speed > 0) {
      return this.velocity.clone().normalize();
    }

    return this.direction;
  }

  calculateAcceleration(context: GameContext) {
    const thrustAcceleration = this.getThrustAcceleration(context);
    const planets = context.objects.filter(isGravitationable) as (BaseObject & Gravitationable)[];
    const appliedAcceleration = this.calculateGravitationalAcceleration(planets);
    const acceleration = thrustAcceleration.clone().add(appliedAcceleration)
    return acceleration;
  }

  private getThrustAcceleration(context: GameContext) {
    let thrustAcceleration = new Vector();
    const isKeyPressed = context.pressedKeys.isKeyPressed;
    if (isKeyPressed('w')) {
      this.hasLaunched = true;
      // thrustAcceleration = this.rocket.direction.clone().scalar(this.thrust());
      thrustAcceleration = this.direction.clone().scalar(40); // TODO uncomment top
    }

    if (isKeyPressed('s')) {
      // thrustAcceleration = this.rocket.direction.clone().scalar(this.thrust());
      thrustAcceleration = this.direction.clone().scalar(-40); // TODO uncomment top
    }
    return thrustAcceleration;
  }

  private thrust() {
    const thustForce = this.thruster.thrust();
    if (thustForce > 0) {
      // f = m*a
      return this.mass / thustForce;
    }
    return 0;
  };

  private checkIsColliding(context: GameContext) {
    const collisions = context.collisions[this.id]
    return collisions !== undefined && collisions.length > 0
  }
}

export default Rocket;
