import Level from "../core/level";
import Planet from "../objects/planet/planet";
import BaseObject from "../objects/baseObject";
import Vector from "../physics/vector";
import LandingOnTargetPlanetObjective from "./shared/LandingOnTargetPlanetObjective";
import { wait } from "../utils/async";
import TimedTextSequence from "../objects/timedTextSequence";

function generate() {
  const earth = new Planet(new Vector(0, 0), 3000, 100);
  const mars = new Planet(new Vector(200, -180), 4000, 75);
  const jupiter = new Planet(new Vector(400, -480), 5000, 175);
  const objectiveText = new TimedTextSequence([{ text: 'Land here', duration: 3 }]);
  const objects: BaseObject[] = [
    earth,
    mars,
    jupiter,
    objectiveText
  ];
  const level = new Level(objects, new LandingOnTargetPlanetObjective(jupiter));
  level.rocket.position = new Vector(0, -110);
  level.camera.follow(level.rocket);
  level.init = async () => {
    await level.camera.flyTo(jupiter, 1);
    await wait(2)
    await level.camera.flyTo(level.rocket, 1);
    level.camera.follow(level.rocket);
  }
  return level;

}


export default generate;