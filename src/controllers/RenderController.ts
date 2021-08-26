import { Rectangle } from "../objects/shapes";
import Vector from "../physics/vector";
import RenderUtils from "../utils/renderUtils";
import GameContext from "../core/gameContext";
import { isRenderable } from "../objects/Renderable";
class RenderController {

  render(gameContext: GameContext) {
    const { canvasRenderingContext, camera } = gameContext;
    this.clearCanvas(canvasRenderingContext);

    // Renders background
    canvasRenderingContext.fillStyle = "#000";
    RenderUtils.renderRectangle(canvasRenderingContext,
      new Vector(0, 0),
      new Rectangle(canvasRenderingContext.canvas.width * 2, canvasRenderingContext.canvas.height * 2)
    )
    canvasRenderingContext.fill();

    // Renders camera position
    canvasRenderingContext.font = "30px Arial";
    canvasRenderingContext.fillStyle = "#FFF";
    canvasRenderingContext.fillText(`(${gameContext.camera.position.x.toFixed(0)},${gameContext.camera.position.y.toFixed(0)})`, 80, 30);

    this.safetlyRender(canvasRenderingContext, () => {
      canvasRenderingContext.scale(camera.zoom, camera.zoom);
      canvasRenderingContext.translate(gameContext.camera.position.x, gameContext.camera.position.y)
      const objects = gameContext.objects;
      objects.forEach(obj => {
        if (isRenderable(obj)) {
          this.safetlyRender(canvasRenderingContext, () => {
            obj.render(gameContext);
          })
        }
      })
    })
  }

  private clearCanvas(canvasRenderingContext: CanvasRenderingContext2D) {
    const canvas = canvasRenderingContext.canvas;
    canvasRenderingContext.clearRect(-1, -1, canvas.width + 1, canvas.height + 1);
  }

  private safetlyRender(canvasRenderingContext: CanvasRenderingContext2D, render: () => void) {
    canvasRenderingContext.save();
    render();
    canvasRenderingContext.restore();
  }
}

export default RenderController;
