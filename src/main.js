/* globals Player, Enemy, Event, StatBlock, render, loadSprites, loadUI, renderUI, renderEffects, renderMovement, Vector, TargetArrow */

// Ability list
/* globals Fireball */

// Hitbox types

console.log('Main.js loaded');

let debug = false;
let lastRenderUpdate = Date.now();
let lastLogicUpdate = Date.now();
let canvas, cursor, context, creatures, player, clicking; // eslint-disable-line no-unused-vars
let moveMode = false; // eslint-disable-line no-unused-vars
let targetVisual = false;
let takingAction = false;
let targetMode = false;
let targetSpell = false;
let target = false;

let halted = false;

const FIELD_WIDTH = (13 * 64);
const CANVAS_WIDTH = FIELD_WIDTH + 2; // 834
const FIELD_HEIGHT = 448;
const CANVAS_HEIGHT = (FIELD_HEIGHT + 64) + 4; // 516
let fps = 1000;
let ups = 10;

function lookForTargets (spell) { // eslint-disable-line no-unused-vars
  if (targetSpell === spell) {
    console.log('Exiting targeting mode');
    targetVisual = false;
    targetMode = false;
    targetSpell = false;
    target = false;
  } else {
    if (takingAction !== player) {
      return;
    }
    if (spell.targetType === 'arrow') {
      targetVisual = new TargetArrow(player.position.clone());
      targetVisual.setStyle(spell.style);
    }
    console.log('targetVisual true');

    targetMode = true;
    targetSpell = spell;
  }
}

function cancelTargeting () {
  targetVisual = false;
  targetMode = false;
  targetSpell = false;
  target = false;

  moveMode = false;
  targetVisual = false;
  player.cancelMove();
}

function mouseHover () {
  for (let i = 0; i < creatures.length; i++) {
    if (creatures[i].hitbox.isColliding(cursor)) {
      creatures[i].hitbox.flags.hovered = true;
    } else {
      creatures[i].hitbox.flags.hovered = false;
    }
  }
}

function mouseClick () {
  for (let i = 0; i < creatures.length; i++) {
    if (creatures[i].hitbox.isColliding(cursor)) {
      if (targetMode) {
        console.log(`Targeting creature ${creatures[i].name}`);
        target = creatures[i];
        targetMode = false;
      } else {
        console.log(`Clicking on creature ${creatures[i].name}`);
      }
    }
  }
  const UI_TOP = CANVAS_HEIGHT - 64;
  const UI_LEFT = 1;
  for (let i = 0; i < 13; i++) {
    if (cursor.y > UI_TOP && (cursor.x > UI_LEFT + i * 64 && cursor.x < UI_LEFT + i * 64 + 64)) {
      if (i !== 0) {
        console.log(`ui-click-${i}`);
        document.dispatchEvent(new Event(`ui-click-${i}`));
      } else {
        console.log(`ui-click-${i}`);
        document.dispatchEvent(new Event(`ui-click-${i}`));
      }
    }
  }
}

function executeClick () {
  if (cursor.y < CANVAS_HEIGHT - 64 - 2) {
    if (takingAction === player && moveMode && !player.moveTarget) {
      player.move(cursor.clone());
      halted = true;
      moveMode = false;
      targetVisual = false;
    }
  }
}

function initialize () {
  if (debug) console.log('Initializing game');

  canvas = document.getElementById('canvas');
  context = canvas.getContext('2d');

  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  let container = document.getElementById('container');
  container.style.textAlign = 'center';

  cursor = new Vector(-50, -50);
  document.addEventListener('mousemove', (e) => {
    var rect = canvas.getBoundingClientRect(); // Gets the absolute size of the canvas
    cursor.x = e.clientX - rect.left; // Adjust cursor coordinates to be relative to element
    cursor.y = e.clientY - rect.top;
  });
  document.addEventListener('click', (e) => {
    mouseClick();
    if (cursor.x > 0 && cursor.x < CANVAS_WIDTH && cursor.y > 0 && cursor.y < CANVAS_HEIGHT) {
      executeClick();
    }
  });
  document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    cancelTargeting();
  });
  document.addEventListener('mousedown', () => {
    clicking = true;
  });
  document.addEventListener('mouseup', () => {
    clicking = false;
  });
}

function startGame () {
  creatures = []; // Array of the creatures in the game, including the player

  player = new Player(200, 200);
  player.addStats(new StatBlock(20));
  player.stats.takeDamage(5);
  player.addSpellbook([new Fireball()]);
  new Enemy(500, 100).addStats(new StatBlock(5));
  new Enemy(300, 100).addStats(new StatBlock(5));
}

function logicUpdate () {
  let now = Date.now();
  let dt = now - lastLogicUpdate; // eslint-disable-line no-unused-vars
  lastLogicUpdate = now;

  if (!takingAction && !halted) {
    for (let i in creatures) {
      creatures[i].actionTimer -= creatures[i].stats.getStat('initiative');
      if (creatures[i].actionTimer <= 0) {
        creatures[i].actionTimer += creatures[i].maxActionTimer;
        takingAction = creatures[i];
        console.log(`It is ${takingAction.name}'s action.`);
        break;
      }
    }
  } else if (!halted) {
    if (takingAction !== player) {
      let endPosition = new Vector(-20, -20);
      while (endPosition.x < 0 || endPosition.x > FIELD_WIDTH || endPosition.y < 0 || endPosition.y > FIELD_HEIGHT) {
        endPosition = Vector.random(takingAction.stats.getStat('movement')).add(takingAction.position);
      }
      takingAction.move(endPosition);
      halted = true;
    }
  }

  if (targetMode === false && targetSpell && target) {
    // targetMode needs to be false for future spells with multiple targets
    targetSpell.cast(target);
    targetVisual = false;
    targetMode = false;
    targetSpell = false;
    target = false;
  }

  creatures.map(creature => {
    if (creature.stats.hp() <= 0) {
      creature.die();
    } else {
      return creature;
    }
  });

  let arr = creatures.slice();
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].stats.hp() <= 0) {
      arr[i].die();
    }
  }

  mouseHover();

  if (creatures.length === 1 && creatures[0] === player) {
    window.alert('Congrats! You won! 🤫🤩👌');
  }
}

function renderUpdate (sprites, uiSprites) {
  let now = Date.now();
  let dt = now - lastRenderUpdate;
  lastRenderUpdate = now;

  render(sprites);
  renderUI(uiSprites);
  renderEffects();
  if (takingAction && takingAction.moveTarget) {
    renderMovement(dt, takingAction);
  }
}

initialize();
startGame();

loadUI().then((uiSprites) => {
  loadSprites().then((sprites) => {
    setInterval(renderUpdate, 1000 / fps, sprites, uiSprites);
  });
});

setInterval(logicUpdate, 1000 / ups);
