/* globals moveMode, player, target, targetMode, lookForTargets */

document.addEventListener('ui-click-0', () => {
  moveMode = true;
});

document.addEventListener('ui-click-1', () => {
  lookForTargets(player.spellbook.getSpell('Fireball'));
});
