import BaseObject from "./baseObject";
import GameObject from "./gameObject";
import { Shape } from "./shapes";

export function isCollisionableObject(obj: BaseObject): obj is CollisionableObject {
  return obj instanceof GameObject && (obj as unknown as Collisionable).collisionMask !== undefined;
}

interface Collisionable<S extends Shape = Shape> {
  collisionMask: S;
  onCollision?: (obj: CollisionableObject) => void;
}

type CollisionableObject<S extends Shape = Shape> = Collisionable<S> & GameObject;
export default CollisionableObject;