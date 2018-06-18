// vector class

class Vector { // eslint-disable-line no-unused-vars
  constructor (x, y) {
    this.x = x;
    this.y = y;
  }

  // INSTANCE functions

  clone () {
    return new Vector(this.x, this.y);
  }

  distance (other) { // calculates the distance to another vector
    return Math.sqrt(Math.pow(other.x - this.x, 2) + Math.pow(other.y - this.y, 2));
    // looks fancy but it's just the pythagorean theorem
  }

  magnitude () {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  limit (scale = 1) {
    if (this.magnitude() > scale) {
      return this.unit(scale);
    }
    return this.clone();
  }

  unit (scale = 1) {
    return new Vector(scale * this.x / this.magnitude(), scale * this.y / this.magnitude());
  }

  theta (degrees = false) {
    let rads = Math.atan2(this.y, this.x);
    if (degrees) {
      return rads / Math.PI * 180;
    }
    return rads;
  }

  rotate (rads, add = false) {
    let vect = new Vector();
    let mag = this.magnitude();
    let theta = rads;
    if (add) {
      theta += this.theta();
    }
    vect.x = mag * Math.cos(theta);
    vect.y = mag * Math.sin(theta);

    return vect;
  }

  to (target) {
    return new Vector(target.x - this.x, target.y - this.y);
  }

  add (other) {
    return new Vector(this.x + other.x, this.y + other.y);
  }

  // STATIC functions

  static distance (vec1, vec2) { // calculates distance between two vectors
    return vec1.distance(vec2);
  }

  static random (mag = 1) {
    let vect = new Vector(Math.random(), Math.random());
    if (mag !== 1) {
      return vect.unit(mag);
    }
    return vect;
  }
}
