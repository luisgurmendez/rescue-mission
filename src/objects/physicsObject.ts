import Vector from "../physics/vector";

abstract class Physics {

  public velocity: Vector;
  public direction: Vector;
  public acceleration: Vector;
  public mass: number;

  constructor(mass?: number) {
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
}

export default Physics;