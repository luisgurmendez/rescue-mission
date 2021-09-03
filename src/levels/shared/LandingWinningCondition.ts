import GameContext from "../../core/gameContext";
import { WinningCondition } from "./WinningCondition";

// class LandingWinningCondition implements WinningCondition {

//   MAX_LANDING_SPEED = 40;
//   MAX_LANDING_ANGLE = 0.4;

//   satisfiesCondition = () => {
//     return this.hasPassedAltitudeMark
//   };


//   step(context: GameContext): void {
//     if (!this.hasWonOrLose) {
//       this.checkWon(context);
//       this.checkLose(context);
//     }
//   }

//   private checkWon(gameContext: GameContext) {
//     const { rocket } = gameContext;
//     if (this.isCollidingWithTargetPlanet(gameContext)) {
//       if (
//         this.isLandingInACorrectAngle(gameContext) &&
//         this.isLandingSlowly(gameContext) &&
//         this.hasSatisfiedLevelSpecificCondition(gameContext)
//       ) {
//         rocket.land()
//       } else {
//         rocket.explode(gameContext);
//       }
//       // this.hasWonOrLose = true
//     }
//   }

//   private hasSatisfiedLevelSpecificCondition(gameContext: GameContext) {
//     const { extraWinningCondition } = gameContext;
//     return extraWinningCondition === null || extraWinningCondition.satisfiesCondition();
//   }

//   private checkLose(gameContext: GameContext) {
//     const { rocket } = gameContext;
//     if (rocket.isColliding && !this.isCollidingWithTargetPlanet(gameContext)) {
//       rocket.explode(gameContext);
//       // this.hasWonOrLose = true
//     }
//   }

//   private isCollidingWithTargetPlanet(gameContext: GameContext) {
//     const { rocket, targetPlanet } = gameContext;
//     const _targetPlanet = rocket.collisions.find(c => c === targetPlanet);
//     return _targetPlanet !== undefined;
//   }

//   isLandingInACorrectAngle(gameContext: GameContext) {
//     const { rocket, targetPlanet } = gameContext;
//     const v = rocket.position.clone().sub(targetPlanet.position);
//     return Math.abs(rocket.direction.angleTo(v)) < this.MAX_LANDING_ANGLE
//   }

//   isLandingSlowly(gameContext: GameContext) {
//     return gameContext.rocket.speed < this.MAX_LANDING_SPEED
//   }

// }