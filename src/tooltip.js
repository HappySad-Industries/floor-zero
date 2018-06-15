/* globals context */

// Tooltip class

class Tooltip { // eslint-disable-line no-unused-vars
  constructor (lines) {
    this.lines = lines || [];
    this.width = 80;
  }

  // Generates all of the text to be displayed in the tooltip
  text () {
    let text = '';
    for (let i in this.lines) {
      if (this.lines[i] instanceof String) {
        text += this.lines[i];
      } else if (this.lines[i] instanceof Function) {
        text += this.lines[i]();
      }
    }
    return text;
  }
}

// Tooltip line class (for individual lines of text)

class TooltipLine { // eslint-disable-line no-unused-vars
  constructor (text) {
    this.text = text;
  }

  wrapText (startX, startY, width, lineHeight, initialIndent) {
    let text;
    let textLines = [];
    if (this.text instanceof String) {
      text = this.text;
    } else if (this.text instanceof Function) {
      text = this.text();
    }
    let yOffset = 0;
    let words = text.split(' ');
    let line = '';
    if (initialIndent) {
      while (context.measureText(line).width < initialIndent - 3) {
        line += ' ';
      }
    }
    let lastLineWidth = 0;

    for (let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + ' ';
      let metrics = context.measureText(testLine);
      let testWidth = metrics.width;
      if ((testWidth > width && n > 0) || words[n] === '~') {
        textLines.push({text: line, startX: startX, startY: startY});
        // context.fillText(line, startX, startY);
        if (words[n] === '~') {
          line = '';
        } else {
          line = words[n] + ' ';
        }
        startY += lineHeight;
        yOffset += lineHeight;
      } else {
        line = testLine;
      }
      lastLineWidth = testWidth;
    }
    // context.fillText(line, startX, startY);
    textLines.push({text: line, startX: startX, startY: startY});
    yOffset += lineHeight;
    return {textLines: textLines, width: lastLineWidth, height: yOffset, lastLine: line};
  }
}
