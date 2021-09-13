import Level from "../core/level";
import Planet from "../objects/planet/planet";
import BaseObject from "../objects/baseObject";
import Vector from "../physics/vector";
import LandingOnTargetPlanetObjective from "./shared/LandingOnTargetPlanetObjective";
import generateAstronauts from "./shared/generateAstronauts";
import Color from "../utils/color";
import { targetPlanetColor } from "./shared/targetPlanetColor";

function generate() {
  const mars = new Planet(new Vector(0, 0), 4000, 200);
  const earth = new Planet(new Vector(0, 680), 4000, 120);
  earth.color = targetPlanetColor;

  const astronauts = generateAstronauts(new Vector(0, -300), new Vector(150, 400), new Vector(-150, 400))

  astronauts[0].velocity = new Vector(0, -30);
  astronauts[1].velocity = new Vector(10, 20);
  astronauts[2].velocity = new Vector(-10, 20);
  const objects: BaseObject[] = [
    earth,
    mars,
    ...astronauts
  ];
  const level = new Level(objects, new LandingOnTargetPlanetObjective(earth));
  level.rocket.position = new Vector(0, -210);
  return level;
}

export default generate;
