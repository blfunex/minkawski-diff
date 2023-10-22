import Vec2 from "../math/Vec2";
import { clamp } from "../math/fns";

export default class Arrow {
  constructor(public start: Vec2, public end: Vec2, public color: string) {}

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.moveTo(this.start.x, this.start.y);
    ctx.lineTo(this.end.x, this.end.y);
    ctx.stroke();

    const dist = this.end.distance(this.start);
    const arrowSize = clamp(dist, 1, 10);
    const arrowHeight = arrowSize * EQUALATERAL_TRIANGLE_HEIGHT_RATIO;

    const arrowAngle =
      Math.atan2(this.end.y - this.start.y, this.end.x - this.start.x) +
      QUARTER_CIRCLE;

    arrowBase
      .sub(this.end, this.start)
      .normalize(-arrowHeight)
      .addVec(this.end);

    arrowLeft
      .set(-1, 0)
      .rotate(arrowAngle)
      .scale(arrowSize / 2)
      .addVec(arrowBase);

    arrowRight
      .set(1, 0)
      .rotate(arrowAngle)
      .scale(arrowSize / 2)
      .addVec(arrowBase);

    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.moveTo(this.end.x, this.end.y);
    ctx.lineTo(arrowLeft.x, arrowLeft.y);
    ctx.lineTo(arrowRight.x, arrowRight.y);
    ctx.closePath();
    ctx.fill();
  }
}

function point(vec: Vec2, ctx: CanvasRenderingContext2D, color: string) {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(vec.x, vec.y, 5, 0, Math.PI * 2);
  ctx.fill();
}

const arrowLeft = new Vec2(-1, 0);
const arrowRight = new Vec2(1, 0);
const arrowBase = new Vec2(0, 0);

const EQUALATERAL_TRIANGLE_HEIGHT_RATIO = Math.sqrt(3) / 2;
const QUARTER_CIRCLE = Math.PI / 2;
