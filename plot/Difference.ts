import Vec2 from "../math/Vec2";
import Arrow from "./Arrow";
import Polygon from "./Polygon";

export default class Difference {
  constructor(public a: Polygon, public b: Polygon, public out: Polygon) {}

  #arrows: Arrow[] = [];
  #unusedArrows: Arrow[] = [];

  #borrowArrow(point: Vec2, color: string) {
    const arrow = this.#unusedArrows.pop() ?? new Arrow(origin, point, color);
    arrow.end = point;
    this.#arrows.push(arrow);
    return arrow;
  }

  #returnArrow(arrow: Arrow) {
    const index = this.#arrows.indexOf(arrow);
    if (index !== -1) {
      this.#arrows.splice(index, 1);
      this.#unusedArrows.push(arrow);
    }
  }

  #unusedPoints: Vec2[] = [];

  #borrowPoint() {
    return this.#unusedPoints.pop() ?? new Vec2(0, 0);
  }

  #returnPoint(point: Vec2) {
    this.#unusedPoints.push(point);
  }

  update() {
    for (const arrow of this.#arrows) {
      this.#returnArrow(arrow);
    }
    for (const point of this.out.points) {
      this.#returnPoint(point);
    }
    for (const aPoint of this.a.points) {
      for (const bPoint of this.b.points) {
        const diff = this.#borrowPoint();

        diff.sub(aPoint, bPoint);

        this.#borrowArrow(diff, "green");

        this.out.addPoint(diff);
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.a.draw(ctx);
    this.b.draw(ctx);
    this.out.draw(ctx);
    for (const arrow of this.#arrows) {
      arrow.draw(ctx);
    }
  }
}

const origin = new Vec2(0, 0);
