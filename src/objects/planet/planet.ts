import GameContext from '../../core/gameContext';
import { Circle } from '../shapes';
import Vector from '../../physics/vector';
import { ObjectType } from '../objectType';
import RenderUtils from '../../render/utils';
import { PhysicableMixin } from '../../mixins/physics';
import { CollisionableMixin } from '../../mixins/collisionable';
import { PositionableMixin } from '../../mixins/positional';
import BaseObject from '../../objects/baseObject';
import { GravitationalMixin } from '../../mixins/gravitational';
import RenderElement from '../../render/renderElement';

const PlanetMixins = GravitationalMixin(
  PhysicableMixin(
    CollisionableMixin<Circle>()(
      PositionableMixin(BaseObject)
    )
  )
);


// TODO: add a isMoon variable to make planets affectedByGravitational. This way we can eliminate the Moon class
// TODO: add color and density
// TODO: add hover func to see a planet's properties
class Planet extends PlanetMixins {

  hasRing: boolean = true;

  constructor(position: Vector) {
    super();
    this.position = position;
    this.gravitationalForce = 1300;
    this.type = ObjectType.PLANET;
    this.collisionMask = new Circle(80);
    this.gravitationalThreshold = 350;
  }

  step() { }


  render() {
    return new RenderElement(this._render);
  }

  _render = (context: GameContext) => {
    const canvasRenderingContext = context.canvasRenderingContext;
    canvasRenderingContext.fillStyle = '#33F';
    canvasRenderingContext.strokeStyle = '#33F';
    canvasRenderingContext.save();
    canvasRenderingContext.beginPath();
    canvasRenderingContext.setLineDash([5, 15]);
    canvasRenderingContext.arc(this.position.x, this.position.y, this.gravitationalThreshold, 0, 2 * Math.PI);
    canvasRenderingContext.stroke();
    canvasRenderingContext.restore();
    RenderUtils.renderCircle(canvasRenderingContext, this.position, this.collisionMask);
    canvasRenderingContext.fill();


    // Renders planet ring
    if (this.hasRing) {

      // To rotate the ring :
      // canvasRenderingContext.translate(this.position.x, this.position.y);
      // canvasRenderingContext.rotate(this.direction.angleTo(new Vector(0.5, 0.5)))
      // canvasRenderingContext.translate(-this.position.x, -this.position.y);

      canvasRenderingContext.beginPath();
      canvasRenderingContext.strokeStyle = '#141466';
      canvasRenderingContext.lineWidth = 6;
      canvasRenderingContext.moveTo(this.position.x - this.collisionMask.radius, this.position.y);
      canvasRenderingContext.bezierCurveTo(
        this.position.x - this.collisionMask.radius * 4,
        this.position.y + this.collisionMask.radius / 2,
        this.position.x + this.collisionMask.radius * 4,
        this.position.y + this.collisionMask.radius / 2,
        this.position.x + this.collisionMask.radius, this.position.y
      )
      canvasRenderingContext.stroke();
      canvasRenderingContext.strokeStyle = '#8484FF';
      canvasRenderingContext.lineWidth = 1;
      canvasRenderingContext.stroke();
    }

  }
}

export default Planet;
