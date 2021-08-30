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
import Particle from '../particle/particle';
import Color from '../../utils/color';


type ParticlePerimetralPositioning = 'top' | 'bottom' | 'top-left' | 'top-right'


const RocketMixins = AffectedByGravitationableMixin(
  PhysicableMixin(
    CollisionableMixin<Rectangle>()(
      PositionableMixin(BaseObject)
    )
  )
);


// TODO: Should we make gravity affect the angular acceleration? 
class Rocket extends RocketMixins implements Renderable, Stepable, Disposable {

  private thruster: RocketThruster;
  private secondaryThruster: RocketThruster;
  public hasLaunched: boolean = false;
  shouldDispose: boolean = false;

  //TODO: add angular acc and angular velocity, this way we can implement the rotation of the rocket properly. Should we add this in the Physicsmixin?
  // Rotations should not affect the velocity of the rocket..
  constructor(position: Vector) {
    super('rocket');
    this.position = position;
    this.mass = 549054; // falcon 9 weight
    this.type = ObjectType.ROCKET;
    this.collisionMask = new Rectangle(13, 16)
    this.direction = new Vector(0, -1);
    this.thruster = new RocketThruster(500, 7607 * 1000); // 981 kN fallcon 9
    this.secondaryThruster = new RocketThruster(300, 7607 * 1000);
  }

  step(context: GameContext): void {
    this.checkCollisions(context);

    this.angularAcceleration = this.calculateAngularAcceleration(context);
    this.angularVelocity = this.calculateAngularVelocity(context.dt);
    this.direction = this.calculateDirection(context.dt);
    this.acceleration = this.calculateAcceleration(context);
    this.position = this.calculatePosition(context.dt);
    this.velocity = this.calculateVelocity(context.dt);

    this.direction = this.preLaunchingCalculateDirection(context)


    if (this.isColliding) {
      this.shouldDispose = true;
      context.objects.push(...generateRocketExplotionParticles(this.position.clone()))
    }
  }

  render() {
    const renderElement = new RenderElement(this._renderRocket);
    const thrusterRenderElement = this.thruster.render();
    const secondaryThrusterRenderElement = this.secondaryThruster.render({ color: new Color(255, 255, 255), offset: new Vector(45, 0) });
    const rocketPhysicsRenderElement = new RenderElement(this._renderRocketPhysics);
    rocketPhysicsRenderElement.positionType = 'overlay';

    renderElement.children = [secondaryThrusterRenderElement, thrusterRenderElement, rocketPhysicsRenderElement]
    if (!this.hasLaunched) {
      const rocketLauncherRenderElement = new RenderElement(this._renderLaunchDirectional);
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

  _renderLaunchDirectional = (context: GameContext) => {
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

  preLaunchingCalculateDirection(context: GameContext) {
    const newDirection = this.direction.clone()

    if (context.pressedKeys.isKeyPressed('a') && !this.hasLaunched) {
      newDirection.rotate(-0.5).normalize()
    }

    if (context.pressedKeys.isKeyPressed('d') && !this.hasLaunched) {
      newDirection.rotate(0.5).normalize()
    }

    return newDirection;
  }

  calculateAngularAcceleration(context: GameContext) {
    const isKeyPressed = context.pressedKeys.isKeyPressed;
    let angularAcceleration = 0;

    if (isKeyPressed('d') && this.hasLaunched) {
      const thrustAcceleration = this.direction.clone().rotate(90).scalar(this.secondaryThrust()) // TODO uncomment top
      const particle = this.generateParticle(thrustAcceleration, 'top-left');
      if (particle) {
        context.objects.push(particle);
      } angularAcceleration = thrustAcceleration.length();
    }

    if (isKeyPressed('a') && this.hasLaunched) {
      const thrustAcceleration = this.direction.clone().rotate(-90).scalar(this.secondaryThrust()) // TODO uncomment top
      const particle = this.generateParticle(thrustAcceleration, 'top-right');
      if (particle) {
        context.objects.push(particle);
      }
      angularAcceleration = thrustAcceleration.length() * -1;
    }

    return angularAcceleration
  }

  calculateAcceleration(context: GameContext) {
    const thrustAcceleration = this.getThrustAcceleration(context);
    const planets = context.objects.filter(isGravitationable) as (BaseObject & Gravitationable)[];
    const appliedAcceleration = this.calculateGravitationalAcceleration(planets);
    const acceleration = thrustAcceleration.clone().add(appliedAcceleration)
    return acceleration;
  }


  private generateParticle = (thrustAcc: Vector, toPosition: ParticlePerimetralPositioning, isPrimaryThruster = false): Particle | null => {
    const particleGenerator = isPrimaryThruster ? generateThrusterParticle : generateSecondaryThrusterParticle;
    if (thrustAcc.length() > 0) {
      const particle = particleGenerator(this.position.clone(), thrustAcc.clone().normalize());
      this.adjustParticlePositionToMatchRocketPerimeter(particle, toPosition)
      return particle
    }
    return null;
  }

  private getThrustAcceleration(context: GameContext) {
    let thrustAcceleration = new Vector();
    const isKeyPressed = context.pressedKeys.isKeyPressed;

    if (isKeyPressed('w')) {
      this.hasLaunched = true;
      thrustAcceleration = this.direction.clone().scalar(this.thrust());
      const particle = this.generateParticle(thrustAcceleration, 'bottom', true)
      if (particle) {
        context.objects.push(particle);
      }
    }

    if (isKeyPressed('s')) {
      thrustAcceleration = this.direction.clone().scalar(-1).scalar(this.secondaryThrust()); // TODO uncomment top
      const particle = this.generateParticle(thrustAcceleration, 'top');
      if (particle) {
        context.objects.push(particle);
      }

    }
    return thrustAcceleration;
  }


  /**
   * Moves the position of a particle starting from the center of the rocket to match the permiteres of the rocket.
   */
  private adjustParticlePositionToMatchRocketPerimeter(particle: Particle, toPosition: ParticlePerimetralPositioning) {

    let particleOffsetVector = new Vector();

    if (toPosition === 'bottom') {
      const particleOffsetAngle = this.direction.angleTo(new Vector(1, 0));
      particleOffsetVector = new Vector(Math.cos(particleOffsetAngle), Math.sin(particleOffsetAngle)).scalar(this.collisionMask.h / 2);
    }

    // This matches top / top-left / top-right
    if (toPosition.includes('top')) {
      const particleOffsetAngle = this.direction.angleTo(new Vector(1, 0));
      particleOffsetVector = new Vector(Math.cos(particleOffsetAngle), Math.sin(particleOffsetAngle)).scalar((this.collisionMask.h / 2) - 3).scalar(-1);
    }

    if (toPosition === 'top-right') {
      const particleOffsetAngleH = this.direction.angleTo(new Vector(0, 1));
      const particleOffsetVectorH = new Vector(Math.cos(particleOffsetAngleH), Math.sin(particleOffsetAngleH)).scalar((this.collisionMask.w / 2) - 2)
      particleOffsetVector.add(particleOffsetVectorH)
    }

    if (toPosition === 'top-left') {
      const particleOffsetAngleH = this.direction.angleTo(new Vector(0, 1));
      const particleOffsetVectorH = new Vector(Math.cos(particleOffsetAngleH), Math.sin(particleOffsetAngleH)).scalar((this.collisionMask.w / 2) - 2).scalar(-1);
      particleOffsetVector.add(particleOffsetVectorH)
    }

    particle.position.sub(particleOffsetVector)

  }

  private secondaryThrust() {
    const thustForce = this.secondaryThruster.thrust();
    if (thustForce > 0) {
      // f = m*a
      // return this.mass / thustForce;
      return 30;
    }
    return 0;
  };

  private thrust() {
    const thustForce = this.thruster.thrust();
    if (thustForce > 0) {
      // f = m*a
      // return this.mass / thustForce;
      return 40;
    }
    return 0;
  };
}

export default Rocket;
