import { PositionType } from "../mixins/positional";
import GameContext from "../core/gameContext";

export type RenderFn = (gameContext: GameContext) => void;

class RenderElement {
  private _render: RenderFn;
  positionType: PositionType = 'normal';
  children: RenderElement[] = [];

  // with higer zIndex, render elemets will render last, this means rendering on top of other elements
  zIndex: number = 1;

  constructor(render: RenderFn) {
    this._render = render;
  }

  render(gameContext: GameContext) {
    this._render(gameContext);
    this.children.forEach(child => {
      child.render(gameContext)
    })
  }
}

export default RenderElement;

export class NoRender extends RenderElement {
  constructor() {
    super(() => { })
  }
}