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

class Planet extends PlanetMixins {

  constructor(position: Vector) {
    super();
    this.position = position;
    this.gravitationalForce = 13000;
    this.type = ObjectType.PLANET;
    this.collisionMask = new Circle(100);
    this.gravitationalThreshold = 600;
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
  }

}

export default Planet;
