
class RandomUtils {

  static getNumberWithVariance(n: number, variance: number): number {
    return n + Math.random() * variance;
  }

  static getValueInRange(bottom: number, top: number): number {
    return Math.random() * (top - bottom) + bottom;
  }

  static getIntegerInRange(bottom: number, top: number): number {
    return Math.floor(RandomUtils.getValueInRange(bottom, top + 1));
  }

  static getRandomValueOf<T>(values: T[]): T {
    let max = values.length - 1;
    let index = RandomUtils.getIntegerInRange(0, max);
    return values[index];
  }

  static getRandomBoolean(prob: number = 0.5) {
    return Math.random() > prob;
  }

}

export default RandomUtils;