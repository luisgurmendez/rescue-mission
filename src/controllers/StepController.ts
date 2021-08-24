import GameContext from "../core/gameContext";
import { isStepable } from "../objects/Stepable";

class StepController {

  step(gameContext: GameContext) {
    const objects = gameContext.objects;
    objects.forEach(obj => {
      if (isStepable(obj)) {
        obj.step(gameContext)
      }
    })
  }
}

export default StepController;
