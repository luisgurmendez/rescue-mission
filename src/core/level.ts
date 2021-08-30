import { Rectangle } from "../objects/shapes";
import BaseObject from "../objects/baseObject";
import Camera from "./camera";
import SpaceBackground from "../objects/spaceBackground";
import Rocket from "../objects/rocket/rocket";
import Vector from "../physics/vector";

class Level {

  objects: BaseObject[] = [];
  camera: Camera;
  worldDimensions: Rectangle;
  rocket: Rocket;

  constructor(objects: BaseObject[], worldDimensions: Rectangle = new Rectangle(2000, 2000)) {
    const background = new SpaceBackground();
    this.rocket = new Rocket(new Vector());
    this.objects = objects;
    this.camera = new Camera();
    this.worldDimensions = worldDimensions;

    this.objects.push(...[background, this.rocket, this.camera]);
    this.camera.follow(this.rocket);
  }

  init() { };

  dispose() { };

}


export default Level;