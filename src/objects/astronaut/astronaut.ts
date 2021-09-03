import { PhysicableMixin } from '../../mixins/physics';
import { CollisionableMixin } from '../../mixins/collisionable';
import { PositionableMixin } from '../../mixins/positional';
import BaseObject from '../../objects/baseObject';
import { Rectangle } from '../../objects/shapes';
import RenderElement from '../../render/renderElement';
import AstronautRenderUtils from './astronautRenderUtils';
import GameContext from 'core/gameContext';
import Vector from '../../physics/vector';

const AstronautMixins =
  PhysicableMixin(
    CollisionableMixin<Rectangle>()(
      PositionableMixin(BaseObject)
    )
  );

class Astronaut extends AstronautMixins {

  constructor() {
    super();
    this.direction = new Vector(1, 0);
    this.collisionMask = new Rectangle(16, 16);
    this.angularVelocity = 100;
    this.position = new Vector(100, 100);
  }

  step(context: GameContext) {
    this.angularVelocity = this.calculateAngularVelocity(context.dt);
    this.direction = this.calculateDirection(context.dt);
  }

  render() {
    const renderFn = (context: GameContext) => {
      AstronautRenderUtils.renderAstronaut(context, this);
    }
    const renderElement = new RenderElement(renderFn);
    return renderElement;
  }



}

export default Astronaut;