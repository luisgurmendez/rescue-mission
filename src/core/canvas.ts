
class CanvasGenerator {

  static generateCanvas() {
    let canvasRenderingContext: CanvasRenderingContext2D;
    const canvas = document.createElement('canvas');
    const containerEl = document.getElementById('canvas-container');
    if (containerEl) {

      const onContainerResize = () => {
        canvas.width = document.body.scrollWidth;
        canvas.height = document.body.scrollHeight;
        canvasRenderingContext.imageSmoothingEnabled = true;
        canvasRenderingContext.translate(0.5, 0.5);
      }

      const possibleNullCanvasContext = canvas.getContext('2d');

      if (possibleNullCanvasContext === undefined) {
        throw Error('Browser doesnt support canvas!');
      }

      canvasRenderingContext = possibleNullCanvasContext!;
      onContainerResize();
      containerEl.appendChild(canvas);
      window.addEventListener('resize', onContainerResize);
    } else {
      throw Error('No canvas container');
    }

    return canvasRenderingContext;
  }
}


export default CanvasGenerator;
