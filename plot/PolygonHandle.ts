import Vec2 from "../math/Vec2";
import PointDragController from "./DragPointController";
import PointDragHandle from "./PointDragHandle";
import Polygon from "./Polygon";

export default class PolygonDragHandles {
  constructor(
    private polygon: Polygon,
    private controller: PointDragController
  ) {
    this.#updateHandles();
  }

  #handles: PointDragHandle[] = [];
  #unused: PointDragHandle[] = [];

  #borrowHandle(point: Vec2, radius: number) {
    const handle = this.#unused.pop() ?? new PointDragHandle(point, radius);
    handle.point = point;
    handle.radius = radius;
    this.#handles.push(handle);
    this.controller.handles.add(handle);
    return handle;
  }

  #returnHandle(handle: PointDragHandle) {
    const index = this.#handles.indexOf(handle);
    if (index !== -1) {
      this.#handles.splice(index, 1);
      this.controller.handles.delete(handle);
      this.#unused.push(handle);
    }
  }

  #updateHandles() {
    for (const handle of this.#handles) {
      this.#returnHandle(handle);
    }
    for (const point of this.polygon.points) {
      this.#borrowHandle(point, 5);
    }
    const centerHandle = this.#borrowHandle(this.polygon.center, 10);
    centerHandle.onUpdate = () => {
      this.polygon.setCenter(centerHandle.point);
    };
  }

  update() {
    if (this.#handles.length === this.polygon.points.length + 1) return;
    this.#updateHandles();
  }
}
