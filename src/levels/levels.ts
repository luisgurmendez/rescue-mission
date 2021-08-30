import Level from "../core/level";
import Moon from "../objects/planet/moon";
import Planet from "../objects/planet/planet";
import BaseObject from "../objects/baseObject";
import Vector from "../physics/vector";

export function generateTutorialLevel() {

  const planet1 = new Planet(new Vector());
  const moon = new Moon(new Vector(0, 200));

  const objects: BaseObject[] = [
    planet1,
    moon,
  ];

  const level = new Level(objects);
  level.rocket.position = new Vector(0, 400);
  return level;
}