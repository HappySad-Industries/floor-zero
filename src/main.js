/* globals Player, Enemy, StatBlock, render, loadSprites, loadUI, renderUI, renderEffects, renderMovement, Vector, TargetArrow */

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

const CANVAS_WIDTH = (13 * 64) + 2; // 834
const CANVAS_HEIGHT = (448 + 64) + 4; // 516
let fps = 1000;
let ups = 10;

function lookForTargets (spell) {
  if (targetSpell.targetType === 'arrow') {
    targetVisual = new TargetArrow(player.position.clone());
  }
  console.log('targetVisual true');

  targetMode = true;
  targetSpell = spell;
}

function mouseHover () {
  for (let i = 0; i < creatures.length; i++) {
    if (creatures[i].hitbox.isColliding(cursor)) {
      console.log(`Hovering over creature ${creatures[i].name}`);
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
}

function executeClick () {
  if (cursor.y < CANVAS_HEIGHT - 64 - 2) {
    if (takingAction === player && moveMode && !player.moveTarget) {
      console.log('targetVisual false');
      player.move(cursor.clone());
      moveMode = false;
      targetVisual = false;
    }
  }
  return true;
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
    if (cursor.x > 0 && cursor.x < CANVAS_WIDTH && cursor.y > 0 && cursor.y < CANVAS_HEIGHT) {
      executeClick();
    }
    mouseClick();
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

  player = new Player();
  player.moveTo(200, 200);
  player.addStats(new StatBlock(20));
  creatures.push(player);
  player.stats.takeDamage(5);
  player.addSpellbook([new Fireball()]);

  creatures.push(new Enemy().addStats(new StatBlock(5)).moveTo(300, 100));
  creatures.push(new Enemy().addStats(new StatBlock(5)).moveTo(500, 100));
}

function logicUpdate () {
  let now = Date.now();
  let dt = now - lastLogicUpdate; // eslint-disable-line no-unused-vars
  lastLogicUpdate = now;

  if (!takingAction) {
    for (let i in creatures) {
      creatures[i].actionTimer -= creatures[i].stats.getStat('initiative');
      if (creatures[i].actionTimer <= 0) {
        creatures[i].actionTimer += creatures[i].maxActionTimer;
        takingAction = creatures[i];
        break;
      }
    }
  } else {
    console.log(`It is ${takingAction.name}'s action.`);
  }

  if (targetMode === false && targetSpell && target) {
    // targetMode needs to be false for future spells with multiple targets
    targetSpell.cast(target);
    target = false;
    targetVisual = false;
  }

  mouseHover();
}

function renderUpdate (sprites, uiSprites) {
  let now = Date.now();
  let dt = now - lastRenderUpdate;
  lastRenderUpdate = now;

  render(sprites);
  renderUI(uiSprites);
  renderEffects();
  if (takingAction && takingAction.moveTarget) renderMovement(dt, takingAction);
}

initialize();
startGame();

loadUI().then((uiSprites) => {
  loadSprites().then((sprites) => {
    setInterval(renderUpdate, 1000 / fps, sprites, uiSprites);
  });
});

setInterval(logicUpdate, 1000 / ups);
