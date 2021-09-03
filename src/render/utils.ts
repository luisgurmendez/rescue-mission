import { Circle, Rectangle } from "../objects/shapes";
import Vector from "../physics/vector";

class RenderUtils {

  static renderCircle(
    canvasRenderingContext: CanvasRenderingContext2D,
    position: Vector,
    circle: Circle,
  ) {
    canvasRenderingContext.beginPath();
    canvasRenderingContext.arc(position.x, position.y, circle.radius, 0, 2 * Math.PI);
    canvasRenderingContext.stroke();
  }

  static renderRectangle(
    canvasRenderingContext: CanvasRenderingContext2D,
    position: Vector,
    rectangle: Rectangle,

  ) {
    canvasRenderingContext.beginPath();
    canvasRenderingContext.rect(position.x - rectangle.w / 2, position.y - rectangle.h / 2, rectangle.w, rectangle.h);
    canvasRenderingContext.stroke();
  }

  static renderText() {

  }


  static generatePixelArt(colors: string, pixelArt: string, size: number = 16) {

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const canvasRenderingContext = canvas.getContext('2d');


    if (canvasRenderingContext !== null) {
      const points: number[] = [];
      pixelArt.replace(/./g, a => {
        const charCode = a.charCodeAt(0)
        points.push(charCode & 7);
        points.push((charCode >> 3) & 7);
        return '';
      })
      for (let j = 0; j < size; j++) {
        for (let i = 0; i < size; i++) {
          if (points[j * size + i]) {
            canvasRenderingContext.fillStyle = "#" + colors.substr(3 * (points[j * size + i] - 1), 3);
            canvasRenderingContext.fillRect(i, j, 1, 1);
          }
        }
      }
    }
    return canvas;
  }

  // static generatePixelArt2() {
  //   const c = a.getContext`2d` // ctx
  //   const C = "eee000222444888355ccc" // color palette (you can remove the colors you didn't use to save bytes)
  //   const P = []; "@@@@@@@@@@@@@@@@@@@@@pRRRR@@@@@@@@@@@^kmmeF@@@@@@@@@@bMIIi\@@@@@@@@@^LIIII]C@@@@@@@@^iddddeB@@@@@@@@^aRRRRmB@@@@@@@@^aRRRRmB@@@@@@@@^aRRRRmB@@@@@@@@^aRRRRmB@@@@@@@@^MIIIIeC@@@@@@@@pkIIIi\@@@@@@@@@@cMIIas@@@@@@@@@@pjmmU@@@@@@@@@@@`}_F@@@@@@@@@@jIyOis@@@@@@@@@PMIyOIeB@@@@@@@plOIIyot@@@@@@@P}yMIIIuC@@@@@@POMIIIIaC@@@@@@PMLIIIIdgC@@@@@@PljIIIideC@@@@@@PlbMUzideC@@@@@@P[bMUziTSC@@@@@@pvbMTziT@@@@@@@@@@bMTzit@@@@@@@@@@bMTzit@@@@@@@@@@cmTbmt@@@@@@@@@XmmTbmmB@@@@@@@@PRRRRRRB@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@".replace(/./g, a => { z = a.charCodeAt(), P.push(z & 7), P.push((z >> 3) & 7) }) // pixel decoding
  //   const S = 32; for (j = 0; j < S; j++)for (i = 0; i < S; i++)if (P[j * S + i]) c.fillStyle = "#" + C.substr(3 * (P[j * S + i] - 1), 3), c.fillRect(i, j, 1, 1)


  // }








  static renderVector() {

    // function canvas_arrow(context, fromx, fromy, tox, toy) {
    //   var headlen = 10; // length of head in pixels
    //   var dx = tox - fromx;
    //   var dy = toy - fromy;
    //   var angle = Math.atan2(dy, dx);
    //   context.moveTo(fromx, fromy);
    //   context.lineTo(tox, toy);
    //   context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    //   context.moveTo(tox, toy);
    //   context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    // }



  }

}

export default RenderUtils;