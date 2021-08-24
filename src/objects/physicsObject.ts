import GameContext from "core/gameContext";
import Vector from "../physics/vector";
import GameObject from "./gameObject";
import PlanetObject from "./planet/planetObject";

// TODO add Mixins!




// TODO: add gravitational forces calculations in this class as well as setting acc, vel, direct, 
// TODO: Should we make this extends gameobj?
abstract class PhysicsObject extends GameObject {

  public velocity: Vector;
  public direction: Vector;
  public acceleration: Vector;
  public mass: number;

  constructor(position: Vector, mass?: number) {
    super(position)
    this.velocity = new Vector();
    this.direction = new Vector(0, 1);
    this.acceleration = new Vector();
    this.mass = mass || 0;
  }

  get speed(): number {
    return this.velocity.length();
  }

  isMoving(): boolean {
    const speedThreshold = 0;
    return this.speed > speedThreshold;
  }

  step(context: GameContext): void {
    this.acceleration = this.calculateAcceleration(context);
    this.position = this.calculatePosition(context.dt);
    this.velocity = this.calculateVelocity(context.dt);
    this.direction = this.calculateDirection(context);
  }

  calculateAcceleration(context: GameContext) {
    const appliedAcceleration = this.calculateAccelerationBySurroundingPlanets(context);
    return appliedAcceleration;
  }

  // v = v0 + a*t
  calculateVelocity(dt: number) {
    const newVelocity = this.velocity.clone();
    const deltaVelocity = this.acceleration.clone().scalar(dt);
    newVelocity.add(deltaVelocity);
    return newVelocity;
  }

  // p = p0 + v0*dt + 1/2a*dt^2
  calculatePosition(dt: number) {
    const newPosition = this.position.clone();
    const deltaPositionByAcceleration = this.acceleration.clone().scalar(Math.pow(dt, 2) / 2);
    const deltaPosition = this.velocity.clone().scalar(dt).add(deltaPositionByAcceleration);
    newPosition.add(deltaPosition);
    return newPosition;
  }

  calculateDirection(context: GameContext) {
    if (this.speed > 0) {
      return this.velocity.clone().normalize();
    }

    return this.direction;
  }

  calculateAccelerationBySurroundingPlanets(context: GameContext): Vector {
    const planets: PlanetObject[] = context.objects.filter(obj => obj instanceof PlanetObject) as PlanetObject[];
    const acceleration = new Vector();

    planets.forEach(planet => {
      const accByPlanet = this.calculateAccelerationByPlanet(planet);
      acceleration.add(accByPlanet)
    });

    return acceleration;
  }

  private calculateAccelerationByPlanet(planet: PlanetObject) {
    const distanceToPlanet = this.position.distanceTo(planet.position)

    if (distanceToPlanet < planet.collisionMask.radius + 300) { // TODO: remove the + 300 in favor of planet.gravityThreshold or smh

      const directionalVectorToPlanet = new Vector(planet.position.x - this.position.x, planet.position.y - this.position.y).normalize();
      // TODO: review this formula below
      directionalVectorToPlanet.scalar(planet.gravitationalForce / distanceToPlanet);
      return directionalVectorToPlanet;
    }

    return new Vector();
  }

}

export default PhysicsObject;