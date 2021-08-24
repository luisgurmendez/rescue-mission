import Vector from "../physics/vector";
import BaseObject from "./baseObject";
import GameObject from "./gameObject";
import { ObjectType } from "./objectType";
import { Shape } from "./shapes";

abstract class CollisionableObject<S extends Shape = Shape> extends GameObject {
  public collisionMask: S;
  constructor(collisionMask: S, position: Vector, id?: string) {
    super(position, id);
    this.collisionMask = collisionMask;
    this.type = ObjectType.COLLISIONABLE_OBJECT;
  }

  onCollision(obj: CollisionableObject) { }
}

export default CollisionableObject;

export function isCollisionableObject(obj: BaseObject): obj is CollisionableObject {
  return obj instanceof CollisionableObject
}
