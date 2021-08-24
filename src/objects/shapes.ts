
export type Shape = Rectangle | Circle;

export class Rectangle {
  public w: number;
  public h: number;

  constructor(w: number, h: number) {
    this.w = w;
    this.h = h;
  }
}

export class Circle {
  public radius: number;

  constructor(r: number) {
    this.radius = r;
  }
}

