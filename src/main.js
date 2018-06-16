/* globals Player, Enemy, StatBlock, render, loadSprites, loadUI, renderUI, renderMovement, Vector */

// Ability list
/* globals Fireball */

// Hitbox types
/* globals HitboxCircle */

console.log('Main.js loaded');

let debug = false;
let lastRenderUpdate = Date.now();
let lastLogicUpdate = Date.now();
let canvas, cursor, context, creatures, player, clicking; // eslint-disable-line no-unused-vars
let takingAction = false;

const CANVAS_WIDTH = (13 * 64) + 2; // 834
const CANVAS_HEIGHT = (448 + 64) + 4; // 516
let fps = 1000;
let ups = 10;

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
  player.addStats(new StatBlock(20));
  creatures.push(player);
  player.stats.takeDamage(5);
  player.addSpellbook([new Fireball()]);

  creatures.push(new Enemy().addStats(new StatBlock(5)).moveTo(300, 100));
  creatures.push(new Enemy().addStats(new StatBlock(5)).moveTo(500, 100));
}

function logicUpdate () {
  let now = Date.now();
  let dt = now - lastLogicUpdate;
  lastLogicUpdate = now;

  if (!takingAction) {
    for (let i in creatures) {
      creatures[i].actionTimer -= creatures[i].stats.getStat('initiative');
      if (creatures[i].actionTimer <= 0) {
        creatures[i].actionTimer += creatures[i].maxActionTimer;
        takingAction = creatures[i];
        console.log(`It is now ${creatures[i].name}'s action.`);
        break;
      }
    }
  } else {

  }
}

function renderUpdate (sprites, uiSprites) {
  let now = Date.now();
  let dt = now - lastRenderUpdate;
  lastRenderUpdate = now;

  render(sprites);
  renderUI(uiSprites);
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

function executeClick () {
  if (cursor.y < CANVAS_HEIGHT - 64 - 2) {
    if (takingAction === player && !player.moveTarget) player.move(cursor.clone());
  }
  return true;
}
