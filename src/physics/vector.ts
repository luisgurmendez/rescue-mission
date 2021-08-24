
class Vector {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  clone(): Vector {
    return new Vector(this.x, this.y);
  }

  distanceTo(v: Vector) {
    return Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2));
  }

  dotProduct(v: Vector) {
    return this.x * v.x + this.y * v.y;
  }

  lengthSq() {
    return Math.pow(this.x, 2) + Math.pow(this.y, 2);
  }

  length() {
    return Math.sqrt(this.lengthSq());
  }

  normalize() {
    const length = this.length();
    this.x /= length;
    this.y /= length;
    return this;
  }

  scalar(n: number) {
    this.x *= n;
    this.y *= n;
    return this;
  }

  add(v: Vector) {
    this.set(this.x + v.x, this.y + v.y);
    return this;
  }

  sub(v: Vector) {
    this.set(-v.x, -v.y);
    return this;
  }

  negate() {
    this.scalar(-1);
  }

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
    return this;
  }

  angleTo(v: Vector) {
    return Math.atan2(this.y, this.x) - Math.atan2(v.y, v.x);
  }

  static angleTo(v1: Vector, v2: Vector) {
    return Math.atan2(v1.y, v1.x) - Math.atan2(v2.y, v2.x);
  }
}

export default Vector;
