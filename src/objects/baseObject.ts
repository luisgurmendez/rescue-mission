import Stepable from "./Stepable";
import Renderable from './Renderable';
import GameContext from "../core/gameContext";
import { ObjectType } from "./objectType";

class BaseObject implements Stepable, Renderable {

  public id: string;
  public type: ObjectType = ObjectType.BASE_OBJECT;

  constructor(id: string = generateId()) {
    console.log('generating base obj with id', id);
    this.id = id;
  }

  render(context: GameContext) {
    throw new Error("Method not implemented.");
  }

  step(context: GameContext): void {
    throw new Error("Method not implemented.");
  }
}

export default BaseObject;

function generateId() {
  const id = Math.round((Math.random() * 10000)).toString(16);
  console.log(id)
  return id;
}
