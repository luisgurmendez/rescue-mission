import RenderUtils from "../../render/utils";
import GameContext from "../../core/gameContext";
import Vector from "../../physics/vector";
import Astronaut from "./astronaut";

class AstronautRenderUtils {

  static renderAstronaut = (context: GameContext, astronaut: Astronaut) => {
    const canvasRenderingContext = context.canvasRenderingContext;
    canvasRenderingContext.strokeStyle = '#FFF'

    // rotate
    canvasRenderingContext.translate(astronaut.position.x, astronaut.position.y);
    canvasRenderingContext.rotate(astronaut.direction.angleTo(new Vector(1, 0)))
    canvasRenderingContext.translate(-astronaut.position.x, -astronaut.position.y);

    const canvas = RenderUtils.generatePixelArt(
      "eee000222444888355ccc",
      // "@@X[[C@@@@{II_@@@XKRRYC@@XQRRJC@@XWRRzC@@XORRyC@@[KIIY[@XMimmMiCkIIyOII]KYIIIIKY[_IaLI{[`[OYKy[D@XOYKyC@@[OYKy[@XIIYKIIC`[[[[[[D",
      // "@@X[[C@@@@{II_@@@XKRRYC@@XQRRJC@@XWRRzC@@XORRyC@@[KIIY[@XMimmMiCkIIyOII]KYIIIIKY[_IIII{[`[OIIy[D@XOYKyC@@[OCXy[@XIYCXKIC`[[@@[[D",
      // "@@X[[C@@@@{II_@@@XKRRYC@@XQRJJC@@XWRRzC@@XORRyC@@[KIIY[@XMimmMiCkIIyOII]KYIIIIKY[_IIII{[X[OIIy[C@XOYKyC@@[OCXy[@XIYCXKICX[[@@[[C",
      // "@@X[[C@@@@{II_@@@XKRRYC@@XQRJJC@@XWRRzC@@XORRyC@@[KIIY[@XMimmMiCkIIyOII]{YLIIaK_[[LIIa[[@@LaLa@@@XOYKyC@@[OCXy[@XIYCXKICX[[@@[[C",
      // "@@X[[C@@@@{II_@@@XKRRYC@@XQRJJC@@XWRRzC@@XORRyC@@[KIIY[@XMimmMiCkIIyOII]{YLIIaK_[[LIIa[[@@LiMa@@@XOYKyC@@[O[[y[@XIiCXMICX[[CX[[C",
      "@@X[[C@@@@{II_@@@XKRRYC@@XQRJJC@@XWRRzC@@XORRyC@@[KIIY[@XMimmMiCkIIyOII]{YLIIaK_[[LIIa[[@@LiMa@@@XOYKyC@@[O[[y[@XMiCXMiCX[[CX[[C",
      16);


    canvasRenderingContext.drawImage(
      canvas,
      astronaut.position.x - astronaut.collisionMask.w / 2,
      astronaut.position.y - astronaut.collisionMask.h / 2,
      astronaut.collisionMask.w,
      astronaut.collisionMask.h
    );
  }
}


export default AstronautRenderUtils;
