/* globals cursor, moveMode, player, targetVisual, takingAction, lookForTargets, Tooltip */

class UIElement {
  constructor (spot) {
    this.spot = spot;
    this.click = `ui-click-${this.spot}`;
    this.hover = `ui-hover-${this.spot}`;
    // this.tooltip = 'Hey friends, it\'s me, Mr. Tooltip! I am not sure why I am here, but I was told to be here!';
    this.tooltip = new Tooltip('Hey friends, it\'s me, Mr. Tooltip! I am not sure why I am here, but I was told to be here!');

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
    console.log(`Default listener for ${this.hover}`);
    console.log(this.tooltip);
    this.tooltip.render(cursor.x, cursor.y);
  }
}

new UIElement(2);

document.addEventListener('ui-click-0', () => {
  if (moveMode) {
    moveMode = false;
    targetVisual = false;
    player.cancelMove();
  } else if (takingAction === player) {
    moveMode = true;
  }
});

document.addEventListener('ui-click-1', () => {
  lookForTargets(player.spellbook.getSpell('Fireball'));
});

document.addEventListener('ui-click-12', () => {
  window.alert('🤨⏸☺️');
});
