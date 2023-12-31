import { labels } from './labels';
import { Dispatch, SetStateAction, RefObject } from 'react';
function xywh2xyxy(x: any) {
  //Convert boxes from [x, y, w, h] to [x1, y1, x2, y2] where xy1=top-left, xy2=bottom-right
  let y = [];
  y[0] = x[0] - x[2] / 2; //top left x
  y[1] = x[1] - x[3] / 2; //top left y
  y[2] = x[0] + x[2] / 2; //bottom right x
  y[3] = x[1] + x[3] / 2; //bottom right y
  return y;
}

export const renderBoxes = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  threshold: number,
  boxes_data: number[],
  scores_data: number[],
  classes_data: number[]
) => {
  const ctx = canvasRef.current!.getContext('2d')!;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // clean canvas
  // font configs
  const font = '20px sans-serif';
  ctx.font = font;
  ctx.textBaseline = 'top';

  for (let i = 0; i < scores_data.length; ++i) {
    if (scores_data[i] > threshold) {
      const clsName = labels[classes_data[i]];
      const score = (scores_data[i] * 100).toFixed(1);

      let [x1, y1, x2, y2] = xywh2xyxy(boxes_data[i]);
      if (x1 < 0 || y1 < 0) return;

      const width = x2 - x1;
      const height = y2 - y1;

      // Draw the bounding box.
      ctx.strokeStyle = '#B033FF';
      ctx.lineWidth = 2;
      ctx.strokeRect(x1, y1, width, height);

      // Draw the label background.
      ctx.fillStyle = '#B033FF';
      const textWidth = ctx.measureText(clsName + ' - ' + score + '%').width;
      const textHeight = parseInt(font, 10); // base 10
      ctx.fillRect(
        x1 - 1,
        y1 - (textHeight + 2),
        textWidth + 2,
        textHeight + 2
      );

      // Draw labels
      ctx.fillStyle = '#ffffff';
      ctx.fillText(
        clsName + ' - ' + score + '%',
        x1 - 1,
        y1 - (textHeight + 2)
      );
    }
  }
};
