import Level from "../core/level";
import Planet from "../objects/planet/planet";
import BaseObject from "../objects/baseObject";
import Vector from "../physics/vector";
import LandingOnTargetPlanetObjective from "./shared/LandingOnTargetPlanetObjective";
import generateAstronauts from "./shared/generateAstronauts";
import { targetPlanetColor } from "./shared/targetPlanetColor";

function generate() {
  const earth = new Planet(new Vector(0, 100), 3000, 100);
  const jupiter = new Planet(new Vector(0, -780), 6500, 175);
  jupiter.color = targetPlanetColor;
  const jupiterMoon = new Planet(new Vector(0, -430), 0, 5);
  jupiterMoon.isMoon = true;
  jupiterMoon.velocity = new Vector(70, 0);
  const jupiterMoon2 = new Planet(new Vector(0, -1100), 0, 5);
  jupiterMoon2.isMoon = true;
  jupiterMoon2.velocity = new Vector(70, 0);
  const astronauts = generateAstronauts(new Vector(0, -300), new Vector(100, -600), new Vector(250, -800))
  const objects: BaseObject[] = [
    earth,
    jupiter,
    jupiterMoon,
    jupiterMoon2,
    ...astronauts
  ];
  const level = new Level(objects, new LandingOnTargetPlanetObjective(jupiter));
  level.rocket.position = new Vector(0, -10);
  level.camera.follow(level.rocket);
  return level;
}

export default generate;
