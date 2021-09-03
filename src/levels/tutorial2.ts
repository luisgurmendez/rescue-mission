
import Level from "../core/level";
import Planet from "../objects/planet/planet";
import BaseObject from "../objects/baseObject";
import Vector from "../physics/vector";
import { WinningCondition } from '../controllers/GameConditionsController';
import GameContext from "../core/gameContext";
import Astronaut from "../objects/astronaut/astronaut";
import { wait } from "../utils/async";
import RenderElement from "../render/renderElement";
import { PositionableMixin } from "../mixins/positional";


/**
 * Tutorial 2 - The dark side of the moon.
 */

// TODO implement 
class TutorialExtraWinningCondition implements WinningCondition {

  radius: number

  constructor(radius: number) {
    this.radius = radius;
  }

  step(context: GameContext): void {
  }

  satisfiesCondition = () => {
    return true
  };
}

function generate() {
  const earth = new Planet(new Vector(0, 0), 2000, 200)
  const mark = new LandingMark(new Vector(earth.position.x, earth.position.y - earth.collisionMask.radius), earth.collisionMask.radius);
  const objects: BaseObject[] = [
    earth,
    mark,
  ];

  const level = new Level(objects, earth);
  //  level.extraWinningCondition = new TutorialExtraWinningCondition(altitudeMark);
  level.rocket.position = new Vector(0, -earth.collisionMask.radius - 10);
  level.camera.follow(level.rocket);

  return level;

}

const LandingMarkMarkMixin = PositionableMixin(BaseObject);

class LandingMark extends LandingMarkMarkMixin {

  position: Vector
  radius: number;

  constructor(position: Vector, radius: number) {
    super();
    this.position = position;
    this.radius = radius;
  }

  render() {
    const renderFn = (context: GameContext) => {
      const { canvasRenderingContext } = context;
      canvasRenderingContext.beginPath();
      canvasRenderingContext.setLineDash([5, 15]);
      canvasRenderingContext.strokeStyle = '#CCC';
      canvasRenderingContext.moveTo(this.position.x, this.position.y);
      canvasRenderingContext.bezierCurveTo(
        this.position.x - this.radius * 3,
        this.position.y + this.radius / 4,
        this.position.x - this.radius * 2,
        this.position.y + this.radius * 3,
        this.position.x,
        this.position.y + this.radius * 2
      )

      canvasRenderingContext.stroke();

      canvasRenderingContext.beginPath();

      // Since planet is in position 0,0 we can rotate without translate.
      canvasRenderingContext.rotate(Math.PI / 2 - Math.PI / 4)
      canvasRenderingContext.arc(this.position.x, this.position.y + this.radius, this.radius, 0, Math.PI / 2);
      canvasRenderingContext.stroke();

    }
    const renderElement = new RenderElement(renderFn);
    return renderElement;
  }

}

export default generate;
