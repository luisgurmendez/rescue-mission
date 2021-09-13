import Level from "../core/level";
import Planet from "../objects/planet/planet";
import BaseObject from "../objects/baseObject";
import Vector from "../physics/vector";
import LandingOnTargetPlanetObjective from "./shared/LandingOnTargetPlanetObjective";
import generateAstronauts from "./shared/generateAstronauts";
import { targetPlanetColor } from "./shared/targetPlanetColor";

function generate() {
  const earth = new Planet(new Vector(0, 0), 4000, 150)
  earth.color = targetPlanetColor;
  const astronauts = generateAstronauts(new Vector(0, -230), new Vector(0, -250), new Vector(0, -300))

  const objects: BaseObject[] = [
    earth,
    ...astronauts
  ];
  const level = new Level(objects, new LandingOnTargetPlanetObjective(earth))
  level.rocket.position = new Vector(0, -160);
  level.camera.zoom = 1.6;
  return level;

}



export default generate;