import { Rectangle } from "../objects/shapes";
import BaseObject from "../objects/baseObject";
import Camera from "./camera";
import SpaceBackground from "../objects/spaceBackground";
import Rocket from "../objects/rocket/rocket";
import Vector from "../physics/vector";
import Planet from "../objects/planet/planet";

class Level {

  objects: BaseObject[] = [];
  camera: Camera;
  worldDimensions: Rectangle;
  rocket: Rocket;

  constructor(objects: BaseObject[], target: Planet, worldDimensions: Rectangle = new Rectangle(4000, 4000)) {
    const background = new SpaceBackground();
    this.rocket = new Rocket(new Vector(), target);
    this.objects = objects;
    this.camera = new Camera();
    this.worldDimensions = worldDimensions;

    this.objects.push(...[background, this.rocket, this.camera]);
    // this.camera.follow(this.rocket);
  }

  init() { };

  dispose() { };

}


export default Level;