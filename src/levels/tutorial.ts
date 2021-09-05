import Level, { LevelObjective } from "../core/level";
import Planet from "../objects/planet/planet";
import BaseObject from "../objects/baseObject";
import Vector from "../physics/vector";
import GameContext from "../core/gameContext";
import RenderElement from "../render/renderElement";
import { PositionableMixin } from "../mixins/positional";
import LandingOnTargetPlanetObjective from "./shared/LandingOnTargetPlanetObjective";

/**
 * Tutorial 1 - Pass the altitude mark
 */

class LandingAndAltitudeObjective implements LevelObjective {

  private landingObjective: LandingOnTargetPlanetObjective;
  private hasPassedAltitudeMark = false;
  private mark: number;

  constructor(target: Planet, mark: number) {
    this.mark = mark;
    this.landingObjective = new LandingOnTargetPlanetObjective(target)
  }

  step(context: GameContext): void {
    this.landingObjective.step(context);
    if (!this.hasPassedAltitudeMark) {
      if (context.rocket.position.y < -this.mark) {
        this.hasPassedAltitudeMark = true;
      }
    }
  }

  completed() {
    return this.landingObjective.completed() && this.hasPassedAltitudeMark;
  }
}

function generate() {
  const altitudeMark = 200;
  const earth = new Planet(new Vector(0, 0), 2000, 100)
  const altitudeMarkObj = new AltitudeMark(new Vector(earth.position.x - 30, earth.position.y - earth.collisionMask.radius), altitudeMark);
  const objects: BaseObject[] = [
    earth,
    altitudeMarkObj,
  ];
  const level = new Level(objects, new LandingAndAltitudeObjective(earth, altitudeMark));
  level.rocket.position = new Vector(0, -110);
  level.camera.follow(level.rocket);
  return level;

}

const AltitudeMarkMixin = PositionableMixin(BaseObject);

class AltitudeMark extends AltitudeMarkMixin {

  altitude: number;
  position: Vector
  constructor(position: Vector, altitude: number) {
    super();
    this.altitude = altitude;
    this.position = position;
  }

  render() {
    const renderFn = (context: GameContext) => {
      const { canvasRenderingContext } = context;
      canvasRenderingContext.beginPath();
      canvasRenderingContext.setLineDash([5, 15]);
      canvasRenderingContext.strokeStyle = '#333';
      canvasRenderingContext.moveTo(this.position.x, this.position.y);
      canvasRenderingContext.lineTo(this.position.x, this.position.y - this.altitude);
      canvasRenderingContext.lineTo(this.position.x + 50, this.position.y - this.altitude);
      canvasRenderingContext.stroke();
    }
    const renderElement = new RenderElement(renderFn);
    return renderElement;
  }

}

export default generate;