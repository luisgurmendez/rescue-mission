



import { NullShape, Shape } from "../objects/shapes";
import { GConstructor } from "./shared";

export interface Collisionable<S extends Shape = Shape> {
  collisionMask: S;
  isColliding: boolean;
}

export type CollisionableConstructor<S extends Shape> = GConstructor<Collisionable<S>>;

// Double function so that we can have S specified explicitly in the first call, 
// and TBase is inferred from parameter value on the second call
export function CollisionableMixin<S extends Shape>() {
  return function <TBase extends GConstructor>(Base: TBase): CollisionableConstructor<S> & TBase {
    return class M extends Base implements Collisionable<S> {
      collisionMask = new NullShape() as unknown as S;
      isColliding = false;
      // isColliding = false;

      //  private checkIsColliding(context: GameContext) {
      //   const collisions = context.collisions[this.id]
      //   return collisions !== undefined && collisions.length > 0
      // }
    }
  }
}

export function isCollisionableObject(obj: any): obj is Collisionable {
  return typeof obj === 'object' && (obj as unknown as Collisionable).collisionMask !== undefined;
}
