import Stepable from "../../behaviors/stepable";

export interface WinningCondition extends Stepable {
  satisfiesCondition: () => boolean;
}
