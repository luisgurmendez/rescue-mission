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
import { adjustParticlePositionToMatchRocketPerimeter, generateRocketExplotionParticles, generateSecondaryThrusterParticle, generateThrusterParticle, ParticlePerimetralPositioning } from './rocketParticlesUtils';
import Particle from '../particle/particle';
import Color from '../../utils/color';
import Planet from '../planet/planet';
import RocketRenderUtils from './rocketRenderUtils';


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
  private hasLanded = false;

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
    if (!this.hasLanded) {
      this.angularAcceleration = this.calculateAngularAcceleration(context);
      this.angularVelocity = this.calculateAngularVelocity(context.dt);
      this.direction = this.calculateDirection(context.dt);
      this.acceleration = this.calculateAcceleration(context);
      this.position = this.calculatePosition(context.dt);
      this.velocity = this.calculateVelocity(context.dt);

      this.direction = this.preLaunchingCalculateDirection(context);
    }
  }

  render() {
    const renderElement = new RenderElement(RocketRenderUtils.renderRocket);
    const thrusterRenderElement = this.thruster.render();
    const secondaryThrusterRenderElement = this.secondaryThruster.render({ color: new Color(255, 255, 255), offset: new Vector(45, 0) });

    const rocketPhysicsRenderElement = new RenderElement(RocketRenderUtils.renderRocketPhysics);
    rocketPhysicsRenderElement.positionType = 'overlay';

    const cautionTooFastRenderElement = new RenderElement(RocketRenderUtils.renderCautionTooFast)
    cautionTooFastRenderElement.positionType = 'overlay';

    renderElement.children = [secondaryThrusterRenderElement, thrusterRenderElement, rocketPhysicsRenderElement]

    if (this.speed > 40) {
      renderElement.children.push(cautionTooFastRenderElement);
    }

    if (!this.hasLaunched) {
      const rocketLauncherRenderElement = new RenderElement(RocketRenderUtils.renderLaunchDirectional);
      const rocketLauncherAngleRenderElement = new RenderElement(RocketRenderUtils.renderLaunchAngle);
      rocketLauncherAngleRenderElement.positionType = 'overlay';
      renderElement.children.push(...[rocketLauncherRenderElement, rocketLauncherAngleRenderElement])
    }
    return renderElement;
  }

  preLaunchingCalculateDirection(context: GameContext) {
    const newDirection = this.direction.clone()

    if (!this.hasLaunched) {
      if (context.pressedKeys.isKeyPressed('a')) {
        newDirection.rotate(-0.5).normalize()
      }

      if (context.pressedKeys.isKeyPressed('d')) {
        newDirection.rotate(0.5).normalize()
      }
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
      } angularAcceleration = thrustAcceleration.length() * 5;
    }

    if (isKeyPressed('a') && this.hasLaunched) {
      const thrustAcceleration = this.direction.clone().rotate(-90).scalar(this.secondaryThrust()) // TODO uncomment top
      const particle = this.generateParticle(thrustAcceleration, 'top-right');
      if (particle) {
        context.objects.push(particle);
      }
      angularAcceleration = thrustAcceleration.length() * -5;
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

  explode(context: GameContext) {
    this.shouldDispose = true;
    context.objects.push(...generateRocketExplotionParticles(this.position.clone()))
  }

  land() {
    this.hasLanded = true;
    this.stopRocketPhysics();
  }

  private stopRocketPhysics() {
    this.acceleration = new Vector();
    this.velocity = new Vector();
    this.angularVelocity = 0;
    this.angularAcceleration = 0;
  }

  private generateParticle = (thrustAcc: Vector, toPosition: ParticlePerimetralPositioning, isPrimaryThruster = false): Particle | null => {
    const particleGenerator = isPrimaryThruster ? generateThrusterParticle : generateSecondaryThrusterParticle;
    if (thrustAcc.length() > 0) {
      const particle = particleGenerator(this.position.clone(), thrustAcc.clone().normalize());
      adjustParticlePositionToMatchRocketPerimeter(particle, toPosition, this.direction, this.collisionMask);
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
