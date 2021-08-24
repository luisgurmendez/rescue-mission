import GameContext from "core/gameContext";

interface Renderable {
  // TODO: should objects render themselves in the canvas or should they return a RenderElement obj or smth like that?
  render(context: GameContext): void;
}

export function isRenderable(object: any): object is Renderable {
  return typeof object === 'object' && object.render !== undefined;
}

export default Renderable;