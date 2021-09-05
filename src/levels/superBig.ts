import Level from "../core/level";
import Planet from "../objects/planet/planet";
import BaseObject from "../objects/baseObject";
import Vector from "../physics/vector";
import LandingOnTargetPlanetObjective from "./shared/LandingOnTargetPlanetObjective";

function generate() {
  const earth = new Planet(new Vector(0, 0), 53000, 1500)
  const moon = new Planet(new Vector(0, -10000), 13000, 600)
  const objects: BaseObject[] = [
    earth,
    moon
  ];

  const level = new Level(objects, new LandingOnTargetPlanetObjective(earth));
  level.rocket.position = new Vector(0, -1510);
  level.camera.follow(level.rocket);

  return level;
}


export default generate;
