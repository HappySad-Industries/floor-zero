/* eslint-disable no-unused-vars, no-global-assign */
/* globals cursor, moveMode, targetMode, player, targetVisual, takingAction, lookForTargets, Tooltip, tooltipHovering, tooltip, HitboxRect, ui, Vector, FIELD_HEIGHT */

class UIElement {
  constructor (spot, x, y, width, height, offset) {
    this.spot = spot;
    this.click = `ui-click-${this.spot}`;
    this.hover = `ui-hover-${this.spot}`;
    // this.tooltip = 'Hey friends, it\'s me, Mr. Tooltip! I am not sure why I am here, but I was told to be here!';
    this.tooltip = new Tooltip(this.spot + ' ' + 'Hey friends, it\'s me, Mr. Tooltip! I am not sure why I am here, but I was told to be here!');
    this.hitbox = new HitboxRect(width, height, offset);
    this.hitbox.assign(this);
    this.position = new Vector(x, y);

    var self = this;
    document.addEventListener(this.click, function (event) {
      self.clicked(event);
    });
    document.addEventListener(this.hover, function (event) {
      self.hovered(event);
    });
  }

  clicked (event) {
    console.log(`No listener for ${this.click}`);
  }

  hovered (event) {
    if (!tooltipHovering.time) {
      tooltipHovering.spot = this.spot;
      tooltipHovering.time = Date.now();
      tooltipHovering.initial = true;
    } else if (tooltipHovering.initial && tooltipHovering.spot === this.spot && Date.now() - tooltipHovering.time >= 1000) { // If it has been at least a second
      tooltip = this.tooltip; // this.tooltip.render(cursor.x, cursor.y, uiCanvas.context);
      tooltipHovering.initial = false;
    } else if (!tooltipHovering.initial && tooltipHovering.spot !== this.spot) {
      tooltipHovering.spot = this.spot;
      tooltipHovering.time = Date.now();
    } else if (!tooltipHovering.initial && tooltipHovering.spot === this.spot && Date.now() - tooltipHovering.time >= 500) {
      tooltip = this.tooltip; // this.tooltip.render(cursor.x, cursor.y, uiCanvas.context);
    } else if (tooltipHovering.initial && tooltipHovering.spot !== this.spot && Date.now() - tooltipHovering.time < 1000) {
      tooltipHovering = {spot: false, time: false, initial: false};
    }
  }
}

function createUIBar () {
  for (let i = 0; i < 13; i++) ui.push(new UIElement(i, i * 64, FIELD_HEIGHT, 64, 64, new Vector(32, 32)));

  ui[0].clicked = () => {
    if (moveMode) {
      moveMode = false;
      targetVisual = false;
      player.cancelMove();
    } else if (takingAction === player) {
      if (!targetMode) {
        moveMode = true;
      } else {
        cancelTargeting();
      }
    }
  };

  ui[1].clicked = () => {
    lookForTargets(player.spellbook.getSpell('Basic Attack'));
  };
  ui[2].clicked = () => {
    lookForTargets(player.spellbook.getSpell('Fireball'));
  };

  ui[12].clicked = () => {
    window.alert('🤨⏸☺️');
  };
}
