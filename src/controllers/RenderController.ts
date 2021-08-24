import GameContext from "../core/gameContext";
import { isRenderable } from "../objects/Renderable";
class RenderController {

  render(gameContext: GameContext) {
    const { canvasRenderingContext, camera } = gameContext;
    this.clearCanvas(canvasRenderingContext);
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
    canvasRenderingContext.clearRect(-1, -1, canvas.width, canvas.height);
  }

  private safetlyRender(canvasRenderingContext: CanvasRenderingContext2D, render: () => void) {
    canvasRenderingContext.save();
    render();
    canvasRenderingContext.restore();
  }
}

export default RenderController;
