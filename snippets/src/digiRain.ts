import { makeScene } from './inc/boilerplate';
import { Canvas, color, Point, random } from '@13h/core';

const characters = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ日012345789Z+-="';
const percentEmpty = 0.2;
const percentChange = 0.01;
const fontSize = 12;
const padding = 0;

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
    return this.chars.length * (fontSize + padding);
  }
  constructor(private canvas: Canvas) {
    this.charCount = random.iRange(20, 30);
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
    this.pos = [this.pos[0], this.pos[1] + fontSize + padding];
    if (this.pos[1] > this.canvas.height + this.getHeight()) {
      this.pos[1] = 0;
      this.buildChars();
    }
  }
  render() {
    let y = this.pos[1];
    this.canvas.context.font = `normal ${fontSize}px monospace`;
    const max = this.chars.length - 1;
    for (let i = 0; i <= max; i++) {
      y -= fontSize + padding;
      const mod = random.m32(y) * 0.2 - 0.1;
      const clr = i === 0 ? color.rgb(255) : color.rgb(0, 255, 0, 1 - i / max + mod);
      const char = this.chars[i] || (i === 0 ? this.getRandomCharacter() : null);
      if (char) {
        this.canvas.text.center(char, [this.pos[0], y], clr);
      }
    }
  }
}

const strains: Strain[] = [];
makeScene(
  (canvas, t) => {
    canvas.fill('#000');
    strains.forEach((s) => {
      if (!(t % 4)) {
        s.changeCharacter();
        s.shiftCharacters();
        s.moveDown();
      }
      s.render();
    });
  },
  {},
  (c) => {
    for (let x = 0; x <= c.width; x += fontSize + padding) {
      for (let i = 0; i < 2; i++) {
        const strain = new Strain(c);
        const ch = fontSize + padding;
        const y = random.iRange(0, Math.floor((c.height + strain.getHeight()) / ch)) * ch;
        strain.pos = [x, y];
        strains.push(strain);
      }
    }
    console.log(strains);
  }
);
