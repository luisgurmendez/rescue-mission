import Vector from "../../physics/vector";
import GameContext from "../../core/gameContext";
import RenderUtils from "../../render/utils";
import { Dimensions } from "../../core/canvas";

class RocketRenderUtils {

  static renderInfo(context: GameContext) {
    const { rocket, canvasRenderingContext, canvasRenderingContext: { canvas } } = context;
    canvasRenderingContext.font = "15px Arial";
    canvasRenderingContext.fillStyle = "#FFF";
    const text = `speed: ${rocket.speed.toFixed(0)}  ,  position: (${rocket.position.x.toFixed(0)},${rocket.position.y.toFixed(0)})`
    const textWidth = canvasRenderingContext.measureText(text).width;
    canvasRenderingContext.fillText(text, Dimensions.w - (textWidth + 20), Dimensions.h - 20);
  }

  static renderLaunchDirectional = (context: GameContext) => {
    const { canvasRenderingContext, rocket } = context;
    canvasRenderingContext.strokeStyle = "#FFF";
    // Launch line
    canvasRenderingContext.save();
    canvasRenderingContext.beginPath();
    canvasRenderingContext.setLineDash([5, 15]);
    canvasRenderingContext.moveTo(rocket.position.x, rocket.position.y);
    const line = rocket.direction.clone().scalar(1000).add(rocket.position);
    canvasRenderingContext.lineTo(line.x, line.y);
    canvasRenderingContext.stroke();
    canvasRenderingContext.restore();
    canvasRenderingContext.font = "7px Arial";
    canvasRenderingContext.fillStyle = "#FFF";
    canvasRenderingContext.fillText(`${(rocket.direction.angleTo(new Vector(0, -1)) * 180 / Math.PI).toFixed(2)}º`, rocket.position.x + 10, rocket.position.y);
  }

  static renderRocket = (context: GameContext) => {
    const { rocket } = context;
    const canvasRenderingContext = context.canvasRenderingContext;
    canvasRenderingContext.strokeStyle = '#FFF'

    if (rocket.isColliding) {
      canvasRenderingContext.strokeStyle = '#F00'
    }

    // rotate
    canvasRenderingContext.translate(rocket.position.x, rocket.position.y);
    canvasRenderingContext.rotate(rocket.direction.angleTo(new Vector(0, -1)))
    canvasRenderingContext.translate(-rocket.position.x, -rocket.position.y);

    // Renders the rocket pixel art 
    // TODO: improve
    const canvas = RenderUtils.generatePixelArt(
      "eeeccd34722449c89b568",
      "@@@JI@@@@@PJIA@@@@R|OI@@@@b|I@@@@b|I@@@@b|I@@@@b|I@@@@RJII@@@@RJiI@@@@RJII@@@@RJIy@@@XRJIyF@@[RJIyw@@[RJIyw@@[RJIyw@@[`ddxw@",
      16);

    canvasRenderingContext.translate(-1, -1);
    canvasRenderingContext.drawImage(canvas, rocket.position.x - rocket.collisionMask.w / 2, rocket.position.y - rocket.collisionMask.h / 2);
    // RenderUtils.renderCircle(canvasRenderingContext, rocket.position, new Circle(1));
    // RenderUtils.renderRectangle(canvasRenderingContext, rocket.position, rocket.collisionMask);
  }

}

export default RocketRenderUtils;
