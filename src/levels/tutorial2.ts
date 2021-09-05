
import Level, { LevelObjective } from "../core/level";
import Planet from "../objects/planet/planet";
import BaseObject from "../objects/baseObject";
import Vector from "../physics/vector";
import GameContext from "../core/gameContext";
import RenderElement from "../render/renderElement";
import { PositionableMixin } from "../mixins/positional";
import Color from "../utils/color";
import LandingObjective from "./shared/LandingOnTargetPlanetObjective";


/**
 * Tutorial 2 - Try landing in the dark side of the moon.
 */

class LandingOnOppositeSideObjective implements LevelObjective {

  private landingObjective: LandingObjective;
  radius: number
  isInTheBottomSectionOfThePlanet = false;

  constructor(target: Planet, radius: number) {
    this.radius = radius;
    this.landingObjective = new LandingObjective(target);
  }

  step(context: GameContext): void {
    const { rocket } = context;
    this.landingObjective.step(context);
    // Rocket is in the bottom of the center of the planet
    this.isInTheBottomSectionOfThePlanet = rocket.position.y > this.landingObjective.target.position.y
  }

  completed() {
    return this.landingObjective.completed() && this.isInTheBottomSectionOfThePlanet;
  }
}


function generate() {
  const earth = new Planet(new Vector(0, 0), 2000, 200);
  earth.hasRing = false;
  earth.color = new Color(255, 10, 20);
  const mark = new LandingMark(new Vector(earth.position.x, earth.position.y - earth.collisionMask.radius), earth.collisionMask.radius);
  const objects: BaseObject[] = [
    earth,
    mark,
  ];

  const level = new Level(objects, new LandingOnOppositeSideObjective(earth, earth.collisionMask.radius));
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
      canvasRenderingContext.arc(this.position.x, this.position.y + this.radius, this.radius, 0, Math.PI);
      canvasRenderingContext.stroke();

    }
    const renderElement = new RenderElement(renderFn);
    return renderElement;
  }

}

export default generate;
