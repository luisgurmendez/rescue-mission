import GameContext from '../../core/gameContext';
import { Circle, Rectangle } from '../shapes';
import Vector from '../../physics/vector';
import { ObjectType } from '../objectType';
import RenderUtils from '../../render/utils';
import RocketThruster from './rocketThruster';
import { PhysicableMixin } from '../../mixins/physics';
import { CollisionableMixin } from '../../mixins/collisionable';
import { PositionableMixin } from '../../mixins/positional';
import BaseObject from '../../objects/baseObject';
import { AffectedByGravitationableMixin } from '../../mixins/affectedByGravitational';
import { Gravitationable, isGravitationable } from '../../mixins/gravitational';
import Renderable from '../../behaviors/renderable';
import Stepable from '../../behaviors/stepable';
import RenderElement from '../../render/renderElement';
import Disposable from '../../behaviors/disposable';
import { generateRocketExplotionParticles, generateSecondaryThrusterParticle, generateThrusterParticle } from './rocketParticlesUtils';

const RocketMixins = AffectedByGravitationableMixin(
  PhysicableMixin(
    CollisionableMixin<Rectangle>()(
      PositionableMixin(BaseObject)
    )
  )
);

class Rocket extends RocketMixins implements Renderable, Stepable, Disposable {

  private thruster: RocketThruster;
  private secondaryThruster: RocketThruster;
  public hasLaunched: boolean = false;
  shouldDispose: boolean = false;

  constructor(position: Vector) {
    super('rocket');
    this.position = position;
    this.mass = 549054; // falcon 9 weight
    this.type = ObjectType.ROCKET;
    this.collisionMask = new Rectangle(13, 16)
    this.direction = new Vector(0, -1);
    this.thruster = new RocketThruster(500, 7607 * 1000); // 981 kN fallcon 9
    this.secondaryThruster = new RocketThruster(50, 7607 * 1000);
  }

  step(context: GameContext): void {
    this.acceleration = this.calculateAcceleration(context);
    this.position = this.calculatePosition(context.dt);
    this.velocity = this.calculateVelocity(context.dt);
    this.direction = this.calculateDirection();
    this.isColliding = this.checkIsColliding(context);

    if (context.pressedKeys.isKeyPressed('a') && !this.hasLaunched) {
      this.direction.rotate(-0.5).normalize()
    }

    if (context.pressedKeys.isKeyPressed('d') && !this.hasLaunched) {
      this.direction.rotate(0.5).normalize()
    }

    if (this.isColliding) {
      this.shouldDispose = true;
      context.objects.push(...generateRocketExplotionParticles(this.position.clone()))
    }
  }

  render() {
    const renderElement = new RenderElement(this._renderRocket);
    const thrusterRenderElement = this.thruster.render();
    const rocketPhysicsRenderElement = new RenderElement(this._renderRocketPhysics);
    rocketPhysicsRenderElement.positionType = 'overlay';

    renderElement.children = [thrusterRenderElement, rocketPhysicsRenderElement]
    if (!this.hasLaunched) {
      const rocketLauncherRenderElement = new RenderElement(this._renderLaunchDiretional);
      const rocketLauncherAngleRenderElement = new RenderElement(this._renderLaunchAngle);
      rocketLauncherAngleRenderElement.positionType = 'overlay';
      renderElement.children.push(...[rocketLauncherRenderElement, rocketLauncherAngleRenderElement])
    }
    return renderElement;
  }

  _renderLaunchAngle = (context: GameContext) => {
    const { canvasRenderingContext, canvasRenderingContext: { canvas } } = context;
    canvasRenderingContext.font = "15px Arial";
    canvasRenderingContext.fillStyle = "#FFF";
    canvasRenderingContext.fillText(`angle: ${(this.direction.angleTo(new Vector(0, -1)) * 180 / Math.PI).toFixed(2)}º`, canvas.width - 300, canvas.height - 20);
  }

  _renderLaunchDiretional = (context: GameContext) => {
    const { canvasRenderingContext } = context;
    canvasRenderingContext.strokeStyle = "#FFF";
    // Launch line
    canvasRenderingContext.save();
    canvasRenderingContext.beginPath();
    canvasRenderingContext.setLineDash([5, 15]);
    // canvasRenderingContext.translate(this.position.x, this.position.y);
    canvasRenderingContext.moveTo(this.position.x, this.position.y);
    const line = this.direction.clone().scalar(1000) //.add(this.position);
    line.add(this.position);
    canvasRenderingContext.lineTo(line.x, line.y);
    canvasRenderingContext.stroke();
    canvasRenderingContext.restore();


  }

  _renderRocketPhysics = (context: GameContext) => {
    const { canvasRenderingContext, canvasRenderingContext: { canvas } } = context;
    canvasRenderingContext.font = "15px Arial";
    canvasRenderingContext.fillStyle = "#FFF";
    canvasRenderingContext.fillText(`position: (${this.position.x.toFixed(0)},${this.position.y.toFixed(0)})`, canvas.width - 140, canvas.height - 20);
    canvasRenderingContext.fillText(`speed: ${this.speed.toFixed(0)}`, canvas.width - 210, canvas.height - 20);
  }

  _renderRocket = (context: GameContext): void => {
    const canvasRenderingContext = context.canvasRenderingContext;
    canvasRenderingContext.strokeStyle = '#FFF'

    if (this.isColliding) {
      canvasRenderingContext.strokeStyle = '#F00'
    }

    // rotate
    canvasRenderingContext.translate(this.position.x, this.position.y);
    canvasRenderingContext.rotate(this.direction.angleTo(new Vector(0, -1)))
    canvasRenderingContext.translate(-this.position.x, -this.position.y);

    // Renders the rocket pixel art 
    // TODO: improve
    const canvas = RenderUtils.generatePixelArt(
      "eeeccd34722449c89b568",
      "@@@JI@@@@@PJIA@@@@R|OI@@@@b|I@@@@b|I@@@@b|I@@@@b|I@@@@RJII@@@@RJiI@@@@RJII@@@@RJIy@@@XRJIyF@@[RJIyw@@[RJIyw@@[RJIyw@@[`ddxw@",
      16);


    canvasRenderingContext.drawImage(canvas, this.position.x - this.collisionMask.w / 2, this.position.y - this.collisionMask.h / 2);
    // RenderUtils.renderCircle(canvasRenderingContext, this.position, new Circle(1));
    // RenderUtils.renderRectangle(canvasRenderingContext, this.position, this.collisionMask);
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
      thrustAcceleration = this.direction.clone().scalar(this.thrust());
      if (thrustAcceleration.length() > 0) {

        const particle = generateThrusterParticle(this.position.clone(), this.direction.clone());

        // Move particle to match the rockets thruster position (bottom)
        const particleOffsetAngle = this.direction.angleTo(new Vector(1, 0));
        const particleOffsetVector = new Vector(Math.cos(particleOffsetAngle), Math.sin(particleOffsetAngle)).scalar(this.collisionMask.h / 2);
        particle.position.sub(particleOffsetVector)

        context.objects.push(particle);
      }
    }

    if (isKeyPressed('s')) {
      // thrustAcceleration = this.rocket.direction.clone().scalar(this.thrust());
      thrustAcceleration = this.direction.clone().scalar(-40); // TODO uncomment top

      const particle = generateSecondaryThrusterParticle(this.position.clone(), this.direction.clone().scalar(-1));

      // Move particle to match the rockets thruster position (bottom)
      const particleOffsetAngle = this.direction.angleTo(new Vector(1, 0));
      const particleOffsetVector = new Vector(Math.cos(particleOffsetAngle), Math.sin(particleOffsetAngle)).scalar(this.collisionMask.h / 2).scalar(-1);
      particle.position.sub(particleOffsetVector)

      context.objects.push(particle);

    }
    return thrustAcceleration;
  }

  private thrust() {
    const thustForce = this.thruster.thrust();
    if (thustForce > 0) {
      // f = m*a
      // return this.mass / thustForce;
      return 40;
    }
    return 0;
  };

  private checkIsColliding(context: GameContext) {
    const collisions = context.collisions[this.id]
    return collisions !== undefined && collisions.length > 0
  }
}

export default Rocket;
