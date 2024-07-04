class App {
  constructor(
    canvasId = "background",
    font = "16px sans-serif",
    bgColor = "#000",
    textColor = "rgb(0, 255, 0)",
    textOpacity = 1,
    fallingCharsCount = 30,
    animationStep = 70
  ) {
    this.canvas = document.getElementById(canvasId);
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.font = font;
    this.bgColor = bgColor;
    this.textColor = textColor;
    this.fallingCharsCount = fallingCharsCount;
    this.textOpacity = textOpacity;
    this.animationStep = animationStep;
    this.ctx = this.canvas.getContext("2d", {
      alpha: false,
      textRendering: "optimizeSpeed",
    });
    this.ctx.font = this.font;
    this.alphabet = this.getAlphabet();
    this.maxCharWidth = this.getMaxCharWidth();
    this.charHeight = this.getCharHeight();
    this.textMatrix = this.getTextMatrix();
    this.fallingCharsPositionsY = Array(this.textMatrix.length);
    this.currentTime = new Date();
  }

  init = () => {
    this.clearCanvas();
    this.ctx.fillStyle = this.textColor;
    this.drawFallingCharsLine(0, 1);
    this.fillPositionsY();
    this.drawFallingChars();
  };

  drawCharByMatrixPosition = (char, nx, ny, opacity) => {
    const measurings = this.getTextMeasurings(char);
    const leftPadding = Math.floor((this.maxCharWidth - measurings.width) / 2);
    const x = nx * this.maxCharWidth + leftPadding;
    const y = (ny + 1) * this.charHeight;
    this.ctx.fillStyle = this.getTextColorWithOpacity(opacity);
    this.ctx.fillText(char, x, y);
  };

  drawFallingCharsLine = (nx, ny) => {
    const opacityStep = this.textOpacity / this.fallingCharsCount;
    for (let i = 0; i < this.fallingCharsCount; i += 1) {
      if (ny - i < this.textMatrix[0].length) {
        this.drawCharByMatrixPosition(
          this.textMatrix[nx][ny - i],
          nx,
          ny - i,
          this.textOpacity - opacityStep * i
        );
      } else {
        this.drawCharByMatrixPosition(
          this.textMatrix[nx][ny - i - this.textMatrix[0].length],
          nx,
          ny - i - this.textMatrix[0].length,
          this.textOpacity - opacityStep * i
        );
      }
    }
  };

  drawFallingChars = () => {
    const now = new Date();
    if (now - this.currentTime > this.animationStep) {
      this.clearCanvas();
      this.fallingCharsPositionsY.forEach((y, idx) => {
        this.drawFallingCharsLine(idx, y);
      });
      for (let i = 0; i < this.fallingCharsPositionsY.length; i += 1) {
        this.fallingCharsPositionsY[i] =
          this.fallingCharsPositionsY[i] + 1 >
          this.textMatrix[0].length + this.fallingCharsCount
            ? this.fallingCharsCount
            : this.fallingCharsPositionsY[i] + 1;
      }
      this.currentTime = now;
    }
    window.requestAnimationFrame(this.drawFallingChars);
  };

  fillPositionsY = () => {
    for (let i = 0; i < this.textMatrix.length; i += 1) {
      this.fallingCharsPositionsY[i] = Math.floor(
        Math.random() * this.textMatrix[0].length
      );
    }
  };

  getTextColorWithOpacity = (opacity) => {
    const color = this.textColor
      .replace("rgb", "")
      .replace("(", "")
      .replace(")", "");
    return `rgba(${color}, ${opacity})`;
  };

  getTextMeasurings = (text) => {
    const textMeasurings = this.ctx.measureText(text);
    return {
      height: textMeasurings.actualBoundingBoxAscent,
      width: textMeasurings.width,
    };
  };

  getAlphabet = () => {
    return [
      ...[...Array(126).keys()].map((key) => String.fromCharCode(key + 97)),
      " ",
    ];
  };

  getMaxCharWidth = () => {
    return Math.ceil(
      Math.max(...this.alphabet.map((x) => this.getTextMeasurings(x).width))
    );
  };

  getCharHeight = () => {
    return this.getTextMeasurings("T").height;
  };

  getWidthAndHeightSymbols = () => {
    return {
      height: Math.floor(this.canvas.height / this.getCharHeight()),
      width: Math.floor(this.canvas.width / this.getMaxCharWidth()),
    };
  };

  clearCanvas = () => {
    this.ctx.fillStyle = this.bgColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  };

  getRandomChar = () => {
    const idx = Math.floor(Math.random() * this.alphabet.length);
    return this.alphabet[idx];
  };

  getTextMatrix = () => {
    const arr = Array(this.getWidthAndHeightSymbols().width)
      .fill(null)
      .map((_) => Array(this.getWidthAndHeightSymbols().height).fill(null));
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr[i].length; j++) {
        arr[i][j] = this.getRandomChar();
      }
    }
    return arr;
  };

  getWidthAndHeightSymbols = () => {
    return {
      height: Math.floor(this.canvas.height / this.getCharHeight(this.ctx)),
      width: Math.floor(this.canvas.width / this.getMaxCharWidth(this.ctx)),
    };
  };
}

const app = new App(
  "background",
  "18px monospace",
  "#000",
  "rgb(0, 255, 0)",
  0.5,
  20,
  70
);
app.init();
