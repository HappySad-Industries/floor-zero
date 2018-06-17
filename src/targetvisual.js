
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
    let arrowVector = this.startPoint.to(cursor);
    if (this.maxLength) {
      arrowVector = arrowVector.limit(this.maxLength);
    }
    console.log(`${arrowVector.magnitude()} (${arrowVector.x}, ${arrowVector.y})`);
    context.lineTo(arrowVector.x, arrowVector.y);
    context.stroke();
  }
}
