import Renderable from "../behaviors/renderable";
import Stepable from "../behaviors/stepable";
import { NoRender } from "../render/renderElement";
import GameContext from "../core/gameContext";
import { ObjectType } from "./objectType";

class BaseObject implements Renderable, Stepable {

  public id: string;
  public type: ObjectType = ObjectType.BASE_OBJECT;

  constructor(id: string = generateId()) {
    this.id = id;
  }

  render() {
    return new NoRender();
  }

  step(gameContext: GameContext) { }

}

export default BaseObject;

function generateId() {
  const id = Math.round((Math.random() * 10000)).toString(16);
  return id;
}
