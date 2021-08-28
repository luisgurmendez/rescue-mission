import Color from "../../utils/color";
import Vector from "../../physics/vector";
import { callTimes } from "../../utils/fn";
import Particle from "./particle";

interface GenerateOptions {
  amount?: number;
  direction?: Vector; // angle?
  color?: Color;
  velocity?: number;
  ttl?: number;
  position?: Vector;
  size?: number;
}

const defaultOptions: Required<GenerateOptions> = {
  amount: 1,
  direction: new Vector(), // angle?
  color: new Color(255, 0, 0),
  velocity: 0,
  ttl: 2,
  position: new Vector(),
  size: 2
}

class ParticleGenerator {

  static generate(options: GenerateOptions): Particle[] {
    const _options: Required<GenerateOptions> = { ...defaultOptions, ...options }
    return callTimes(_options.amount, () => {
      const particle = new Particle();
      particle.velocity = new Vector(Math.random() * 10 * (Math.random() > 0.5 ? -1 : 1), 40 * Math.random());
      particle.size = Math.random() * 3
      return particle;
    })
  }


}

export default ParticleGenerator;