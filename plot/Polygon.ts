import Vec2 from "../math/Vec2";
import PointDragHandle from "./PointDragHandle";

export default class Polygon {
  constructor(
    public name: string,
    public color: string,
    public mode: "polygon" | "convex" = "polygon"
  ) {}

  readonly points: Vec2[] = [];
  readonly center = new Vec2(0, 0);

  calculateCenter() {
    this.center.set(0, 0);
    for (const point of this.points) {
      this.center.addVec(point);
    }
    this.center.scale(1 / this.points.length);
  }

  #nextCenter = new Vec2(0, 0);
  setCenter(center: Vec2) {
    this.#nextCenter.setVec(center);
    this.calculateCenter();
    for (const point of this.points) {
      point.subVec(this.center).addVec(this.#nextCenter);
    }
  }

  addPoint(point: Vec2) {
    this.points.push(point);
  }

  removePoint(point: Vec2) {
    const index = this.points.indexOf(point);
    if (index !== -1) {
      this.points.splice(index, 1);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    switch (this.mode) {
      case "polygon":
        this.drawPolygon(ctx);
        break;
      case "convex":
        this.drawConvex(ctx);
        break;
    }
  }

  drawPolygon(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = ctx.strokeStyle = this.color;
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (const point of this.points) {
      ctx.lineTo(point.x, point.y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.globalAlpha = 0.15;
    ctx.fill();
    ctx.globalAlpha = 1;
    this.calculateCenter();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(this.name, this.center.x, this.center.y);
    ctx.restore();
  }

  drawConvex(ctx: CanvasRenderingContext2D) {
    toConvexPolygon(this);
    convex.drawPolygon(ctx);
  }
}

const convex = new Polygon("", "");

function toConvexPolygon(polygon: Polygon) {
  // convex.name = polygon.name;
  convex.color = polygon.color;

  const points = polygon.points;
  const hull = findConvexHull(points);

  for (const point of convex.points) {
    returnPoint(point);
  }
  convex.points.length = 0;
  for (const point of hull) {
    convex.addPoint(borrowPoint(point));
  }
}

const unusedPoints: Vec2[] = [];
function borrowPoint(original: Vec2) {
  if (unusedPoints.length === 0) {
    return new Vec2(original.x, original.y);
  }
  const point = unusedPoints.pop()!;
  point.setVec(original);
  return point;
}
function returnPoint(point: Vec2) {
  unusedPoints.push(point);
}

function findConvexHull(points: Vec2[]) {
  const hull: Vec2[] = [];
  const n = points.length;
  let p = 0;
  for (let i = 1; i < n; i++) {
    if (points[i].x < points[p].x) {
      p = i;
    }
  }
  let q = p;
  do {
    hull.push(points[q]);
    let r = (q + 1) % n;
    for (let i = 0; i < n; i++) {
      if (cross(points[r], points[i], points[q]) > 0) {
        r = i;
      }
    }
    q = r;
  } while (q !== p);
  return hull;
}

function cross(a: Vec2, b: Vec2, c: Vec2) {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}
