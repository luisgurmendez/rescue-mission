
import Level from "../core/level";
import Planet from "../objects/planet/planet";
import BaseObject from "../objects/baseObject";
import Vector from "../physics/vector";
import LandingOnTargetPlanetObjective from "./shared/LandingOnTargetPlanetObjective";
import generateAstronauts from "./shared/generateAstronauts";
import { targetPlanetColor } from "./shared/targetPlanetColor";
import { generateMoon } from "./shared/generators";


function generate() {
  const earth = new Planet(new Vector(0, 0), 4500, 140);
  earth.hasRing = false;
  earth.color = targetPlanetColor;

  const astronauts = generateAstronauts(new Vector(0, -220), new Vector(-80, -200), new Vector(-130, -165));
  const moon = generateMoon(new Vector(0, 240), new Vector(60, 0))
  const objects: BaseObject[] = [
    earth,
    moon,
    ...astronauts
  ];

  const level = new Level(objects, new LandingOnTargetPlanetObjective(earth));
  level.rocket.position = new Vector(0, -earth.collisionMask.radius - 10);
  level.camera.zoom = 1.6;
  return level;

}


export default generate;
