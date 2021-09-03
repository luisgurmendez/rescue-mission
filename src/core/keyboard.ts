
export const LEFT = 'ArrowLeft';
export const UP = 'ArrowUp';
export const RIGHT = 'ArrowRight';
export const DOWN = 'ArrowDown';
export const SPACE = ' ';

export type Arrow = typeof LEFT | typeof RIGHT | typeof DOWN | typeof UP
export type ArrowKeysPressedMapping = { [key in Arrow]: boolean }
export type PressedKeysMapping = { [key: string]: boolean }
class Keyboard {

  private static instance: Keyboard;
  private pressedKeys: PressedKeysMapping;

  private constructor() {
    this.pressedKeys = {};

    document.addEventListener('keydown', this.keyDownHanlder)
    document.addEventListener('keyup', this.keyUpHanlder)
  }

  private keyUpHanlder = (e: KeyboardEvent) => {
    this.pressedKeys[e.key as Arrow] = false;
  }

  private keyDownHanlder = (e: KeyboardEvent) => {
    this.pressedKeys[e.key as Arrow] = true;
  }

  public isKeyPressed = (key: string) => {
    return !!this.pressedKeys[key]
  }

  public clearPressedKeys() {
    this.pressedKeys = {};
  }

  public clean() {
    document.removeEventListener('keydown', this.keyDownHanlder)
    document.removeEventListener('keyup', this.keyUpHanlder)
  }

  public static getInstance(): Keyboard {
    if (!Keyboard.instance) {
      Keyboard.instance = new Keyboard();
    }

    return Keyboard.instance;
  }
}

export default Keyboard;
