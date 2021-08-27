import GameContext from "../core/gameContext";
import Vector from "../physics/vector";
import RenderUtils from "../render/utils";
import { PositionableMixin } from "../mixins/positional";
import RenderElement from "../render/renderElement";
import BaseObject from "./baseObject";
import { Rectangle } from "./shapes";

const BackgroundMixin = PositionableMixin(BaseObject)

class SpaceBackground extends BackgroundMixin {

  render() {
    const renderFn = (gameContext: GameContext) => {
      const { canvasRenderingContext } = gameContext;
      canvasRenderingContext.fillStyle = "#000";
      RenderUtils.renderRectangle(canvasRenderingContext,
        new Vector(0, 0),
        new Rectangle(canvasRenderingContext.canvas.width * 2, canvasRenderingContext.canvas.height * 2)
      )
      canvasRenderingContext.fill();
    }
    const renderElement = new RenderElement(renderFn);
    renderElement.positionType = 'overlay';
    return renderElement
  }

  step() { }
}

export default SpaceBackground;
