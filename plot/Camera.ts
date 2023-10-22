import Vec2 from "../math/Vec2";

export default class Camera {
  readonly origin = new Vec2(0, 0);

  constructor(private canvas: HTMLCanvasElement) {
    this.origin.set(canvas.width / 2, canvas.height / 2);
    canvas.addEventListener("pointerdown", this.#onPointerDown.bind(this));
    canvas.addEventListener("pointermove", this.#onPointerMove.bind(this));
    canvas.addEventListener("pointerup", this.#onPointerUp.bind(this));
    canvas.addEventListener("pointercancel", this.#onPointerUp.bind(this));
  }

  #navigating = false;

  readonly world = new Vec2(0, 0);
  readonly screen = new Vec2(0, 0);

  #offset = new Vec2(0, 0);

  #onPointerMove(e: PointerEvent) {
    this.screen.set(e.clientX, e.clientY);
    this.world.setVec(this.screen).subVec(this.origin);
    if (!this.#navigating) return;
    this.origin.setVec(this.screen).subVec(this.#offset);
  }

  #onPointerDown(e: PointerEvent) {
    if (e.button !== 1) return;
    this.#navigating = true;
    this.canvas.setPointerCapture(e.pointerId);
    this.#offset.setVec(this.screen).subVec(this.origin);
  }

  #onPointerUp(e: PointerEvent) {
    this.#navigating = false;
    this.canvas.releasePointerCapture(e.pointerId);
  }

  push(ctx: CanvasRenderingContext2D, debug = false) {
    ctx.save();
    ctx.resetTransform();
    if (debug) {
      ctx.fillStyle = "black";
      ctx.fillText(`Screen: ${this.screen}`, 10, 20);
      ctx.fillText(`World: ${this.world}`, 10, 40);
    }
    ctx.translate(this.origin.x, this.origin.y);
  }

  pop(ctx: CanvasRenderingContext2D) {
    ctx.restore();
  }
}
