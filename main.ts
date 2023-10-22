import Vec2 from "./math/Vec2";
import Arrow from "./plot/Arrow";
import PointDragHandle from "./plot/PointDragHandle";
import PointDragController from "./plot/DragPointController";
import Camera from "./plot/Camera";
import Polygon from "./plot/Polygon";
import PolygonDragHandles from "./plot/PolygonHandle";
import Difference from "./plot/Difference";

const canvas = document.querySelector("canvas")!;
const ctx = canvas.getContext("2d")!;

const A = new Polygon("A", "red");
const B = new Polygon("B", "blue");

A.addPoint(new Vec2(100, 100));
A.addPoint(new Vec2(200, 100));
A.addPoint(new Vec2(200, 300));

B.addPoint(new Vec2(100, -100));
B.addPoint(new Vec2(200, -100));
B.addPoint(new Vec2(200, -300));
B.addPoint(new Vec2(100, -300));

const D = new Polygon("B - A", "green", "convex");

const camera = new Camera(canvas);

A.setCenter(
  Vec2.randomInRect(0, 0, canvas.width, canvas.height).subVec(camera.origin)
);
B.setCenter(
  Vec2.randomInRect(0, 0, canvas.width, canvas.height).subVec(camera.origin)
);

const controller = new PointDragController(canvas, camera);

const phA = new PolygonDragHandles(A, controller);
const phB = new PolygonDragHandles(B, controller);

const diff = new Difference(A, B, D);

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  camera.origin.set(canvas.width / 2, canvas.height / 2);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  camera.push(ctx);

  ctx.save();
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-canvas.width, 0);
  ctx.lineTo(canvas.width, 0);
  ctx.moveTo(0, -canvas.height);
  ctx.lineTo(0, canvas.height);
  ctx.stroke();
  ctx.restore();

  phA.update();
  phB.update();

  diff.update();
  diff.draw(ctx);

  controller.draw(ctx);

  camera.pop(ctx);

  requestAnimationFrame(draw);
}

(window.onresize = resize)();
draw();
