import Stepable from "behaviors/stepable";
import GameContext from "core/gameContext";

/**
 * In charge of controlling the win/lose conditions.
 */
class GameConditionsController implements Stepable {

  static MAX_LANDING_SPEED = 40;

  step(context: GameContext): void {
    this.won(context);
    this.loose(context);
  }

  private won(gameContext: GameContext) {
    const { rocket } = gameContext;
    if (this.isCollidingWithTargetPlanet(gameContext)) {
      if (this.isLandingInACorrectAngle(gameContext) && this.isLandingSlowly(gameContext)) {
        rocket.land()
      } else {
        rocket.explode(gameContext);
      }
    }
  }

  private loose(gameContext: GameContext) {
    const { rocket } = gameContext;
    if (rocket.isColliding && !this.isCollidingWithTargetPlanet(gameContext)) {
      rocket.explode(gameContext);
    }
  }

  private isCollidingWithTargetPlanet(gameContext: GameContext) {
    const { rocket, targetPlanet } = gameContext;
    const _targetPlanet = rocket.collisions.find(c => c === targetPlanet);
    return _targetPlanet !== undefined;
  }

  private isLandingInACorrectAngle(gameContext: GameContext) {
    const { rocket, targetPlanet } = gameContext;
    const v = rocket.position.clone().sub(targetPlanet.position);
    return Math.abs(rocket.direction.angleTo(v)) < 0.2
  }

  private isLandingSlowly(gameContext: GameContext) {
    return gameContext.rocket.speed < GameConditionsController.MAX_LANDING_SPEED
  }

}

export default GameConditionsController;
