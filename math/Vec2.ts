export type vec2 = [number, number];

export default class Vec2 {
  constructor(public x: number, public y: number) {}

  static randomInRect(x: number, y: number, w: number, h: number) {
    return new Vec2(x + Math.random() * w, y + Math.random() * h);
  }

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
    return this;
  }

  setVec(other: Vec2) {
    this.x = other.x;
    this.y = other.y;
    return this;
  }

  toString(fractionDigits = 2) {
    const x = this.x.toFixed(fractionDigits);
    const y = this.y.toFixed(fractionDigits);
    return `(${x}, ${y})`;
  }

  get length() {
    return Math.hypot(this.x, this.y);
  }

  get lengthSquared() {
    return this.x * this.x + this.y * this.y;
  }

  get angle() {
    return Math.atan2(this.y, this.x);
  }

  static angle(a: Vec2, b: Vec2) {
    return Math.atan2(b.y - a.y, b.x - a.x);
  }

  rotate(angle: number) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const x = this.x * cos - this.y * sin;
    const y = this.x * sin + this.y * cos;
    this.x = x;
    this.y = y;
    return this;
  }

  scale(scalar: number) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  distance(other: Vec2) {
    return Math.hypot(this.x - other.x, this.y - other.y);
  }

  distanceSquared(other: Vec2) {
    return (this.x - other.x) ** 2 + (this.y - other.y) ** 2;
  }

  add(a: Vec2, b: Vec2, scalar = 1) {
    this.x = a.x + b.x * scalar;
    this.y = a.y + b.y * scalar;
    return this;
  }

  addVec(other: Vec2, scalar = 1) {
    this.x += other.x * scalar;
    this.y += other.y * scalar;
    return this;
  }

  sub(a: Vec2, b: Vec2, scalar = 1) {
    this.x = a.x - b.x * scalar;
    this.y = a.y - b.y * scalar;
    return this;
  }

  subVec(other: Vec2, scalar = 1) {
    this.x -= other.x * scalar;
    this.y -= other.y * scalar;
    return this;
  }

  normalize(length = 1) {
    const len = this.length;
    if (len === 0) {
      this.x = length;
      this.y = 0;
    } else {
      this.x = (this.x / len) * length;
      this.y = (this.y / len) * length;
    }
    return this;
  }

  get left() {
    const x = this.x;
    this.x = -this.y;
    this.y = x;
    return this;
  }

  get right() {
    const x = this.x;
    this.x = this.y;
    this.y = -x;
    return this;
  }
}
