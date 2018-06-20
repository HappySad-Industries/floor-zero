/* globals restoreRenderDefaults, uiCanvas, CANVAS_HEIGHT, CANVAS_WIDTH, FIELD_HEIGHT */

// Tooltip class

class Text {
  constructor (text) {
    if (Array.isArray(text)) {
      this.text = text;
    } else {
      this.text = [text];
    }
  }

  renderText (x, y, context, textColor = 'black', backgroundColor = false, lineHeight = 20, width = false) {
    restoreRenderDefaults(uiCanvas.context);
    let text = this.text;
    if (width) {
      text = Text.wrapText(text.join(''), width);
    }
    if (backgroundColor) {
      context.fillStyle = backgroundColor;
      context.fillRect(x, y - lineHeight, width, lineHeight * text.length);
      restoreRenderDefaults(uiCanvas.context);
    }

    context.fillStyle = textColor;

    for (let i = 0; i < text.length; i++) {
      context.fillText(text[i], x, y);
      y += lineHeight;
    }
    restoreRenderDefaults(uiCanvas.context);
  }

  /* eslint-disable no-multi-spaces */
  static wrapText (text, width) {                                          // The text (a string) to be wrapped, the maximum width in pixels
    let wrappedText = [];                                                  // The array of wrapped lines that will be returned
    let words = text.split(' ');                                           // Split the text into an array of 'words' each space
    let line = '';                                                         // Create an empty string that we will build our lines off of

    for (let i = 0; i < words.length; i++) {                               // Iterate over words
      let testLine = line + words[i] + ' ';                                // Create a test line with the tested line so far and the next word
      if (uiCanvas.context.measureText(testLine).width > width && i > 0) { // If the width of the line is greater than the maxmium width and it isn't the first word
        wrappedText.push(line);                                            // The line is as wide as can be, so consider it wrapped
        line = words[i] + ' ';                                             // Start a new line with the current word
      } else {                                                             // If the width was fine, or it wasn't but it was the first word
        line = testLine;                                                   // Add the word to the line and continue
      }
    }

    wrappedText.push(line);                                                // Make sure the last line is pushed

    return wrappedText;
  }
  /* eslint-enable no-multi-spaces */
}

class Tooltip extends Text {
  constructor (text, width = 200, lineHeight = 20) {
    super(text);
    this.width = width;
    this.lineHeight = 20;
  }
  render (x, context) {
    let lines = Text.wrapText(this.text.join(''), this.width).length;
    let y = FIELD_HEIGHT - this.lineHeight * lines;
    if (x + this.width / 2 > CANVAS_WIDTH) {
      x -= this.width;
    } else if (x - this.width / 2 > 0) {
      x -= this.width / 2;
    }

    restoreRenderDefaults(uiCanvas.context);
    this.renderText(x, y, context, '#222034', '#cbdbfc', this.lineHeight, this.width);
    restoreRenderDefaults(uiCanvas.context);
  }
}
