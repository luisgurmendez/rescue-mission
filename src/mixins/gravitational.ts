

import { Physicable, PhysicableConstructor } from "./physics";
import { GConstructor } from "./shared";

export interface Gravitationable extends Physicable {
  gravitationalThreshold: number;
  gravitationalForce: number;
}

export type GravitationalConstructor = GConstructor<Gravitationable>;

export function GravitationalMixin<TBase extends PhysicableConstructor>(Base: TBase): GravitationalConstructor & TBase {
  return class M extends Base implements Gravitationable {
    gravitationalThreshold = 0;
    gravitationalForce = 0;
  };
}

export function isGravitationable(obj: any): obj is Gravitationable {
  return typeof obj === 'object' && obj.gravitationalThreshold !== null;
}

