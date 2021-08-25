import { CollisionableMixin } from "./collisionable";
import { PhysicableMixin } from "./physics";
import { PositionableMixin } from "./positional";

export type GConstructor<T = {}> = new (...args: any[]) => T;

class Obj { }

const R = PhysicableMixin(PositionableMixin(CollisionableMixin(Obj)));

class Rock extends R { }

const a = new Rock();
