import { makeScene } from './inc/boilerplate';
import { Canvas, color, Point, random } from '@13h/core';
import { point } from '@13h/core';

const blurCanvas = new Canvas();

const drawRescaledContents = (c: Canvas, factor: number = 4, alpha: number = 1) => {
  blurCanvas.setSize(point.div(c.size, factor));
  blurCanvas.clear();
  c.draw(blurCanvas, [0,0], 0, 1/factor);
  blurCanvas.draw(c, [0,0], 0, factor, alpha);
}

const characters = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ日012345789Z+-="';
const percentEmpty = 0.2;
const percentChange = 0.1;
const fontSize = 14;
const padding: Point = [0, 0];
const min = 20;
const max = 60;

class Strain {
  private chars: (string | null)[] = [];
  public pos: [number, number] = [300, 800];

  private charCount = 32;
  private getRandomCharacter(): string {
    return characters[random.iRange(0, characters.length - 1)];
  }
  private buildChars() {
    let i = this.charCount;
    const chars = [];
    while (i--) {
      if (Math.random() < percentEmpty) {
        chars.push(null);
      } else {
        chars.push(this.getRandomCharacter());
      }
    }
    this.chars = chars;
  }
  public getHeight(): number {
    return this.chars.length * (fontSize + padding[1]);
  }
  constructor(private canvas: Canvas) {
    this.charCount = random.iRange(min, max);
    this.buildChars();
  }
  // Change at least one character in a strain
  changeCharacter() {
    for (let i = 0; i < this.chars.length; i++) {
      if (this.chars[i] && Math.random() < percentChange) {
        this.chars[i] = this.getRandomCharacter();
      }
    }
  }
  shiftCharacters() {
    this.chars = [this.chars[this.chars.length - 1], ...this.chars.slice(0, -1)];
  }
  moveDown() {
    this.pos = [this.pos[0], this.pos[1] + fontSize + padding[1]];
    if (this.pos[1] > this.canvas.height + this.getHeight()) {
      this.pos[1] = 0;
      this.buildChars();
    }
  }
  getRandomY(c: Canvas) {
    const ch = fontSize + padding[1];
    return random.iRange(0, Math.floor((c.height + this.getHeight()) / ch)) * ch;
  }
  render() {
    let y = this.pos[1];
    this.canvas.context.font = `normal ${fontSize}px monospace`;
    const max = this.chars.length - 1;
    for (let i = 0; i <= max; i++) {
      y -= fontSize + padding[1];
      const mod = random.m32(y) * 0.2 - 0.1;
      const clr = i === 0 ? color.rgb(255) : color.rgb(0, 255, 0, 1 - i / max + mod);
      const char = this.chars[i] || (i === 0 ? this.getRandomCharacter() : null);
      if (char) {
        this.canvas.text.center(char, [this.pos[0], y], clr);
      }
    }
  }
}

let strains: Strain[] = [];

const c = new Canvas();
makeScene(
  (canvas, t) => {
    canvas.clear();
    strains.forEach((s) => {
      if (!(t % 3)) {
        s.changeCharacter();
        s.shiftCharacters();
        s.moveDown();
      }
      s.render();
    });
    c.setSize(canvas);
    c.fill('#000');
    drawRescaledContents(canvas, 8);
    canvas.draw(c);
    c.draw(canvas);
  },
  {},
  (c) => {
    const buildStrains = (): Strain[] => {
      const strains: Strain[] = [];
      for (let x = 0; x <= c.width; x += fontSize + padding[0]) {
        for (let i = 0; i < 2; i++) {
          const strain = new Strain(c);
          strain.pos = [x, strain.getRandomY(c)];
          strains.push(strain);
        }
      }
      return strains;
    };

    strains = buildStrains();
    c.onResize(() => (strains = buildStrains()));
  }
);
