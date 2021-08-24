import GameContext from '../../core/gameContext';
import { Rectangle } from '../shapes';
import Vector from '../../physics/vector';
import Rocket from './rocket';
import { ObjectType } from '../objectType';
import RenderUtils from '../../utils/renderUtils';
import CollisionableObject from '../collisionableObject';
import PlanetObject from '../../objects/planet/planetObject';

class RocketObject extends CollisionableObject<Rectangle> {

  rocket: Rocket;
  isColliding: boolean = false;

  constructor(position: Vector) {
    super(new Rectangle(4, 10), position);
    this.rocket = new Rocket(549054); // falcon 9 weight
    this.type = ObjectType.ROCKET;
    this.rocket.direction = new Vector(0, -1);
  }

  step(context: GameContext): void {
    this.rocket.acceleration = this.getAcceleration(context);
    this.position = this.calculatePosition(context);
    this.rocket.velocity = this.calculateVelocity(context);
    // this.rocket.direction = this.calculateDirection(context);
    this.isColliding = this.checkIsColliding(context);

    if (this.position.y > document.body.scrollHeight) {
      this.rocket.acceleration.y = 0;
      this.position.y = document.body.scrollHeight;

    }
  }

  render(context: GameContext): void {
    const canvasRenderingContext = context.canvasRenderingContext;
    if (this.isColliding) {
      canvasRenderingContext.strokeStyle = '#F00'
    }
    RenderUtils.renderRectangle(canvasRenderingContext, this.position, this.collisionMask as Rectangle);
  }

  private getAcceleration(context: GameContext) {
    const thrustAcceleration = this.getThrustAcceleration(context);
    thrustAcceleration.scalar(-1);
    const appliedAcceleration = this.calculateAccelerationBySurroundingPlanets(context);
    const acceleration = thrustAcceleration.clone().add(appliedAcceleration)
    return acceleration;
  }

  private getThrustAcceleration(context: GameContext) {
    let thrustAcceleration = new Vector();
    const isKeyPressed = context.pressedKeys.isKeyPressed;
    if (isKeyPressed('w')) {
      // thrustAcceleration = this.rocket.direction.clone().scalar(this.rocket.thrust());
      thrustAcceleration = this.rocket.direction.clone().scalar(-40); // TODO uncomment top
    }

    if (isKeyPressed('s')) {
      // thrustAcceleration = this.rocket.direction.clone().scalar(this.rocket.thrust());
      thrustAcceleration = this.rocket.direction.clone().scalar(40); // TODO uncomment top
    }
    return thrustAcceleration;
  }

  private calculateAccelerationBySurroundingPlanets(context: GameContext): Vector {

    const planets: PlanetObject[] = context.objects.filter(obj => obj instanceof PlanetObject) as PlanetObject[];
    const acceleration = new Vector();

    planets.forEach(planet => {
      const accByPlanet = this.calculateAccelerationByPlanet(planet);
      acceleration.add(accByPlanet)
    });

    return acceleration;
  }

  // v = v0 + a*t
  private calculateVelocity(context: GameContext) {
    const newVelocity = this.rocket.velocity.clone();
    const deltaVelocity = this.rocket.acceleration.clone().scalar(context.dt);
    newVelocity.add(deltaVelocity);
    return newVelocity;
  }

  // p = p0 + v0*dt + 1/2a*dt^2
  private calculatePosition(context: GameContext) {
    const newPosition = this.position.clone();
    const deltaPositionByAcceleration = this.rocket.acceleration.clone().scalar(Math.pow(context.dt, 2) / 2);
    const deltaPosition = this.rocket.velocity.clone().scalar(context.dt).add(deltaPositionByAcceleration);
    newPosition.add(deltaPosition);
    return newPosition;
  }

  private checkIsColliding(context: GameContext) {
    const collisions = context.collisions[this.id]
    return collisions !== undefined && collisions.length > 0
  }

  private calculateDirection(context: GameContext) {
    return this.rocket.velocity.clone().normalize();
  }

  private calculateAccelerationByPlanet(planet: PlanetObject) {
    const distanceToPlanet = this.position.distanceTo(planet.position)
    if (distanceToPlanet < planet.collisionMask.radius + 300) {

      const directionalVectorToPlanet = new Vector(planet.position.x - this.position.x, planet.position.y - this.position.y).normalize();
      // TODO: review this formula below
      console.log(distanceToPlanet);
      directionalVectorToPlanet.scalar(planet.gravitationalForce / distanceToPlanet);
      return directionalVectorToPlanet;
    }

    return new Vector();
  }

}

export default RocketObject;
