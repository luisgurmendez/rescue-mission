

//  private checkIsColliding(context: GameContext) {
//   const collisions = context.collisions[this.id]
//   return collisions !== undefined && collisions.length > 0
// }

import { NullShape, Rectangle, Shape } from "../objects/shapes";
import { GConstructor } from "./shared";

export interface Collisionable {
  collisionMask: Shape;
  isColliding: boolean;
}

export type CollisionableConstructor = GConstructor<Collisionable>;

export function CollisionableMixin<TBase extends GConstructor>(Base: TBase): CollisionableConstructor & TBase {
  return class M extends Base implements Collisionable {
    collisionMask = new NullShape();
    // isColliding = false;
    constructor(...args: any[]) {
      super(args);
    }

    get isColliding() {
      return false
    }

  };
}

