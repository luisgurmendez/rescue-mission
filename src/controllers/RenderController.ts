import GameContext from "../core/gameContext";
import { isRenderable } from "../objects/Renderable";

class RenderController {

  render(gameContext: GameContext) {

    this.clearCanvas(gameContext.canvasRenderingContext);
    const objects = gameContext.objects;
    objects.forEach(obj => {
      if (isRenderable(obj)) {
        this.safetlyRender(gameContext.canvasRenderingContext, () => {
          obj.render(gameContext);
        })
      }
    })
  }

  private clearCanvas(canvasRenderingContext: CanvasRenderingContext2D) {
    const canvas = canvasRenderingContext.canvas;
    canvasRenderingContext.clearRect(0, 0, canvas.width, canvas.height);
  }

  private safetlyRender(canvasRenderingContext: CanvasRenderingContext2D, render: () => void) {
    canvasRenderingContext.save();
    render();
    canvasRenderingContext.restore();
  }
}

export default RenderController;

