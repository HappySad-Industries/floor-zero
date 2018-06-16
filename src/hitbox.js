/* globals context, Vector */

// Hitbox class

class Hitbox { // eslint-disable-line no-unused-vars
  constructor (offset) {
    this.offset = offset || new Vector(0, 0);
  }

  pos () {
    return this.entity.position.add(this.offset);
  }

  assign (entity, multi = false) {
    if (!multi) {
      entity.hitbox = this;
    }
    this.entity = entity;
    if (this instanceof HitboxMulti) {
      for (let i in this.hitboxes) {
        this.hitboxes[i].assign(entity, true);
      }
    }
  }

  unassign () {
    this.entity.hitbox = undefined;
    this.entity = undefined;
  }

  // Overriden by subclasses. Checks if a point collides with the hitbox.
  isColliding (point) {
    return false; // Placeholder
  }

  // Overriden by subclasses. Visualizes the hitbox.
  render () {
    return false;
  }
}

// Circular hitbox (centered on position)
class HitboxCircle extends Hitbox { // eslint-disable-line no-unused-vars
  constructor (radius, offset) {
    super(offset);
    this.radius = radius;
  }

  isColliding (point) {
    return point.distance(this.pos()) < this.radius;
  }

  render () {
    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.stroke();
  }
}

// Rectangular hitbox (centered on position)
class HitboxRect extends Hitbox { // eslint-disable-line no-unused-vars
  constructor (width, height, offset) {
    super(offset);
    this.width = width;
    this.height = height;
  }

  isColliding (point) {
    let thisX = this.pos().x;
    let thisY = this.pos().y;
    return point.x > thisX - (this.width / 2) &&
    point.x < thisX + (this.width / 2) &&
    point.y > thisY - (this.height / 2) &&
    point.y < thisY + (this.height / 2);
  }
}

// Hitbox consisting of multiple other hitboxes
class HitboxMulti extends Hitbox { // eslint-disable-line no-unused-vars
  constructor (hitboxes, offset) {
    super(offset);
    this.hitboxes = hitboxes || [];
  }

  isColliding (point) {
    for (let i in this.hitboxes) {
      if (this.hitboxes[i].isColliding(point)) {
        return true;
      }
    }
    return false;
  }

  render () {
    for (let i in this.hitboxes) {
      this.hitboxes[i].render();
    }
  }
}