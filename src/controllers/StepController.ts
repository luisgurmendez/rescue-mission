import { isStepable } from "../behaviors/stepable";
import GameContext from "../core/gameContext";

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
