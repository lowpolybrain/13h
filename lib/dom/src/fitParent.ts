import { Canvas } from '@13h/core';

export const fitParent = (canvas: Canvas, scale: number = 1) => {
  if(canvas.element.parentElement){
    const w = canvas.element.parentElement.offsetWidth * scale;
    const h = canvas.element.parentElement.offsetHeight * scale;
    if(canvas.size[0] !== w || canvas.size[1] !== h){
      canvas.setSize([w,h]);
    }
  }
}
