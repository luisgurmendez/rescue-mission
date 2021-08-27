



import GameContext from '../../core/gameContext';
import Vector from '../../physics/vector';
import { ObjectType } from '../objectType';
import RenderUtils from '../../render/utils';
import { PhysicableMixin } from '../../mixins/physics';
import { PositionableMixin } from '../../mixins/positional';
import BaseObject from '../../objects/baseObject';
import RenderElement from '../../render/renderElement';
import Disposable from '../../behaviors/disposable';
import { Circle } from '../shapes';

const ParticleMixins = PhysicableMixin(
  PositionableMixin(BaseObject)
);

class Particle extends ParticleMixins implements Disposable {

  private ttl: number;
  private color: string;
  shouldDispose: boolean = false;
  fade = false;
  maxTTL: number;
  size: number;

  constructor(position: Vector, ttl: number, color: string = '#F00') {
    super();
    this.position = position;
    this.type = ObjectType.PARTICLE;
    this.velocity = new Vector(0, 0)
    this.mass = 0;
    this.direction = new Vector(0, -1);
    this.ttl = ttl;
    this.maxTTL = ttl;
    this.color = color;
    this.fade = true;
    this.size = 1;
    this.color = `rgba(${255},${Math.random() * 255},${12},`;
  }

  step(context: GameContext) {
    this.acceleration = this.calculateAcceleration(context);
    this.position = this.calculatePosition(context.dt);
    this.velocity = this.calculateVelocity(context.dt);
    this.ttl -= context.dt;
    if (this.ttl < 0) {
      this.shouldDispose = true;
    }
  }

  render() {
    const renderFn = (context: GameContext) => {
      const canvasRenderingContext = context.canvasRenderingContext;
      let alpha = this.ttl / this.maxTTL;
      canvasRenderingContext.fillStyle = this.color + `${alpha})`;
      canvasRenderingContext.beginPath();
      canvasRenderingContext.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI);
      canvasRenderingContext.fill();
    }
    return new RenderElement(renderFn);
  }

  private calculateAcceleration(context: GameContext) {
    return new Vector()
  }

}

export default Particle;
