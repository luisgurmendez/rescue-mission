
class RocketThruster {
  fuel: number;
  thrustPower: number;

  constructor(fuel: number, thrustPower: number) {
    this.fuel = fuel;
    this.thrustPower = thrustPower;
  }

  thrust(): number {
    if (!this.isEmpty()) {
      this.fuel -= 1;
      return this.thrustPower;
    }
    return 0;
  }

  isEmpty() {
    return this.fuel === 0;
  }
}

export default RocketThruster;