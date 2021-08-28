
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
    this.set(this.x - v.x, this.y - v.y);
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

  rotate(angle: number) {
    const _angleInRads = angle * (Math.PI / 180);
    const cos = Math.round(1000 * Math.cos(_angleInRads)) / 1000;
    const sin = Math.round(1000 * Math.sin(_angleInRads)) / 1000;
    const old = this.clone();

    this.x = old.x * cos - old.y * sin
    this.y = old.x * sin + old.y * cos

    return this;
  }

}

export default Vector;
