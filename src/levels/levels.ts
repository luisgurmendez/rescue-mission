import Level from "../core/level";
import Planet from "../objects/planet/planet";
import BaseObject from "../objects/baseObject";
import Vector from "../physics/vector";
import { WinningCondition } from '../controllers/GameConditionsController';
import GameContext from "../core/gameContext";
import Astronaut from "../objects/astronaut/astronaut";
import { wait } from "../utils/async";

// Launch and land in the same planet
// Experimental SUPER BIG
// export function generateTutorialLevel() {
//   const earth = new Planet(new Vector(0, 0), 53000, 1500)
//   const moon = new Planet(new Vector(0, -10000), 13000, 600)
//   const objects: BaseObject[] = [
//     earth,
//     moon
//   ];

//   const level = new Level(objects, moon);
//   level.rocket.position = new Vector(0, -1510);
//   level.camera.follow(level.rocket);

//   return level;
// }

class TutorialExtraWinningCondition implements WinningCondition {

  private hasPassedAltitudeMark = false;
  private mark: number;

  constructor(mark: number) {
    this.mark = mark;
  }

  step(context: GameContext): void {

    if (!this.hasPassedAltitudeMark) {
      if (context.rocket.position.y < this.mark) {
        console.log(context.rocket.position.y, this.mark)
        console.log('passed altitude check!')
        this.hasPassedAltitudeMark = true;
      }
    }
  }

  satisfiesCondition = () => {
    return this.hasPassedAltitudeMark
  };

}

export function generateTutorialLevel() {
  const altitudeMark = -200;
  const earth = new Planet(new Vector(0, -400), 2000, 100)
  const astronaut = new Astronaut();

  const objects: BaseObject[] = [
    earth,
    astronaut
  ];

  const level = new Level(objects, earth);
  level.extraWinningCondition = new TutorialExtraWinningCondition(altitudeMark);
  level.rocket.position = new Vector(0, -110);
  // level.camera.follow(level.rocket);
  level.init = async () => {
    await wait(2);
    await level.camera.flyTo(earth.position)
    await wait(2);
    await level.camera.flyTo(astronaut.position)
    await wait(2);
    await level.camera.flyTo(level.rocket.position)
  }

  return level;

}

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
