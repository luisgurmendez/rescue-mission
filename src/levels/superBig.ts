import Level from "../core/level";
import Planet from "../objects/planet/planet";
import BaseObject from "../objects/baseObject";
import Vector from "../physics/vector";
import LandingOnTargetPlanetObjective from "./shared/LandingOnTargetPlanetObjective";
import { Rectangle } from "../objects/shapes";

//TODO great idea needs to check values
function generate() {
  const earth = new Planet(new Vector(0, 0), 53000, 1500)
  const mars = new Planet(new Vector(0, -7400), 11000, 500)
  const objects: BaseObject[] = [
    earth,
    mars
  ];

  const level = new Level(objects, new LandingOnTargetPlanetObjective(earth), new Rectangle(20000, 20000));
  level.rocket.position = new Vector(0, -1510);


  // level.rocket.position = new Vector(-1508, 1010)
  // level.rocket.velocity = new Vector(-90, -201);
  // level.rocket.direction = new Vector(-0.45, -0.9).normalize();
  // (level.rocket as any).thruster.fuel = 429;
  // (level.rocket as any).hasLaunched = true;

  //   "velocity": {
  //       "x": -90.88797925091109,
  //       "y": -201.0541651075038
  //   },
  //   "acceleration": {
  //       "x": 24.216678496769276,
  //       "y": -16.284161315900143
  //   },
  //   "angularAcceleration": 0,
  //   "angularVelocity": 7.022882637617124,
  //   "direction": {
  //       "x": -0.4590693433838671,
  //       "y": -0.9167581725361186
  //   },


  level.camera.follow(level.rocket);

  return level;
}


export default generate;



// {
//   "type": 3,
//   "id": "rocket",
//   "position": {
//       "x": -1508.618309175777,
//       "y": 1010.0969130555033
//   },
//   "collisionMask": {
//       "w": 13,
//       "h": 16
//   },
//   "collisions": [],
//   "velocity": {
//       "x": -90.88797925091109,
//       "y": -201.0541651075038
//   },
//   "acceleration": {
//       "x": 24.216678496769276,
//       "y": -16.284161315900143
//   },
//   "angularAcceleration": 0,
//   "angularVelocity": 7.022882637617124,
//   "direction": {
//       "x": -0.4590693433838671,
//       "y": -0.9167581725361186
//   },
//   "mass": 549054,
//   "hasLaunched": true,
//   "hasLanded": false,
//   "hasExploded": false,
//   "landedOnPlanet": null,
//   "shouldDispose": false,
//   "thruster": {
//       "fuel": 429,
//       "thrustPower": 7607000,
//       "maxFuel": 1000
//   },
//   "secondaryThruster": {
//       "fuel": 203,
//       "thrustPower": 7607000,
//       "maxFuel": 300
//   }
// }