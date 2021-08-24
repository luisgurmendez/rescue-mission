import Physics from "../physicsObject";
import RocketThruster from "./rocketThruster";

class Rocket extends Physics {

  private thruster: RocketThruster;
  public hasLaunched: boolean = false;

  constructor(mass: number = 1000) {
    super(mass);
    this.thruster = new RocketThruster(100000, 7607 * 1000); // 981 kN fallcon 9
  }

  thrust() {
    const thustForce = this.thruster.thrust();
    if (thustForce > 0) {
      // f = m*a
      return this.mass / thustForce;
    }
    return 0;
  };

}

export default Rocket;