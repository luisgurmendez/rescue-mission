import { LevelObjective } from "../../core/level";
import GameContext from "../../core/gameContext";

class LandingOnTargetPlanetObjective implements LevelObjective {

  private _completed = false;

  completed() {
    return this._completed;
  }

  step(context: GameContext): void {
    const { rocket, targetPlanet } = context;

    if (!rocket.hasExploded && rocket.hasLanded && rocket.landedOnPlanet === targetPlanet) {
      this._completed = true;
    }
  }
}

export default LandingOnTargetPlanetObjective;
