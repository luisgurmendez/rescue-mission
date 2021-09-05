import Level, { LevelObjective } from "../core/level";
import Planet from "../objects/planet/planet";
import BaseObject from "../objects/baseObject";
import Vector from "../physics/vector";
import GameContext from "../core/gameContext";
import AstronautRescueObjective from "./shared/AstronautRescueObjective";
import Astronaut from "../objects/astronaut/astronaut";
import LandingOnTargetPlanetObjective from "./shared/LandingOnTargetPlanetObjective";

/**
 * Level 2 - To the rescue here I am!
 */

class LandingAndAstronautRescueObjective implements LevelObjective {

  private landingObjective: LevelObjective;
  private astronautRescueObjective: LevelObjective;

  constructor(target: Planet, numOfAstronauts: number) {
    this.astronautRescueObjective = new AstronautRescueObjective(numOfAstronauts);
    this.landingObjective = new LandingOnTargetPlanetObjective(target)
  }

  step(context: GameContext): void {
    this.landingObjective.step(context);
    this.astronautRescueObjective.step(context);
  }

  completed() {
    return this.landingObjective.completed() && this.astronautRescueObjective.completed();
  }
}

function generate() {
  const earth = new Planet(new Vector(0, 0), 2000, 100);
  const astronaut = new Astronaut(new Vector(230, -234));
  const astronaut2 = new Astronaut(new Vector(-421, 180));
  const objects: BaseObject[] = [
    earth,
    astronaut,
    astronaut2
  ];
  const level = new Level(objects, new LandingAndAstronautRescueObjective(earth, 2));
  level.rocket.position = new Vector(0, -110);
  level.camera.follow(level.rocket);
  return level;

}


export default generate;