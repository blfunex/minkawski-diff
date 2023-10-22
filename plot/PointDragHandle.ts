import Vec2 from "../math/Vec2";

export default class PointDragHandle {
  constructor(public point: Vec2, public radius = 10) {}

  onUpdate: null | VoidFunction = null;

  draw(ctx: CanvasRenderingContext2D, hover: boolean) {
    if (!hover) return;
    ctx.beginPath();
    ctx.fillStyle = "#0003";
    ctx.arc(this.point.x, this.point.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#000";
    ctx.fillText(this.point.toString(2), this.point.x + 10, this.point.y - 10);
  }
}
