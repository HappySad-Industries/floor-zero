/* globals Player, Enemy, Event, StatBlock, renderMain, loadSprites, loadUI, renderUI, renderEffects, renderMovement, Vector, TargetArrow, createUIBar */

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
let win = false; // Because it is that kind of game
let tooltip = false; // Tooltip to be rendered
let tooltipHovering = {
  spot: false, // The UI Spot hovered over
  time: false, // How long it has been hovered over
  initial: false // Is this the first tooltip being hovered?
};
let ui = []; // Array of the UI buttons
let uiCanvas = {
  canvas: false,
  context: false
};

let halted = false;

const CANVAS_WIDTH = (13 * 64) + 2; // 834
const CANVAS_HEIGHT = (448 + 64) + 4; // 516
const FIELD_WIDTH = CANVAS_WIDTH - 2; // 832
const FIELD_HEIGHT = CANVAS_HEIGHT - 64; // 448

let fps = 60;
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
  let uiHovered = false;
  tooltip = false;
  // Did we click on a UI element?
  for (let i = 0; i < ui.length; i++) {
    if (ui[i].hitbox.isColliding(cursor)) {
      uiHovered = true;
      ui[i].hitbox.flags.hovered = true;
      document.dispatchEvent(new Event(`ui-hover-${ui[i].spot}`));
    } else {
      ui[i].hitbox.flags.hovered = false;
    }
  }

  if (!uiHovered) tooltipHovering = {spot: false, time: false, initial: false};

  // Did we click on a creature element?
  for (let i = 0; i < creatures.length; i++) {
    if (creatures[i].hitbox.isColliding(cursor)) {
      creatures[i].hitbox.flags.hovered = true;
    } else {
      creatures[i].hitbox.flags.hovered = false;
    }
  }
}

function mouseClick () {
  // Did we click on a UI element?
  for (let i = 0; i < ui.length; i++) {
    if (ui[i].hitbox.isColliding(cursor)) {
      ui[i].hitbox.flags.hovered = true;
      document.dispatchEvent(new Event(`ui-click-${ui[i].spot}`));
    } else {
      ui[i].hitbox.flags.hovered = false;
    }
  }

  // Did we click on a creature?
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

  uiCanvas.canvas = document.querySelector('#uicanvas');
  uiCanvas.context = uiCanvas.canvas.getContext('2d');
  canvas = document.querySelector('#maincanvas');
  context = canvas.getContext('2d');

  uiCanvas.canvas.width = CANVAS_WIDTH;
  uiCanvas.canvas.height = CANVAS_HEIGHT;
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

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

  createUIBar();
  restoreRenderDefaults();
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
      if (creatures[i].actionTimer <= 0) {
        creatures[i].actionTimer += creatures[i].maxActionTimer;
        takingAction = creatures[i];
        console.log(`It is ${takingAction.name}'s action.`);
        break;
      }
      creatures[i].actionTimer -= creatures[i].stats.getStat('initiative');
    }
  } else if (!halted) {
    if (takingAction !== player) {
      takingAction.move(takingAction.intelligence.move());
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
    takingAction = false;
  }

  creatures.map(creature => {
    if (creature.stats.hp() <= 0) {
      creature.die();
    } else {
      return creature;
    }
  });

  mouseHover();

  if (win && creatures.length === 1 && creatures[0] === player) {
    window.alert('Congrats! You won! 🤫🤩👌');
  }
}

function renderUpdate (sprites, uiSprites) {
  let now = Date.now();
  let dt = now - lastRenderUpdate;
  lastRenderUpdate = now;

  renderMain(sprites);
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
    setInterval(renderUpdate, 0, sprites, uiSprites);
  });
});

setInterval(logicUpdate, 1000 / ups);
