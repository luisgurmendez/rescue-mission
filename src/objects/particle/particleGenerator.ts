import Vector from "../../physics/vector";
import { callTimes } from "../../utils/fn";
import Particle from "./particle";

interface GenerateOptions {
  amount?: number;
  direction?: Vector; // angle?
  color?: string;
  velocity?: number;
  ttl?: number;
  position?: Vector;
}

const defaultOptions: Required<GenerateOptions> = {
  amount: 1,
  direction: new Vector(), // angle?
  color: '#F00',
  velocity: 0,
  ttl: 2,
  position: new Vector()
}

class ParticleGenerator {

  generate(options: GenerateOptions): Particle[] {
    const _options: Required<GenerateOptions> = { ...defaultOptions, ...options }
    return callTimes(_options.amount, () => {
      const particle = new Particle(_options.position, _options.ttl, _options.color);
      particle.velocity = new Vector(Math.random() * 10 * (Math.random() > 0.5 ? -1 : 1), 40 * Math.random());
      particle.size = Math.random() * 3
      return particle;
    })
  }
}

export default ParticleGenerator;