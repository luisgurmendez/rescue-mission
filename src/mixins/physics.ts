
import Vector from "../physics/vector";
import { PositionableConstructor, Positionable } from "./positional";
import { GConstructor } from "./shared";

export interface Physicable extends Positionable {
  velocity: Vector;
  direction: Vector;
  acceleration: Vector;
  mass: number;
  speed: number;
  isMoving: () => boolean;

  calculateVelocity: (dt: number) => Vector;
  calculatePosition: (dt: number) => Vector;
}

export type PhysicableConstructor = GConstructor<Physicable>;

export function PhysicableMixin<TBase extends PositionableConstructor>(Base: TBase): PhysicableConstructor & TBase {
  return class M extends Base implements Physicable {
    velocity: Vector = new Vector();
    direction: Vector = new Vector();
    acceleration: Vector = new Vector();
    mass = 0;

    get speed(): number {
      return this.velocity.length();
    }

    isMoving(): boolean {
      const speedThreshold = 0;
      return this.speed > speedThreshold;
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
  };
}

