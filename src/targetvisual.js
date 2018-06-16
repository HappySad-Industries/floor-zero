
/* globals context, cursor */

// Target visual class

class TargetVisual {
  render () {
    return false;
  }
}

// Basic target arrow. Extends from a point to the position of the cursor.
class TargetArrow extends TargetVisual { // eslint-disable-line no-unused-vars
  constructor (startPoint, maxLength = false) {
    super();
    this.startPoint = startPoint;
    this.maxLength = maxLength;
  }

  render () {
    context.beginPath();
    context.moveTo(this.startPoint.x, this.startPoint.y);
    if (this.maxLength && this.startPoint.to(cursor).magnitude() > this.maxLength) {
      console.log('more than max');
      let direction = this.startPoint.to(cursor).unit(this.maxLength);
      context.lineTo(direction.x, direction.y);
    } else {
      context.lineTo(cursor.x, cursor.y);
    }
    context.stroke();
  }
}
