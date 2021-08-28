


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
  static randomInRange(r: ColorUnitInRange, g: ColorUnitInRange, b: ColorUnitInRange, a: ColorUnitInRange) {

    function randomizeColorUnit(u: ColorUnitInRange): number {
      if (Array.isArray(u)) {
        return u[0] + Math.random() * (u[1] - u[0])
      }
      return u;
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