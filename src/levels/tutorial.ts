import Level, { LevelObjective } from "../core/level";
import Planet from "../objects/planet/planet";
import BaseObject from "../objects/baseObject";
import Vector from "../physics/vector";
import GameContext from "../core/gameContext";
import RenderElement from "../render/renderElement";
import { PositionableMixin } from "../mixins/positional";
import LandingOnTargetPlanetObjective from "./shared/LandingOnTargetPlanetObjective";
import TimedTextSequence from "../objects/timedTextSequence";
import Astronaut from "../objects/astronaut/astronaut";
import generateAstronauts from "./shared/generateAstronauts";
import Color from "../utils/color";
import { objectiveTexts } from "../menu/menu";
import { targetPlanetColor } from "./shared/targetPlanetColor";

/**
 * Tutorial 1 - Pass the altitude mark
 */

class LandingAndAltitudeObjective implements LevelObjective {

  private landingObjective: LandingOnTargetPlanetObjective;
  private hasPassedAltitudeMark = false;
  private mark: number;

  constructor(target: Planet, mark: number) {
    this.mark = target.collisionMask.radius + mark;
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
  const earth = new Planet(new Vector(0, 0), 6000, 150)
  earth.color = targetPlanetColor;
  const altitudeMarkObj = new AltitudeMark(new Vector(earth.position.x - 30, earth.position.y - earth.collisionMask.radius), altitudeMark);
  const astronauts = generateAstronauts(new Vector(0, -230), new Vector(0, -380), new Vector(0, -470))
  const objectiveInstructions = new TimedTextSequence(["Your first mission is to pass the line mark,", "and make a safe landing.", "Good luck!"]);

  const objects: BaseObject[] = [
    earth,
    altitudeMarkObj,
    objectiveInstructions,
    ...astronauts
  ];
  const level = new Level(objects, new LandingAndAltitudeObjective(earth, altitudeMark));
  level.rocket.position = new Vector(0, -160);
  level.init = async () => {
    level.camera.follow(level.rocket);
    level.camera.zoom = 2.5;
  };
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
      canvasRenderingContext.strokeStyle = '#BBB';
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