import Vector from "../physics/vector";
import { GConstructor } from "./shared";

export type PositionType = 'overlay' | 'normal';

export interface Positionable {
  position: Vector;
  positionType: PositionType;
}

export type PositionableConstructor = GConstructor<Positionable>;

export function PositionableMixin<TBase extends GConstructor>(Base: TBase): PositionableConstructor & TBase {
  return class M extends Base implements Positionable {
    position: Vector = new Vector();
    positionType = 'normal' as PositionType;
  };
}

