import Level from "../core/level";
import Planet from "../objects/planet/planet";
import BaseObject from "../objects/baseObject";
import Vector from "../physics/vector";
import LandingOnTargetPlanetObjective from "./shared/LandingOnTargetPlanetObjective";
import generateAstronauts from "./shared/generateAstronauts";
import Color from "../utils/color";
import { targetPlanetColor } from "./shared/targetPlanetColor";

// Moons!
function generate() {
  const earth = new Planet(new Vector(0, 0), 3000, 100);

  const mars = new Planet(new Vector(0, -780), 2000, 75);
  mars.color = targetPlanetColor;

  const moon = new Planet(new Vector(0, 150), 0, 5);
  moon.isMoon = true;
  moon.color = Color.white();
  moon.velocity = new Vector(55, 0);

  const moon2 = new Planet(new Vector(0, -150), 0, 5);
  moon2.isMoon = true;
  moon2.color = Color.white();
  moon2.velocity = new Vector(-55, 0);


  const moon3 = new Planet(new Vector(0, 150), 0, 5);
  moon3.isMoon = true;
  moon3.color = Color.white();
  moon3.velocity = new Vector(55, 0);


  const moon4 = new Planet(new Vector(250, 0), 0, 5);
  moon4.isMoon = true;
  moon4.color = Color.white();
  moon4.velocity = new Vector(0, 60);


  const moon5 = new Planet(new Vector(-250, 0), 0, 5);
  moon5.isMoon = true;
  moon5.color = Color.white();
  moon5.velocity = new Vector(0, -60);


  const moon6 = new Planet(new Vector(300, 150), 0, 5);
  moon6.isMoon = true;
  moon6.color = Color.white();
  moon6.velocity = new Vector(-1, 1).normalize().scalar(30);


  const moon7 = new Planet(new Vector(-300, -150), 0, 5);
  moon7.isMoon = true;
  moon7.color = Color.white();
  moon7.velocity = new Vector(1, -1).normalize().scalar(30)

  const astronauts = generateAstronauts(new Vector(0, -200), new Vector(150, 0), new Vector(-150, 0))
  const objects: BaseObject[] = [
    earth,
    mars,
    moon,
    moon2,
    moon3,
    moon4,
    moon5,
    moon6,
    moon7,
    // whiteDwarf,
    // whiteDwarf2,
    ...astronauts
  ];
  const level = new Level(objects, new LandingOnTargetPlanetObjective(mars));
  level.rocket.position = new Vector(0, -110);
  level.camera.follow(level.rocket);
  return level;
}

export default generate;
