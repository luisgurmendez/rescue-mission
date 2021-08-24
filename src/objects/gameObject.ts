import Vector from "../physics/vector";
import BaseObject from "./baseObject";
import { ObjectType } from "./objectType";

abstract class GameObject extends BaseObject {
  // The center position of a game object
  public position: Vector;
  constructor(position: Vector, id?: string) {
    super(id)
    this.position = position;
    this.type = ObjectType.GAME_OBJECT
  }
}

export default GameObject;
