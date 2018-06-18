/* globals Vector, context, cursor, restoreRenderDefaults */

// Target visual class

class TargetVisual {
  constructor () {
    this.flags = {
      shouldRender: true
    };
    this.style = {
      strokeStyle: 'black',
      fillStyle: 'black',
      lineWidth: 4
    };
  }

  render () {
    return false;
  }

  setStyle (style) {
    for (let i in style) {
      this.style[i] = style[i];
    }
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
    if (!this.flags.shouldRender) {
      return; // Don't render something that shouldn't be rendered
    }
    let directionVector = this.startPoint.to(cursor);
    if (this.maxLength) {
      directionVector = directionVector.limit(this.maxLength);
    }

    context.strokeStyle = this.style.strokeStyle;
    context.lineWidth = this.style.lineWidth;
    context.fillStyle = this.style.fillStyle;

    context.save();
    context.beginPath();
    context.moveTo(this.startPoint.x, this.startPoint.y);
    let endVect = directionVector.unit(directionVector.magnitude() - context.lineWidth - 10).add(this.startPoint);
    let endX = directionVector.x + this.startPoint.x;
    let endY = directionVector.y + this.startPoint.y;
    context.lineTo(endVect.x, endVect.y);
    context.translate(endX, endY);
    context.rotate(directionVector.theta());
    context.stroke();
    context.moveTo(0, 0);
    context.lineTo(-5 * context.lineWidth, -2 * context.lineWidth);
    context.lineTo(-5 * context.lineWidth, 2 * context.lineWidth);
    context.lineTo(0, 0);
    context.fill();
    context.restore();

    restoreRenderDefaults();
  }
}
