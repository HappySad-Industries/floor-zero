
/* globals context, cursor */

// Target visual class

class TargetVisual {
  render () {
    return false;
  }
}

// Basic target arrow. Extends from a point to the position of the cursor.
class TargetArrow extends TargetVisual { // eslint-disable-line no-unused-vars
  constructor (startPoint) {
    super();
    this.startPoint = startPoint;
  }

  render () {
    context.beginPath();
    context.moveTo(this.startPoint.x, this.startPoint.y);
    context.lineTo(cursor.x, cursor.y);
    context.stroke();
  }
}
