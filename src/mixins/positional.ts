import Vector from "../physics/vector";
import { GConstructor } from "./shared";

export interface Positionable {
  position: Vector;
}

export type PositionableConstructor = GConstructor<Positionable>;

export function PositionableMixin<TBase extends GConstructor>(Base: TBase): PositionableConstructor & TBase {
  return class M extends Base implements Positionable {
    position: Vector = new Vector();
    constructor(...args: any[]) {
      super(args);
    }
  };
}

