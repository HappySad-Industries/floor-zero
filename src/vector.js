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

  // STATIC functions

  static distance (vec1, vec2) { // calculates distance between two vectors
    return vec1.distance(vec2);
  }
}
