import Level from "../core/level";
import Planet from "../objects/planet/planet";
import BaseObject from "../objects/baseObject";
import Vector from "../physics/vector";

export function generateLevel1() {
  const mars = new Planet(new Vector(), 3000, 100)
  const earth = new Planet(new Vector(200, -400), 2000, 150)
  const moon = new Planet(new Vector(0, 300), 150, 4);
  moon.gravitationalThreshold = 0;
  moon.isMoon = true;
  moon.velocity = new Vector(30, 0);


  const objects: BaseObject[] = [
    mars,
    earth,
    moon,
  ];

  const level = new Level(objects, earth);
  level.rocket.position = new Vector(350, 300);

  return level;
}
