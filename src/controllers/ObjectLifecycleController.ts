import { isStepable } from "../behaviors/stepable";
import BaseObject from "../objects/baseObject";
import GameContext from "../core/gameContext";
import { isInitializable } from "../behaviors/initializable";
import { isDisposable } from "../behaviors/disposable";

class ObjectLifecycleController {

  initialize(gameContext: GameContext) {
    const { objects } = gameContext;

    objects.forEach(obj => {
      if (isInitializable(obj) && obj.shouldInitialize) {
        obj.init(gameContext);
        obj.shouldInitialize = false;
      }
    })
  }

  step(gameContext: GameContext) {
    const objects = gameContext.objects;
    objects.forEach(obj => {
      if (isStepable(obj)) {
        obj.step(gameContext)
      }
    })
  }

  dispose(objects: BaseObject[]): BaseObject[] {
    const notDisposedObjects = objects.filter(obj => {
      if (isDisposable(obj) && obj.shouldDispose) {
        obj.dispose && obj.dispose()
        return false;
      }
      return true;
    })

    return notDisposedObjects;
  }
}

export default ObjectLifecycleController;