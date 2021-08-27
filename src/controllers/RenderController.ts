import { Rectangle } from "../objects/shapes";
import Vector from "../physics/vector";
import RenderUtils from '../render/utils';
import GameContext from "../core/gameContext";
import Renderable, { isRenderable } from "../behaviors/renderable";
import RenderElement from "../render/renderElement";

class RenderController {

  render(gameContext: GameContext) {
    const { canvasRenderingContext, camera, objects } = gameContext;
    const { canvas } = canvasRenderingContext;
    const renderableObjects = objects.filter(isRenderable);

    const renderElements: RenderElement[] = [];
    renderableObjects.forEach(obj => {
      if (isRenderable(obj)) {
        this.safetlyRender(canvasRenderingContext, () => {
          const renderElement = obj.render();
          renderElements.push(renderElement);
        })
      }
    });

    const overlayRenderElements = renderElements.filter(element => element.positionType === 'overlay');
    const normalRenderElements = renderElements.filter(element => element.positionType === 'normal');

    this.clearCanvas(canvasRenderingContext);

    // render overlay elements.
    overlayRenderElements.forEach(element => {
      this.safetlyRender(canvasRenderingContext, () => {
        element.render(gameContext)
      })
    })

    // render normal elements..
    this.safetlyRender(canvasRenderingContext, () => {
      canvasRenderingContext.scale(camera.zoom, camera.zoom);
      // Make the center of the screen aligned with the camera's position
      canvasRenderingContext.translate(camera.position.x + (canvas.width / 2), camera.position.y + (canvas.height / 2))
      normalRenderElements.forEach(element => {
        if (isRenderable(element)) {
          this.safetlyRender(canvasRenderingContext, () => {
            element.render(gameContext);
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
