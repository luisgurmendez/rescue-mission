import { Rectangle, Circle } from "../objects/shapes";
import Vector from "../physics/vector";
import { Collisionable, isCollisionableObject } from "../mixins/collisionable";
import { Positionable } from "../mixins/positional";
import BaseObject from "../objects/baseObject";

export type CollisionableObject = Collisionable & Positionable & BaseObject

export interface Collisions {
  [objectId: string]: Collisionable[];
}

class CollisionsController {

  // TODO: optimize? quadtrees?
  getCollisions(objects: CollisionableObject[]): Collisions {
    const collisions: Collisions = {};

    for (let i = 0; i < objects.length; i++) {
      const primaryObj = objects[i];
      if (isCollisionableObject(primaryObj)) {
        for (let j = 0; j < objects.length; j++) {
          const secondaryObj = objects[j];
          if (primaryObj !== secondaryObj && isCollisionableObject(secondaryObj)) {
            const areObjectsColliding = this.calculateCollision(primaryObj, secondaryObj);
            if (areObjectsColliding) {
              if (collisions[primaryObj.id] === undefined) {
                collisions[primaryObj.id] = [secondaryObj];
              } else {
                collisions[primaryObj.id].push(secondaryObj);
              }
            }

          }
        }
      }
    }
    return collisions;
  }

  // Checks if 2 objects are colliding
  private calculateCollision(a: CollisionableObject, b: CollisionableObject): boolean {

    if (a.collisionMask instanceof Circle) {
      if (b.collisionMask instanceof Circle) {
        return Intersections.isCircleIntersectingCircle(a.collisionMask, b.collisionMask, a.position, b.position);
      }

      if (b.collisionMask instanceof Rectangle) {
        return Intersections.isRectangleIntersectingCircle(b.collisionMask, a.collisionMask, b.position, a.position,);
      }
    }

    if (a.collisionMask instanceof Rectangle) {
      if (b.collisionMask instanceof Circle) {
        return Intersections.isRectangleIntersectingCircle(a.collisionMask, b.collisionMask, a.position, b.position);
      }

      if (b.collisionMask instanceof Rectangle) {
        return Intersections.isRectangleIntersectingRectangle(b.collisionMask, a.collisionMask, b.position, a.position);
      }
    }

    return false;
  }

}

export default CollisionsController;

class Intersections {

  static isRectangleIntersectingCircle(
    rectangle: Rectangle,
    circle: Circle,
    rectPos: Vector,
    circlePos: Vector
  ) {

    // rectangle center
    const { x: rx, y: ry } = rectPos;
    // circle center
    const { x: sx, y: sy } = circlePos;

    // circle radius
    const sradius = circle.radius;

    // rectangle left most x
    const rx1 = rx - rectangle.w / 2
    // rectangle right most x
    const rx2 = rx + rectangle.w / 2

    // rectangle lower most y
    const ry1 = ry - rectangle.h / 2
    // rectangle upper most y
    const ry2 = ry + rectangle.h / 2

    // Find the nearest polet on the
    // rectangle to the center of
    // the circle
    let xn = Math.max(rx1, Math.min(sx, rx2));
    let yn = Math.max(ry1, Math.min(sy, ry2));

    // Find the distance between the
    // nearest polet and the center
    // of the circle
    // Distance between 2 polets,
    // (x1, y1) & (x2, y2) in
    // 2D Euclidean space is
    // ((x1-x2)**2 + (y1-y2)**2)**0.5
    let dx = xn - sx;
    let dy = yn - sy;
    return (dx * dx + dy * dy) <= sradius * sradius;

  };


  static isRectangleIntersectingRectangle(a: Rectangle, b: Rectangle, apos: Vector, bpos: Vector) {

    // l1: Top Left coordinate of first rectangle. 
    // r1: Bottom Right coordinate of first rectangle. 
    // l2: Top Left coordinate of second rectangle. 
    // r2: Bottom Right coordinate of second rectangle.

    const l1 = new Vector(apos.x - a.w / 2, apos.y + a.h / 2);
    const r1 = new Vector(apos.x + a.w / 2, apos.y - a.h / 2);

    const l2 = new Vector(bpos.x - b.w / 2, bpos.y + b.h / 2);
    const r2 = new Vector(bpos.x + b.w / 2, bpos.y - b.h / 2);

    // To check if either rectangle is actually a line
    // For example : l1 ={-1,0} r1={1,1} l2={0,-1} r2={0,1}

    if (l1.x == r1.x || l1.y == r1.y ||
      l2.x == r2.x || l2.y == r2.y) {
      // the line cannot have positive overlap
      return false;
    }

    // If one rectangle is on left side of other
    if (l1.x >= r2.x || l2.x >= r1.x) {
      return false;
    }

    // If one rectangle is above other
    if (r1.y >= l2.y || r2.y >= l1.y) {
      return false;
    }

    return true;
  }

  static isCircleIntersectingCircle(a: Circle, b: Circle, apos: Vector, bpos: Vector) {
    const distanceBetweenCircles = apos.distanceTo(bpos);
    return distanceBetweenCircles <= a.radius + b.radius;
  }
}