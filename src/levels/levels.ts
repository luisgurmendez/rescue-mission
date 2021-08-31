import Level from "../core/level";
import Moon from "../objects/planet/moon";
import Planet from "../objects/planet/planet";
import BaseObject from "../objects/baseObject";
import Vector from "../physics/vector";

export function generateTutorialLevel() {

  const mars = new Planet(new Vector(), 1500, 100)
  const earth = new Planet(new Vector(0, -400), 2000, 150)
  const moon = new Moon(new Vector(0, 300));

  const objects: BaseObject[] = [
    mars,
    earth,
    moon,
  ];

  const level = new Level(objects, earth);
  level.rocket.position = new Vector(0, 800);
  return level;
}