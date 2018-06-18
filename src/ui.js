/* globals moveMode, player, targetVisual, lookForTargets */

document.addEventListener('ui-click-0', () => {
  if (moveMode) {
    moveMode = false;
    targetVisual = false;
    player.cancelMove();
  } else {
    moveMode = true;
  }
});

document.addEventListener('ui-click-1', () => {
  lookForTargets(player.spellbook.getSpell('Fireball'));
});

document.addEventListener('ui-click-12', () => {
  window.alert('🤨⏸☺️');
});
