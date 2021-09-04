import GameContext from "../core/gameContext";
import { ObjectType } from "../objects/objectType";
import Planet from "../objects/planet/planet";
import Rocket from "../objects/rocket/rocket";


// Updates the status of the rocket, lands it or explodes it.
class RocketStatusController {

  MAX_LANDING_SPEED = 40;
  MAX_LANDING_ANGLE = 0.4;

  step(context: GameContext) {
    const { rocket } = context;
    if (this.isRocketCollidingWithHardObject(rocket)) {
      const planetLandingAttempt = this.isRocketAttemptingToLand(rocket);
      if (planetLandingAttempt !== null) {
        if (this.isLandingInACorrectAngle(rocket, planetLandingAttempt) && this.isLandingSlowly(rocket)) {
          rocket.land(planetLandingAttempt);
        } else {
          rocket.explode(context);
        }
      } else {
        rocket.explode(context);
      }
    }

  }

  private isRocketAttemptingToLand(rocket: Rocket): Planet | null {
    let landAttempt: Planet | undefined = undefined
    landAttempt = rocket.collisions.find(col => col.type === ObjectType.PLANET) as Planet
    return landAttempt || null;
  }

  // Planets, Moons, Asteroids, ... it doesn't include Astronauts
  private isRocketCollidingWithHardObject(rocket: Rocket) {
    let colliding = false
    if (rocket.isColliding) {
      colliding = rocket.collisions.some(col => col.type === ObjectType.PLANET || col.type === ObjectType.ASTEROID)
    }

    return colliding;
  }

  private isLandingInACorrectAngle(rocket: Rocket, planet: Planet) {
    const v = rocket.position.clone().sub(planet.position);
    return Math.abs(rocket.direction.angleTo(v)) < this.MAX_LANDING_ANGLE
  }

  private isLandingSlowly(rocket: Rocket) {
    return rocket.speed < this.MAX_LANDING_SPEED
  }

}

export default RocketStatusController;
