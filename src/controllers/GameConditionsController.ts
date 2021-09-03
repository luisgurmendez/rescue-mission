import Stepable from "behaviors/stepable";
import GameContext from "core/gameContext";

type LoseReason = 'tooFast' | 'improperAngle' | 'extra';

export interface WinningCondition extends Stepable {
  satisfiesCondition: () => boolean;
}

/**
 * In charge of controlling the win/lose conditions.
 */
class GameConditionsController implements Stepable {

  static MAX_LANDING_SPEED = 40;
  static MAX_LANDING_ANGLE = 0.4;
  private hasWonOrLose = false;

  step(context: GameContext): void {
    if (!this.hasWonOrLose) {
      this.checkWon(context);
      this.checkLose(context);
    }
  }

  private checkWon(gameContext: GameContext) {
    const { rocket } = gameContext;
    if (this.isCollidingWithTargetPlanet(gameContext)) {
      if (
        this.isLandingInACorrectAngle(gameContext) &&
        this.isLandingSlowly(gameContext) &&
        this.hasSatisfiedLevelSpecificCondition(gameContext)
      ) {
        rocket.land()
      } else {
        rocket.explode(gameContext);
      }
      this.hasWonOrLose = true
    }
  }

  private hasSatisfiedLevelSpecificCondition(gameContext: GameContext) {
    const { extraWinningCondition } = gameContext;
    return extraWinningCondition === null || extraWinningCondition.satisfiesCondition();
  }

  private checkLose(gameContext: GameContext) {
    const { rocket } = gameContext;
    if (rocket.isColliding && !this.isCollidingWithTargetPlanet(gameContext)) {
      rocket.explode(gameContext);
      this.hasWonOrLose = true
    }
  }

  private isCollidingWithTargetPlanet(gameContext: GameContext) {
    const { rocket, targetPlanet } = gameContext;
    const _targetPlanet = rocket.collisions.find(c => c === targetPlanet);
    return _targetPlanet !== undefined;
  }

  isLandingInACorrectAngle(gameContext: GameContext) {
    const { rocket, targetPlanet } = gameContext;
    const v = rocket.position.clone().sub(targetPlanet.position);
    return Math.abs(rocket.direction.angleTo(v)) < GameConditionsController.MAX_LANDING_ANGLE
  }

  isLandingSlowly(gameContext: GameContext) {
    return gameContext.rocket.speed < GameConditionsController.MAX_LANDING_SPEED
  }

}

export default GameConditionsController;



