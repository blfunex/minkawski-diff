import Vec2 from "../math/Vec2";
import Camera from "./Camera";
import PointDragHandle from "./PointDragHandle";

export default class PointDragController {
  readonly handles = new Set<PointDragHandle>();

  constructor(private canvas: HTMLCanvasElement, private camera: Camera) {
    canvas.addEventListener("pointerdown", this.onPointerDown.bind(this));
    canvas.addEventListener("pointermove", this.onPointerMove.bind(this));
    canvas.addEventListener("pointerup", this.onPointerUp.bind(this));
    canvas.addEventListener("pointercancel", this.onPointerUp.bind(this));
  }

  #dragging = false;
  #hovering: PointDragHandle | null = null;
  #offset = new Vec2(0, 0);

  onPointerMove(e: PointerEvent) {
    const mouse = this.camera.world;

    if (this.#dragging && this.#hovering) {
      this.#hovering.point.setVec(mouse).subVec(this.#offset);
      this.#hovering.onUpdate?.();
      return;
    }

    this.#hovering = null;
    for (const handle of this.handles) {
      if (handle.point.distanceSquared(mouse) < handle.radius ** 2) {
        this.#hovering = handle;
        break;
      }
    }
  }

  onPointerDown(e: PointerEvent) {
    if (!this.#hovering) return;
    this.#dragging = true;
    this.#offset.setVec(this.camera.world).subVec(this.#hovering.point);
    this.canvas.setPointerCapture(e.pointerId);
  }

  onPointerUp(e: PointerEvent) {
    if (!this.#dragging) return;
    this.canvas.releasePointerCapture(e.pointerId);
    this.#dragging = false;
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const handle of this.handles) {
      handle.draw(ctx, handle === this.#hovering);
    }
  }
}
