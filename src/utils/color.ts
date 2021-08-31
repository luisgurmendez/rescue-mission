import RandomUtils from "./random";



type ColorUnitInRange = [number, number] | number;

class Color {
  r: number;
  g: number;
  b: number;
  a: number = 1;

  constructor(r: number, g: number, b: number, a: number = 1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  // TODO: implement 
  fromHex(hex: string) {
    if (hex[0] === '#') {

    }
  }

  clone() {
    return new Color(this.r, this.g, this.b, this.a);
  }

  // Randomizes a rgba color between a range of number, or with a fixed value for certain values.
  static random(r: ColorUnitInRange = 255, g: ColorUnitInRange = 255, b: ColorUnitInRange = 255, a: ColorUnitInRange = 255) {

    function randomizeColorUnit(u: ColorUnitInRange): number {
      if (Array.isArray(u)) {
        return RandomUtils.getIntegerInRange(u[0], u[1]);
      }
      return RandomUtils.getIntegerInRange(0, u);
    }

    return new Color(
      randomizeColorUnit(r),
      randomizeColorUnit(g),
      randomizeColorUnit(b),
      randomizeColorUnit(a)
    )
  }

  rgba() {
    return `rgba(${this.r},${this.g},${this.b},${this.a})`
  }
}

export default Color;