import GameContext from "../core/gameContext";
import { isRenderable } from "../behaviors/renderable";
import RenderElement from "../render/renderElement";
import Vector from "../physics/vector";
import { Rectangle } from "../objects/shapes";
import RenderUtils from "../render/utils";

class RenderController {

  render(gameContext: GameContext) {
    const { canvasRenderingContext, camera, objects } = gameContext;
    const { canvas } = canvasRenderingContext;
    const renderableObjects = objects.filter(isRenderable).filter(obj => obj.id !== 'background');
    const background = objects.find(obj => obj.id === 'background');


    const renderElements: RenderElement[] = [];
    renderableObjects.forEach(obj => {
      if (isRenderable(obj)) {
        const renderElement = obj.render();
        const renderElementRecursiveChildrens: RenderElement[] = [];
        extractRenderElementChildren(renderElement, renderElementRecursiveChildrens);
        renderElements.push(renderElement);
        renderElements.push(...renderElementRecursiveChildrens);
      }
    });

    const overlayRenderElements = renderElements.filter(element => element.positionType === 'overlay');
    const normalRenderElements = renderElements.filter(element => element.positionType === 'normal');


    // Rendering
    this.clearCanvas(canvasRenderingContext);

    if (background) {
      this.safetlyRender(canvasRenderingContext, () => {
        const backgroundRenderElement = background.render();
        backgroundRenderElement.render(gameContext);
      })
    }

    // render normal elements..
    this.safetlyRender(canvasRenderingContext, () => {
      canvasRenderingContext.translate(canvas.width / 2, canvas.height / 2)
      canvasRenderingContext.scale(camera.zoom, camera.zoom);
      canvasRenderingContext.translate(-camera.position.x, -camera.position.y)

      // Make the center of the screen aligned with the camera's position
      normalRenderElements.forEach(element => {
        if (isRenderable(element)) {
          this.safetlyRender(canvasRenderingContext, () => {
            element.render(gameContext);
          })
        }
      })
    })

    // render overlay elements.
    overlayRenderElements.forEach(element => {
      this.safetlyRender(canvasRenderingContext, () => {
        element.render(gameContext)
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

function extractRenderElementChildren(renderElement: RenderElement, acc: RenderElement[]): RenderElement[] {

  if (renderElement.children.length === 0) {
    return acc;
  }

  renderElement.children.forEach(re => {
    acc.push(re);
    extractRenderElementChildren(re, acc);
  })

  return [];
}

